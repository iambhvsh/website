import {
  cleanTrackText,
  LastFmFetchError,
  readSafeText,
  type NowPlayingTrack,
} from './lastfm';
import { createTimeoutSignal, sanitizeHttpsUrl } from './url';

export { LastFmFetchError, type NowPlayingTrack };

export interface ItunesMedia {
  artworkUrl: string;
  previewUrl: string;
}

interface ItunesResult {
  artistName?: unknown;
  collectionName?: unknown;
  trackName?: unknown;
  artworkUrl100?: unknown;
  previewUrl?: unknown;
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

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function splitArtistParts(artist: string): string[] {
  return artist
    .split(/[,&/]|\band\b/i)
    .map((part) => normalize(part))
    .filter(Boolean);
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

export async function fetchLatestTrack(
  timeoutMs = 10000,
  externalSignal?: AbortSignal
): Promise<NowPlayingTrack> {
  const req = createTimeoutSignal(timeoutMs, externalSignal);

  try {
    const res = await fetch('/api/music', {
      signal: req.signal,
      cache: 'no-store',
    });
    if (res.status === 429) {
      throw new LastFmFetchError('Last.fm rate limit exceeded', true);
    }
    if (!res.ok) {
      throw new LastFmFetchError(`Music API returned ${res.status}`);
    }

    const track = (await res.json()) as Partial<NowPlayingTrack>;
    if (!track || typeof track !== 'object' || typeof track.name !== 'string') {
      throw new LastFmFetchError('No track data returned');
    }

    return {
      name: track.name,
      artist: typeof track.artist === 'string' ? track.artist : '',
      album: typeof track.album === 'string' ? track.album : '',
      date: typeof track.date === 'string' ? track.date : '',
      url: sanitizeHttpsUrl(track.url, ['last.fm'], 'https://www.last.fm/user/iambhvsh'),
      artworkUrl: sanitizeHttpsUrl(track.artworkUrl, ['freetls.fastly.net', 'akamaized.net']),
      isLive: Boolean(track.isLive),
    };
  } finally {
    req.cleanup();
  }
}
