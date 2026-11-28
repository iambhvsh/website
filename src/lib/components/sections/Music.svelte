<script lang="ts">
  import { Section, Shape, Wave } from '$lib/components/ui';
  import { MUSIC_CATEGORIES, type FavoriteTrack } from '$lib/data/music';
  import { fetchItunesMedia, type ItunesMedia } from '$lib/services/music';
  import { ARTWORK_SHAPES, type ShapeName } from '$lib/shapes';
  import CloseIcon from '~icons/material-symbols/close-rounded';
  import MusicNoteIcon from '~icons/material-symbols/music-note-rounded';
  import PauseIcon from '~icons/material-symbols/pause-rounded';
  import PlayArrowIcon from '~icons/material-symbols/play-arrow-rounded';
  import SkipNextIcon from '~icons/material-symbols/skip-next-rounded';
  import SkipPreviousIcon from '~icons/material-symbols/skip-previous-rounded';

  interface LoadedTrack extends FavoriteTrack {
    category: string;
    flatIndex: number;
    artworkUrl: string;
    previewUrl: string;
  }

  const initialTracks: LoadedTrack[] = MUSIC_CATEGORIES.flatMap((cat) =>
    cat.tracks.map((track) => ({
      ...track,
      category: cat.name,
      flatIndex: 0,
      artworkUrl: '',
      previewUrl: '',
    }))
  ).map((track, idx) => ({ ...track, flatIndex: idx }));

  let tracks = $state<LoadedTrack[]>(initialTracks);
  let activeIndex = $state<number | null>(null);
  let hoveredIndex = $state<number | null>(null);
  let playing = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let audioEl = $state<HTMLAudioElement | undefined>(undefined);

  const activeTrack = $derived(activeIndex !== null ? tracks[activeIndex] : null);
  const progress = $derived(duration > 0 ? Math.min(1, currentTime / duration) : 0);

  const categorizedTracks = $derived(
    MUSIC_CATEGORIES.map((cat) => ({
      name: cat.name,
      tracks: tracks.filter((t) => t.category === cat.name),
    }))
  );

  function getTrackShape(index: number): ShapeName {
    const offset = hoveredIndex === index || activeIndex === index ? 1 : 0;
    return ARTWORK_SHAPES[(index + offset) % ARTWORK_SHAPES.length];
  }

  function formatTime(sec: number): string {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const whole = Math.floor(sec);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
  }

  function playTrack(index: number) {
    const track = tracks[index];
    if (!track?.previewUrl) return;

    if (activeIndex === index && audioEl) {
      if (playing) {
        audioEl.pause();
      } else {
        void audioEl.play();
      }
      return;
    }

    activeIndex = index;
    currentTime = 0;
    duration = 0;
    playing = true;

    window.requestAnimationFrame(() => {
      if (!audioEl) return;
      audioEl.currentTime = 0;
      void audioEl.play().catch(() => {
        playing = false;
      });
    });
  }

  function stepTrack(delta: number) {
    if (activeIndex === null) return;
    const playable = tracks
      .map((t, i) => (t.previewUrl ? i : -1))
      .filter((i) => i !== -1);
    if (playable.length === 0) return;

    const pos = playable.indexOf(activeIndex);
    const nextPos = pos === -1 ? 0 : (pos + delta + playable.length) % playable.length;
    playTrack(playable[nextPos]);
  }

  function closePlayer() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    playing = false;
    activeIndex = null;
    currentTime = 0;
    duration = 0;
  }

  function handleSeekRatio(ratio: number) {
    if (!audioEl || !duration) return;
    audioEl.currentTime = ratio * duration;
    currentTime = audioEl.currentTime;
  }

  $effect(() => {
    const controller = new AbortController();

    async function loadTracks() {
      const batchSize = 4;
      for (let start = 0; start < initialTracks.length; start += batchSize) {
        if (controller.signal.aborted) return;
        const batch = initialTracks.slice(start, start + batchSize);
        await Promise.all(
          batch.map(async (item, offset) => {
            const index = start + offset;
            const media: ItunesMedia = await fetchItunesMedia(
              item.artist,
              item.title,
              item.album ?? '',
              controller.signal
            );
            if (controller.signal.aborted) return;
            tracks[index] = {
              ...tracks[index],
              artworkUrl: media.artworkUrl,
              previewUrl: media.previewUrl,
            };
          })
        );
        if (start + batchSize < initialTracks.length && !controller.signal.aborted) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    }

    void loadTracks();

    return () => {
      controller.abort();
      audioEl?.pause();
    };
  });
</script>

<Section id="favorites" title="Favorites">
  <div class="categories">
    {#each categorizedTracks as category (category.name)}
      <div class="category">
        <h3 class="tl flex600 category-title">{category.name}</h3>
        <div class="pill-list">
          {#each category.tracks as track (track.flatIndex)}
            {@const idx = track.flatIndex}
            {@const isCurrent = activeIndex === idx}
            {@const isPlaying = isCurrent && playing}
            <div
              class="track-pill"
              class:active={isCurrent}
              role="presentation"
              onpointerenter={() => (hoveredIndex = idx)}
              onpointerleave={() => (hoveredIndex = null)}
            >
              <Shape
                shape={getTrackShape(idx)}
                spring="fast"
                spin={isPlaying}
                masked
                class="pill-shape"
              >
                {#if track.artworkUrl}
                  <img
                    src={track.artworkUrl}
                    alt="{track.title} by {track.artist}"
                    referrerpolicy="no-referrer"
                    loading="lazy"
                  />
                {:else}
                  <span class="art-fallback" aria-hidden="true">
                    <MusicNoteIcon />
                  </span>
                {/if}
              </Shape>

              <div class="pill-meta">
                <span class="tm flex600 track-title">{track.title}</span>
                <span class="bm track-artist">{track.artist}</span>
              </div>

              {#if track.previewUrl}
                <button
                  type="button"
                  class="play-btn"
                  class:playing={isPlaying}
                  aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  onclick={() => playTrack(idx)}
                >
                  {#if isPlaying}
                    <PauseIcon />
                  {:else}
                    <PlayArrowIcon />
                  {/if}
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Section>

{#if activeTrack?.previewUrl}
  <audio
    bind:this={audioEl}
    src={activeTrack.previewUrl}
    preload="auto"
    onplay={() => (playing = true)}
    onpause={() => (playing = false)}
    onended={() => stepTrack(1)}
    onloadedmetadata={() => {
      if (audioEl) duration = audioEl.duration || 0;
    }}
    ontimeupdate={() => {
      if (audioEl) currentTime = audioEl.currentTime;
    }}
  ></audio>

  <div class="floating-pill" role="region" aria-label="Music player">
    <Shape
      shape={getTrackShape(activeTrack.flatIndex)}
      spring="fast"
      spin={playing}
      masked
      class="player-shape"
    >
      {#if activeTrack.artworkUrl}
        <img
          src={activeTrack.artworkUrl}
          alt="{activeTrack.title} cover"
          referrerpolicy="no-referrer"
        />
      {:else}
        <span class="art-fallback" aria-hidden="true">
          <MusicNoteIcon />
        </span>
      {/if}
    </Shape>

    <div class="player-head">
      <span class="player-title tm flex600">{activeTrack.title}</span>
      <span class="bm player-artist">{activeTrack.artist}</span>
    </div>

    <div class="player-wave">
      <span class="label player-time">{formatTime(currentTime)}</span>
      <Wave
        {progress}
        {playing}
        ariaLabel="Seek preview"
        onseek={handleSeekRatio}
      />
      <span class="label player-time">{formatTime(duration || 30)}</span>
    </div>

    <div class="player-controls">
      <button
        type="button"
        class="exp-btn side"
        aria-label="Previous track"
        onclick={() => stepTrack(-1)}
      >
        <SkipPreviousIcon />
      </button>
      <button
        type="button"
        class="exp-btn main"
        class:playing
        aria-label={playing ? 'Pause' : 'Play'}
        onclick={() => activeIndex !== null && playTrack(activeIndex)}
      >
        {#if playing}
          <PauseIcon />
        {:else}
          <PlayArrowIcon />
        {/if}
      </button>
      <button
        type="button"
        class="exp-btn side"
        aria-label="Next track"
        onclick={() => stepTrack(1)}
      >
        <SkipNextIcon />
      </button>
    </div>

    <button
      type="button"
      class="close-btn"
      aria-label="Close player"
      onclick={closePlayer}
    >
      <CloseIcon />
    </button>
  </div>
{/if}

<style>
  .categories {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .category-title {
    margin-bottom: 14px;
    color: var(--p);
  }

  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .track-pill {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    max-width: 100%;
    padding: 8px 10px 8px 8px;
    border-radius: 9999px;
    background: var(--sf);
    transition:
      background-color var(--dur-med2) var(--ease-emphasized),
      border-radius var(--dur-spring-fast) var(--spring-fast);
  }

  .track-pill:hover {
    background: var(--sf2);
  }

  .track-pill.active {
    background: var(--sc);
    color: var(--onsc);
  }

  .track-pill :global(.pill-shape) {
    position: relative;
    width: 56px;
    height: 56px;
    flex: none;
    background: var(--pc);
    color: var(--onpc);
  }

  .track-pill :global(.pill-shape img),
  .floating-pill :global(.player-shape img) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .art-fallback {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  .pill-meta {
    min-width: 0;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .track-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-artist {
    color: var(--onv);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-pill.active .track-artist {
    color: var(--onsc);
    opacity: 0.82;
  }

  .play-btn {
    width: 44px;
    height: 44px;
    flex: none;
    border: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    cursor: pointer;
    background: var(--sc);
    color: var(--onsc);
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .play-btn:hover {
    border-radius: var(--r-lg);
    background: var(--p);
    color: var(--onp);
  }

  .play-btn:active {
    border-radius: var(--r-md);
  }

  .play-btn.playing {
    background: var(--p);
    color: var(--onp);
  }

  .floating-pill {
    position: fixed;
    left: 50%;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
    transform: translate3d(-50%, 0, 0);
    z-index: 25;
    width: min(680px, calc(100vw - 24px));
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    grid-template-areas:
      'art head controls close'
      'art wave controls close';
    align-items: center;
    gap: 2px 14px;
    padding: 12px 14px 12px 12px;
    background: color-mix(in srgb, var(--sf2) 68%, transparent);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    backdrop-filter: blur(24px) saturate(1.6);
    border-radius: 32px;
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.24),
      0 2px 8px rgba(0, 0, 0, 0.12);
    animation: pill-enter var(--dur-spring) var(--spring) both;
  }

  @keyframes pill-enter {
    from {
      transform: translate3d(-50%, 24px, 0);
    }
    to {
      transform: translate3d(-50%, 0, 0);
    }
  }

  .floating-pill :global(.player-shape) {
    grid-area: art;
    position: relative;
    width: 56px;
    height: 56px;
    flex: none;
    background: var(--pc);
    color: var(--onpc);
  }

  .player-head {
    grid-area: head;
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
    overflow: hidden;
  }

  .player-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .player-artist {
    color: var(--onv);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-wave {
    grid-area: wave;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--p);
    min-width: 0;
  }

  .player-time {
    color: var(--onv);
    flex: none;
    font-variant-numeric: tabular-nums;
  }

  .player-controls {
    grid-area: controls;
    display: flex;
    align-items: center;
    gap: 6px;
    flex: none;
  }

  .exp-btn {
    border: 0;
    display: grid;
    place-items: center;
    cursor: pointer;
    will-change: transform, width, border-radius;
    transition:
      width var(--dur-spring-fast) var(--spring-fast),
      border-radius var(--dur-spring-fast) var(--spring-fast),
      transform var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .exp-btn :global(.ms-icon) {
    transition: transform var(--dur-spring-fast) var(--spring-fast);
  }

  .exp-btn.side {
    width: 42px;
    height: 48px;
    border-radius: 24px;
    background: var(--sc);
    color: var(--onsc);
  }

  .exp-btn.side:hover {
    width: 46px;
    border-radius: 18px;
    transform: scale(1.04);
  }

  .exp-btn.side:active {
    width: 48px;
    border-radius: 12px;
    transform: scale(0.92);
  }

  .exp-btn.side:active :global(.ms-icon) {
    transform: scale(0.9);
  }

  .exp-btn.main {
    width: 68px;
    height: 48px;
    border-radius: 24px;
    background: var(--pc);
    color: var(--onpc);
  }

  .exp-btn.main:hover {
    width: 74px;
    border-radius: 18px;
    transform: scale(1.04);
  }

  .exp-btn.main.playing {
    width: 74px;
    border-radius: 16px;
    background: var(--p);
    color: var(--onp);
  }

  .exp-btn.main:active {
    width: 80px;
    border-radius: 12px;
    transform: scale(0.92);
  }

  .exp-btn.main:active :global(.ms-icon) {
    transform: scale(0.9);
  }

  .close-btn {
    grid-area: close;
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
    cursor: pointer;
    background: transparent;
    color: var(--onv);
    transition:
      transform var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .close-btn:hover {
    background: color-mix(in srgb, var(--on) 10%, transparent);
    color: var(--on);
    transform: scale(1.08);
  }

  .close-btn:active {
    transform: scale(0.92);
  }

  @media (max-width: 640px) {
    .track-pill {
      padding: 6px 8px 6px 6px;
      gap: 10px;
    }

    .track-pill :global(.pill-shape) {
      width: 48px;
      height: 48px;
    }

    .play-btn {
      width: 40px;
      height: 40px;
    }

    .floating-pill {
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas:
        'art head close'
        'wave wave wave'
        'controls controls controls';
      gap: 10px 12px;
      padding: 12px 14px 14px;
      border-radius: 28px;
    }

    .floating-pill :global(.player-shape) {
      width: 48px;
      height: 48px;
    }

    .player-head {
      flex-direction: column;
      gap: 2px;
    }

    .player-controls {
      justify-content: center;
    }
  }
</style>
