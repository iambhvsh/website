import { metric } from '@vercel/functions';
import { fetchLastFmLatestTrack, LastFmFetchError } from '../src/lib/services/lastfm';

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
    const track = await fetchLastFmLatestTrack(apiKey, 10000, request.signal);
    return Response.json(track, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    const rateLimited = err instanceof LastFmFetchError && err.rateLimited;
    outcome = rateLimited ? 'rate_limited' : 'error';
    console.error('Failed to fetch Last.fm track:', err instanceof Error ? err.message : err);
    return Response.json(
      {
        error: rateLimited ? 'Last.fm rate limit exceeded' : 'Failed to fetch latest track',
        rateLimited,
      },
      { status: rateLimited ? 429 : 502, headers: { 'Cache-Control': 'no-store' } }
    );
  } finally {
    metric('music.lastfm_fetch', 1, { outcome });
    metric('music.lastfm_duration_ms', performance.now() - startedAt, { outcome });
  }
}
