import { createTimeoutSignal, sanitizeHttpsUrl } from './url.js';

export interface NowPlayingTrack {
  name: string;
  artist: string;
  album: string;
  date: string;
  url: string;
  artworkUrl: string;
  isLive: boolean;
}

interface LastFmImage {
  '#text'?: unknown;
  size?: unknown;
}

interface RawLastFmTrack {
  name?: unknown;
  url?: unknown;
  artist?: { '#text'?: unknown };
  album?: { '#text'?: unknown };
  date?: { '#text'?: unknown };
  image?: LastFmImage[];
  '@attr'?: { nowplaying?: unknown };
}

interface LastFmRecentTracksResponse {
  error?: unknown;
  message?: unknown;
  recenttracks?: {
    track?: RawLastFmTrack | RawLastFmTrack[];
  };
}

export class LastFmFetchError extends Error {
  readonly rateLimited: boolean;

  constructor(message: string, rateLimited = false) {
    super(message);
    this.rateLimited = rateLimited;
  }
}

const LASTFM_USER = 'iambhvsh';
const DEFAULT_LASTFM_PROFILE = `https://www.last.fm/user/${LASTFM_USER}`;
const LASTFM_API_BASE = 'https://ws.audioscrobbler.com/2.0/';
const MAX_FIELD_LENGTH = 300;
const LASTFM_DEFAULT_ART_HASH = '2a96cbd8b46e442fc41c2b86b821562f';
const LASTFM_IMAGE_SIZES = ['mega', 'extralarge', 'large', 'medium', 'small'] as const;

export function readSafeText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX_FIELD_LENGTH) : fallback;
}

function stripBrackets(value: string): string {
  let out = '';
  let depth = 0;

  for (const ch of value) {
    if (ch === '(' || ch === '[') {
      depth += 1;
    } else if ((ch === ')' || ch === ']') && depth > 0) {
      depth -= 1;
    } else if (depth === 0) {
      out += ch;
    }
  }

  return out;
}

export function cleanTrackText(value: string): string {
  if (!value) return value;
  const withoutBrackets = stripBrackets(value);
  const lower = withoutBrackets.toLowerCase();

  let cutoff = withoutBrackets.length;
  for (const marker of [' feat.', ' feat ', ' ft.', ' ft ', ' featuring ']) {
    const idx = lower.indexOf(marker);
    if (idx > 0 && idx < cutoff) {
      cutoff = idx;
    }
  }

  const cleaned = withoutBrackets
    .slice(0, cutoff)
    .split(' ')
    .filter(Boolean)
    .join(' ')
    .trim();

  return cleaned || value;
}

function extractLastFmArtwork(images: LastFmImage[] | undefined): string {
  if (!Array.isArray(images)) return '';

  for (const size of LASTFM_IMAGE_SIZES) {
    const match = images.find((img) => img?.size === size);
    const raw = readSafeText(match?.['#text']).replace(/^http:/i, 'https:');
    if (!raw || raw.includes(LASTFM_DEFAULT_ART_HASH)) continue;

    const clean = sanitizeHttpsUrl(raw, ['freetls.fastly.net', 'akamaized.net']);
    if (clean) return clean;
  }

  return '';
}

function extractRawTrack(json: LastFmRecentTracksResponse): RawLastFmTrack | undefined {
  if (typeof json.error === 'number') {
    const msg = readSafeText(json.message, `Last.fm error ${json.error}`);
    throw new LastFmFetchError(msg, json.error === 29);
  }
  const raw = json?.recenttracks?.track;
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Fetch the latest or currently playing Last.fm track using a server-side API key. */
export async function fetchLastFmLatestTrack(
  apiKey: string,
  timeoutMs = 10000,
  externalSignal?: AbortSignal
): Promise<NowPlayingTrack> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new LastFmFetchError('Missing LASTFM_API_KEY');
  }

  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: LASTFM_USER,
    api_key: cleanKey,
    format: 'json',
    limit: '1',
  });
  const endpoint = `${LASTFM_API_BASE}?${params.toString()}`;
  const req = createTimeoutSignal(timeoutMs, externalSignal);

  try {
    const res = await fetch(endpoint, {
      signal: req.signal,
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (res.status === 429) {
      throw new LastFmFetchError('Last.fm rate limit exceeded', true);
    }
    if (!res.ok) {
      throw new LastFmFetchError(`Last.fm API returned ${res.status}`);
    }

    const json = (await res.json()) as LastFmRecentTracksResponse;
    const t = extractRawTrack(json);
    if (!t || typeof t !== 'object') {
      throw new LastFmFetchError('No track data returned');
    }

    const isLive = t['@attr']?.nowplaying === 'true';
    const name = cleanTrackText(readSafeText(t.name, 'Unknown'));
    const artist = cleanTrackText(readSafeText(t.artist?.['#text']));
    const album = cleanTrackText(readSafeText(t.album?.['#text']));
    const date = isLive ? '' : readSafeText(t.date?.['#text']);
    const url = sanitizeHttpsUrl(t.url, ['last.fm'], DEFAULT_LASTFM_PROFILE);
    const artworkUrl = extractLastFmArtwork(t.image);

    return {
      name,
      artist,
      album,
      date,
      url,
      artworkUrl,
      isLive,
    };
  } finally {
    req.cleanup();
  }
}
