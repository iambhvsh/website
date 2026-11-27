import { metric } from '@vercel/functions';

// ── URL helpers ──────────────────────────────────────────────────────────────

function sanitizeHttpsUrl(
  raw: unknown,
  allowedDomains: readonly string[],
  fallback = ''
): string {
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return fallback;
    if (parsed.username || parsed.password) return fallback;
    const host = parsed.hostname.toLowerCase();
    const allowed = allowedDomains.some(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    );
    return allowed ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

function createTimeoutSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onAbort, { once: true });
    }
  }
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', onAbort);
    },
  };
}

// ── Last.fm types & helpers ───────────────────────────────────────────────────

export interface NowPlayingTrack {
  name: string;
  artist: string;
  album: string;
  date: string;
  url: string;
  artworkUrl: string;
  isLive: boolean;
}

class LastFmFetchError extends Error {
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

interface LastFmImage { '#text'?: unknown; size?: unknown; }
interface RawLastFmTrack {
  name?: unknown; url?: unknown;
  artist?: { '#text'?: unknown };
  album?: { '#text'?: unknown };
  date?: { '#text'?: unknown };
  image?: LastFmImage[];
  '@attr'?: { nowplaying?: unknown };
}
interface LastFmRecentTracksResponse {
  error?: unknown; message?: unknown;
  recenttracks?: { track?: RawLastFmTrack | RawLastFmTrack[] };
}

function readSafeText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX_FIELD_LENGTH) : fallback;
}

function stripBrackets(value: string): string {
  let out = ''; let depth = 0;
  for (const ch of value) {
    if (ch === '(' || ch === '[') { depth += 1; }
    else if ((ch === ')' || ch === ']') && depth > 0) { depth -= 1; }
    else if (depth === 0) { out += ch; }
  }
  return out;
}

function cleanTrackText(value: string): string {
  if (!value) return value;
  const withoutBrackets = stripBrackets(value);
  const lower = withoutBrackets.toLowerCase();
  let cutoff = withoutBrackets.length;
  for (const marker of [' feat.', ' feat ', ' ft.', ' ft ', ' featuring ']) {
    const idx = lower.indexOf(marker);
    if (idx > 0 && idx < cutoff) cutoff = idx;
  }
  const cleaned = withoutBrackets.slice(0, cutoff).split(' ').filter(Boolean).join(' ').trim();
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

async function fetchLatestTrack(
  apiKey: string,
  timeoutMs = 10000,
  externalSignal?: AbortSignal
): Promise<NowPlayingTrack> {
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: LASTFM_USER,
    api_key: apiKey,
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
    if (res.status === 429) throw new LastFmFetchError('Last.fm rate limit exceeded', true);
    if (!res.ok) throw new LastFmFetchError(`Last.fm API returned ${res.status}`);

    const json = (await res.json()) as LastFmRecentTracksResponse;
    if (typeof json.error === 'number') {
      throw new LastFmFetchError(
        readSafeText(json.message, `Last.fm error ${json.error}`),
        json.error === 29
      );
    }

    const raw = json?.recenttracks?.track;
    const t: RawLastFmTrack | undefined = Array.isArray(raw) ? raw[0] : raw;
    if (!t || typeof t !== 'object') throw new LastFmFetchError('No track data returned');

    const isLive = t['@attr']?.nowplaying === 'true';
    return {
      name: cleanTrackText(readSafeText(t.name, 'Unknown')),
      artist: cleanTrackText(readSafeText(t.artist?.['#text'])),
      album: cleanTrackText(readSafeText(t.album?.['#text'])),
      date: isLive ? '' : readSafeText(t.date?.['#text']),
      url: sanitizeHttpsUrl(t.url, ['last.fm'], DEFAULT_LASTFM_PROFILE),
      artworkUrl: extractLastFmArtwork(t.image),
      isLive,
    };
  } finally {
    req.cleanup();
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

/** Proxy Last.fm recent track lookups server-side so LASTFM_API_KEY stays secret. */
export async function GET(request: Request): Promise<Response> {
  const startedAt = performance.now();
  const apiKey = process.env.LASTFM_API_KEY?.trim();

  if (!apiKey) {
    console.error('LASTFM_API_KEY is not configured');
    metric('music.lastfm_fetch', 1, { outcome: 'missing_key' });
    metric('music.lastfm_duration_ms', performance.now() - startedAt, { outcome: 'missing_key' });
    return Response.json(
      { error: 'Last.fm service is not configured' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let outcome = 'success';
  try {
    const track = await fetchLatestTrack(apiKey, 10000, request.signal);
    return Response.json(track, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    const rateLimited = err instanceof LastFmFetchError && err.rateLimited;
    outcome = rateLimited ? 'rate_limited' : 'error';
    console.error('Failed to fetch Last.fm track:', err instanceof Error ? err.message : err);
    return Response.json(
      { error: rateLimited ? 'Last.fm rate limit exceeded' : 'Failed to fetch latest track', rateLimited },
      { status: rateLimited ? 429 : 502, headers: { 'Cache-Control': 'no-store' } }
    );
  } finally {
    metric('music.lastfm_fetch', 1, { outcome });
    metric('music.lastfm_duration_ms', performance.now() - startedAt, { outcome });
  }
}
