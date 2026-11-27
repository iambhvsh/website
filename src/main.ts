import { mount } from 'svelte';
import '@fontsource-variable/google-sans-flex';
import '$styles/tokens.css';
import '$styles/typography.css';
import '$styles/base.css';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
