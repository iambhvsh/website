/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/svelte" />

interface ImportMetaEnv {
  readonly VITE_LASTFM_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
