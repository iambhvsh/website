import { defineConfig, loadEnv, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Icons from 'unplugin-icons/vite';
import { fileURLToPath, URL } from 'node:url';

function localMusicApiPlugin(): Plugin {
  return {
    name: 'local-music-api',
    configureServer(server) {
      server.middlewares.use('/api/music', async (req, res, next) => {
        if (req.method !== 'GET') {
          next();
          return;
        }
        const env = loadEnv(server.config.mode, process.cwd(), '');
        const apiKey = env.LASTFM_API_KEY?.trim();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Missing LASTFM_API_KEY' }));
          return;
        }
        try {
          const mod = await server.ssrLoadModule('/src/lib/services/lastfm.ts');
          const track = await mod.fetchLastFmLatestTrack(apiKey, 10000);
          res.statusCode = 200;
          res.end(JSON.stringify(track));
        } catch (err) {
          const rateLimited = Boolean(
            err && typeof err === 'object' && 'rateLimited' in err && err.rateLimited
          );
          res.statusCode = rateLimited ? 429 : 502;
          res.end(JSON.stringify({ error: 'Failed to fetch latest track', rateLimited }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    svelte(),
    localMusicApiPlugin(),
    Icons({
      compiler: 'svelte',
      defaultClass: 'ms-icon',
      defaultStyle: 'width: 1em; height: 1em; display: inline-block; flex: none;',
    }),
  ],
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
      $styles: fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
});
