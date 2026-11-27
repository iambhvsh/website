import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Icons from 'unplugin-icons/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    svelte(),
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
