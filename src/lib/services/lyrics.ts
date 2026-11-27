import { createTimeoutSignal, sanitizeHttpsUrl } from './url';

export interface TrackLyrics {
  lines: string[];
  songUrl: string;
  submitterName: string;
  submitterUrl: string;
}

interface UnisonSubmitter {
  keyId?: unknown;
  displayName?: unknown;
}

interface UnisonLyricsData {
  videoId?: unknown;
  lyrics?: unknown;
  format?: unknown;
  submitter?: UnisonSubmitter;
}

interface UnisonApiResponse {
  success?: unknown;
  error?: unknown;
  code?: unknown;
  data?: UnisonLyricsData;
}

export class UnisonFetchError extends Error {
  readonly rateLimited: boolean;

  constructor(message: string, rateLimited = false) {
    super(message);
    this.rateLimited = rateLimited;
  }
}

const UNISON_BASE = 'https://unison.betterlyrics.org';
const MAX_CACHE_ENTRIES = 24;
const LRC_META_RE = /^\[(?:ti|ar|al|au|length|by|offset|re|ve):/i;
const LRC_TIMESTAMP_RE = /\[(?:\d{1,3}:)?\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g;
const ENHANCED_TIMESTAMP_RE = /<(?:\d{1,3}:)?\d{1,2}:\d{2}(?:[.:]\d{1,3})?>/g;
const SAFE_ID_RE = /^[a-zA-Z0-9_-]{4,128}$/;

const lyricsCache = new Map<string, TrackLyrics | null>();

function cacheKey(artist: string, song: string): string {
  return `${artist.trim().toLowerCase()}::${song.trim().toLowerCase()}`;
}

function setCachedLyrics(key: string, value: TrackLyrics | null): void {
  if (lyricsCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = lyricsCache.keys().next().value;
    if (oldest !== undefined) lyricsCache.delete(oldest);
  }
  lyricsCache.set(key, value);
}

function parsePlain(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseLrc(raw: string): string[] {
  const lines: string[] = [];

  for (const rawLine of raw.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed || LRC_META_RE.test(trimmed)) continue;

    const text = trimmed
      .replace(LRC_TIMESTAMP_RE, '')
      .replace(ENHANCED_TIMESTAMP_RE, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (text) lines.push(text);
  }

  return lines;
}

function stripXmlTags(raw: string): string {
  let out = '';
  let inTag = false;

  for (const ch of raw) {
    if (ch === '<') {
      inTag = true;
    } else if (ch === '>' && inTag) {
      inTag = false;
      out += ' ';
    } else if (!inTag) {
      out += ch;
    }
  }

  return out;
}

function readTtmlChild(node: ChildNode): { main: string; bg: string } {
  if (node.nodeType === 3) {
    return { main: node.textContent ?? '', bg: '' };
  }
  if (node.nodeType !== 1) {
    return { main: '', bg: '' };
  }

  const el = node as Element;
  const role = el.getAttribute('ttm:role') ?? el.getAttribute('role') ?? '';
  if (role === 'x-translation' || role === 'x-roman') {
    return { main: '', bg: '' };
  }

  const chunk = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (!chunk) return { main: '', bg: '' };

  return role === 'x-bg' ? { main: '', bg: chunk } : { main: chunk, bg: '' };
}

function readTtmlParagraphText(p: Element): string {
  const mainParts: string[] = [];
  const bgParts: string[] = [];

  for (const node of Array.from(p.childNodes)) {
    const part = readTtmlChild(node);
    if (part.main) mainParts.push(part.main);
    if (part.bg) bgParts.push(part.bg);
  }

  const cleanMain = mainParts.join('').replace(/\s+/g, ' ').trim();
  const cleanBg = bgParts.join(' ').trim();
  if (cleanMain && cleanBg) return `${cleanMain} (${cleanBg})`;
  return cleanMain || (cleanBg ? `(${cleanBg})` : '');
}

function parseTtml(raw: string): string[] {
  if (typeof DOMParser === 'undefined') {
    return parsePlain(stripXmlTags(raw));
  }

  const doc = new DOMParser().parseFromString(raw, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return parsePlain(stripXmlTags(raw));
  }

  const lines: string[] = [];
  for (const p of Array.from(doc.getElementsByTagName('p'))) {
    const text = readTtmlParagraphText(p);
    if (text) lines.push(text);
  }

  return lines;
}

function parseLyricsContent(raw: unknown, format: unknown): string[] {
  if (typeof raw !== 'string' || !raw.trim()) return [];
  if (format === 'ttml') return parseTtml(raw);
  if (format === 'lrc') return parseLrc(raw);
  return parsePlain(raw);
}

function toSafeUnisonPathId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  return SAFE_ID_RE.test(trimmed) ? trimmed : '';
}

function mapUnisonData(data: UnisonLyricsData | undefined): TrackLyrics | null {
  if (!data || typeof data !== 'object') return null;

  const lines = parseLyricsContent(data.lyrics, data.format);
  if (!lines.length) return null;

  const videoId = toSafeUnisonPathId(data.videoId);
  const rawSongUrl = videoId
    ? `${UNISON_BASE}/song/${encodeURIComponent(videoId)}`
    : UNISON_BASE;
  const songUrl = sanitizeHttpsUrl(rawSongUrl, ['unison.betterlyrics.org'], UNISON_BASE);

  const keyId = toSafeUnisonPathId(data.submitter?.keyId);
  const rawSubmitterUrl = keyId
    ? `${UNISON_BASE}/curator/${encodeURIComponent(keyId)}`
    : '';
  const submitterUrl = sanitizeHttpsUrl(rawSubmitterUrl, ['unison.betterlyrics.org']);

  const rawName = typeof data.submitter?.displayName === 'string'
    ? data.submitter.displayName.trim()
    : '';

  return {
    lines,
    songUrl,
    submitterName: rawName || (submitterUrl ? 'Unison contributor' : ''),
    submitterUrl,
  };
}

async function queryUnison(
  song: string,
  artist: string,
  externalSignal?: AbortSignal,
  timeoutMs = 8000
): Promise<TrackLyrics | null> {
  const req = createTimeoutSignal(timeoutMs, externalSignal);

  try {
    const params = new URLSearchParams({ song, artist });
    const res = await fetch(`${UNISON_BASE}/lyrics?${params.toString()}`, {
      signal: req.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });

    if (res.status === 404) return null;
    if (res.status === 429) {
      throw new UnisonFetchError('Unison rate limit exceeded', true);
    }
    if (res.status === 503) return null;
    if (!res.ok) {
      throw new UnisonFetchError(`Unison API returned ${res.status}`);
    }

    const json = (await res.json()) as UnisonApiResponse;
    if (json?.success !== true) return null;
    return mapUnisonData(json.data);
  } finally {
    req.cleanup();
  }
}

export async function fetchTrackLyrics(
  artist: string,
  song: string,
  externalSignal?: AbortSignal,
  forceRefresh = false
): Promise<TrackLyrics | null> {
  const cleanArtist = artist.trim();
  const cleanSong = song.trim();
  if (!cleanArtist || !cleanSong) return null;

  const key = cacheKey(cleanArtist, cleanSong);
  if (!forceRefresh && lyricsCache.has(key)) {
    return lyricsCache.get(key) ?? null;
  }

  const primaryArtist = cleanArtist.split(/[,&/]/)[0]?.trim() || '';
  const candidates = [cleanArtist];
  if (primaryArtist && primaryArtist !== cleanArtist) {
    candidates.push(primaryArtist);
  }

  for (const candidateArtist of candidates) {
    if (externalSignal?.aborted) return null;
    const hit = await queryUnison(cleanSong, candidateArtist, externalSignal);
    if (hit) {
      setCachedLyrics(key, hit);
      return hit;
    }
  }

  setCachedLyrics(key, null);
  return null;
}
