import { createTimeoutSignal, sanitizeHttpsUrl } from './url';

export interface NowPlayingTrack {
  name: string;
  artist: string;
  album: string;
  date: string;
  url: string;
  artworkUrl: string;
  isLive: boolean;
}

export interface ItunesMedia {
  artworkUrl: string;
  previewUrl: string;
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

interface ItunesResult {
  artistName?: unknown;
  collectionName?: unknown;
  trackName?: unknown;
  artworkUrl100?: unknown;
  previewUrl?: unknown;
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

function readSafeText(value: unknown, fallback = ''): string {
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

function cleanTrackText(value: string): string {
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

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function splitArtistParts(artist: string): string[] {
  return artist
    .split(/[,&/]|\band\b/i)
    .map((part) => normalize(part))
    .filter(Boolean);
}

interface ItunesQuery {
  query: string;
  entity: 'album' | 'song';
  country: string;
}

interface ItunesMatchContext {
  artistParts: string[];
  normTrack: string;
  normAlbum: string;
}

function matchesTitle(candidate: string, target: string): boolean {
  if (!target) return true;
  if (candidate === target) return true;
  return Boolean(candidate) && (candidate.includes(target) || target.includes(candidate));
}

function scoreItunesHit(
  item: ItunesResult,
  entity: 'album' | 'song',
  ctx: ItunesMatchContext
): number {
  const itemArtist = normalize(readSafeText(item.artistName));
  const itemAlbum = normalize(cleanTrackText(readSafeText(item.collectionName)));
  const itemTrack = normalize(cleanTrackText(readSafeText(item.trackName)));

  const matchedTitle =
    entity === 'song'
      ? matchesTitle(itemTrack, ctx.normTrack)
      : Boolean(ctx.normAlbum) && matchesTitle(itemAlbum, ctx.normAlbum);
  if (!matchedTitle) return -1;

  const matchedArtists = ctx.artistParts.filter((part) => itemArtist.includes(part)).length;
  if (ctx.artistParts.length > 0 && matchedArtists === 0) return -1;

  let score = matchedArtists * 10;
  if (entity === 'song' && ctx.normTrack && itemTrack === ctx.normTrack) score += 5;
  if (ctx.normAlbum && itemAlbum.includes(ctx.normAlbum)) score += 3;
  return score;
}

function pickBestItunesHit(
  results: ItunesResult[],
  entity: 'album' | 'song',
  ctx: ItunesMatchContext
): ItunesResult | undefined {
  let bestHit: ItunesResult | undefined;
  let bestScore = -1;

  for (const item of results) {
    const score = scoreItunesHit(item, entity, ctx);
    if (score > bestScore) {
      bestScore = score;
      bestHit = item;
    }
  }

  return bestHit;
}

function extractItunesMedia(hit: ItunesResult | undefined): ItunesMedia {
  if (!hit) return { artworkUrl: '', previewUrl: '' };

  const rawArtwork = readSafeText(hit.artworkUrl100);
  const upgraded = rawArtwork
    ? rawArtwork
      .replace(/^http:/i, 'https:')
      .replace(/\b\d{1,5}x\d{1,5}bb/, '600x600bb')
    : '';

  return {
    artworkUrl: sanitizeHttpsUrl(upgraded, ['mzstatic.com']),
    previewUrl: sanitizeHttpsUrl(readSafeText(hit.previewUrl), ['itunes.apple.com']),
  };
}

async function queryItunesMedia(
  spec: ItunesQuery,
  ctx: ItunesMatchContext,
  externalSignal?: AbortSignal,
  timeoutMs = 6000
): Promise<ItunesMedia> {
  const req = createTimeoutSignal(timeoutMs, externalSignal);
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(spec.query)}&country=${spec.country}&media=music&entity=${spec.entity}&limit=5`;
    const res = await fetch(url, {
      signal: req.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    if (!res.ok) return { artworkUrl: '', previewUrl: '' };

    const data = (await res.json()) as { results?: ItunesResult[] };
    const results = Array.isArray(data.results) ? data.results : [];
    return extractItunesMedia(pickBestItunesHit(results, spec.entity, ctx));
  } catch {
    return { artworkUrl: '', previewUrl: '' };
  } finally {
    req.cleanup();
  }
}

export async function fetchItunesMedia(
  artist: string,
  track: string,
  album: string,
  externalSignal?: AbortSignal,
  timeoutMs = 6000
): Promise<ItunesMedia> {
  const ctx: ItunesMatchContext = {
    artistParts: splitArtistParts(artist),
    normTrack: normalize(track),
    normAlbum: normalize(album),
  };
  const primaryArtist = artist.split(/[,&/]/)[0]?.trim() || '';

  const queries: ItunesQuery[] = [
    { query: `${artist} ${track}`, entity: 'song', country: 'IN' },
    { query: `${artist} ${track}`, entity: 'song', country: 'US' },
  ];

  if (primaryArtist && primaryArtist !== artist) {
    queries.push(
      { query: `${primaryArtist} ${track}`, entity: 'song', country: 'IN' },
      { query: `${primaryArtist} ${track}`, entity: 'song', country: 'US' }
    );
  }

  if (album) {
    const albumQuery = `${primaryArtist || artist} ${album}`;
    queries.push(
      { query: albumQuery, entity: 'album', country: 'IN' },
      { query: albumQuery, entity: 'album', country: 'US' }
    );
  }

  let artworkUrl = '';
  let previewUrl = '';

  for (const spec of queries) {
    if (!spec.query.trim() || externalSignal?.aborted) continue;
    const media = await queryItunesMedia(spec, ctx, externalSignal, timeoutMs);
    artworkUrl ||= media.artworkUrl;
    previewUrl ||= media.previewUrl;
    if (artworkUrl && previewUrl) break;
  }

  return { artworkUrl, previewUrl };
}

function getLastFmEndpoint(): string {
  const apiKey = import.meta.env.VITE_LASTFM_API_KEY?.trim();
  if (!apiKey) {
    throw new LastFmFetchError('Missing VITE_LASTFM_API_KEY');
  }
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: LASTFM_USER,
    api_key: apiKey,
    format: 'json',
    limit: '1',
  });
  return `${LASTFM_API_BASE}?${params.toString()}`;
}

const LASTFM_DEFAULT_ART_HASH = '2a96cbd8b46e442fc41c2b86b821562f';
const LASTFM_IMAGE_SIZES = ['mega', 'extralarge', 'large', 'medium', 'small'] as const;

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

export async function fetchLatestTrack(
  timeoutMs = 10000,
  externalSignal?: AbortSignal
): Promise<NowPlayingTrack> {
  const endpoint = getLastFmEndpoint();
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
