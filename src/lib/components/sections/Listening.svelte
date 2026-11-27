<script lang="ts">
  import { untrack } from "svelte";
  import { Button, Section, Shape, Wave } from "$lib/components/ui";
  import { SITE } from "$lib/data/site";
  import LyricsIcon from "~icons/material-symbols/lyrics-rounded";
  import MusicNoteIcon from "~icons/material-symbols/music-note-rounded";
  import OpenInNewIcon from "~icons/material-symbols/open-in-new-rounded";
  import PauseIcon from "~icons/material-symbols/pause-rounded";
  import PlayArrowIcon from "~icons/material-symbols/play-arrow-rounded";
  import RefreshIcon from "~icons/material-symbols/refresh-rounded";
  import {
    fetchTrackLyrics,
    UnisonFetchError,
    type TrackLyrics,
  } from "$lib/services/lyrics";
  import {
    fetchItunesMedia,
    fetchLatestTrack,
    LastFmFetchError,
    type NowPlayingTrack,
  } from "$lib/services/music";
  import { ARTWORK_SHAPES, LOADING_SHAPES } from "$lib/shapes";

  let track = $state<NowPlayingTrack | null>(null);
  let artworkSrc = $state("");
  let fallbackArtworkUrl = $state("");
  let artworkLoaded = $state(false);
  let previewUrl = $state("");
  let loading = $state(false);
  let failed = $state(false);

  let lyricsEnabled = $state(false);
  let lyrics = $state<TrackLyrics | null>(null);
  let lyricsLoading = $state(false);
  let lyricsReady = $state(false);
  let lyricsError = $state("");
  let stackEl = $state<HTMLElement | undefined>(undefined);

  let audioEl = $state<HTMLAudioElement | undefined>(undefined);
  let previewPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(30);

  let artShapeIndex = $state(0);
  let loadShapeIndex = $state(0);
  const currentArtShape = $derived(
    loading
      ? LOADING_SHAPES[loadShapeIndex % LOADING_SHAPES.length]
      : ARTWORK_SHAPES[artShapeIndex % ARTWORK_SHAPES.length],
  );

  const previewProgress = $derived(
    duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0,
  );

  let requestSeq = 0;
  let activeController: AbortController | undefined;

  function cycleArtShape() {
    artShapeIndex = (artShapeIndex + 1) % ARTWORK_SHAPES.length;
  }

  function formatClock(seconds: number): string {
    const safe = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function resetAudio() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    previewPlaying = false;
    currentTime = 0;
    duration = 30;
    clearMediaPosition();
    syncMediaPlaybackState();
  }

  async function togglePreview() {
    if (!audioEl || !previewUrl) return;
    if (previewPlaying) {
      audioEl.pause();
      return;
    }
    try {
      await audioEl.play();
    } catch {
      previewPlaying = false;
    }
  }

  function seekPreview(ratio: number) {
    if (!audioEl || !duration) return;
    const next = Math.max(0, Math.min(duration, ratio * duration));
    audioEl.currentTime = next;
    currentTime = next;
    syncMediaPosition();
  }

  function getArtworkType(url: string): string | undefined {
    if (/\.png(?:\?|$)/i.test(url)) return "image/png";
    if (/\.webp(?:\?|$)/i.test(url)) return "image/webp";
    if (/\.jpe?g(?:\?|$)/i.test(url)) return "image/jpeg";
    return undefined;
  }

  function syncMediaMetadata() {
    if (
      typeof navigator === "undefined" ||
      !("mediaSession" in navigator) ||
      typeof MediaMetadata === "undefined" ||
      !track ||
      !previewUrl
    ) {
      return;
    }

    const type = getArtworkType(artworkSrc);
    const sizes = artworkSrc.includes("600x600") ? "600x600" : "300x300";
    const artwork: MediaImage[] = artworkSrc
      ? [{ src: artworkSrc, sizes, ...(type ? { type } : {}) }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.name,
      artist: track.artist,
      album: track.album,
      artwork,
    });
  }

  function syncMediaPlaybackState() {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.playbackState = previewPlaying
      ? "playing"
      : previewUrl
        ? "paused"
        : "none";
  }

  function syncMediaPosition() {
    if (
      typeof navigator === "undefined" ||
      !("mediaSession" in navigator) ||
      typeof navigator.mediaSession.setPositionState !== "function"
    ) {
      return;
    }
    const total =
      audioEl?.duration && Number.isFinite(audioEl.duration)
        ? audioEl.duration
        : duration;
    if (!total || !Number.isFinite(total) || total <= 0) return;

    const rawPos = audioEl ? audioEl.currentTime : currentTime;
    const position = Math.max(
      0,
      Math.min(total, Number.isFinite(rawPos) ? rawPos : 0),
    );
    try {
      navigator.mediaSession.setPositionState({
        duration: total,
        playbackRate: audioEl?.playbackRate || 1,
        position,
      });
    } catch {}
  }

  function clearMediaPosition() {
    if (
      typeof navigator === "undefined" ||
      !("mediaSession" in navigator) ||
      typeof navigator.mediaSession.setPositionState !== "function"
    ) {
      return;
    }
    try {
      navigator.mediaSession.setPositionState();
    } catch {}
  }

  function setMediaAction(
    action: MediaSessionAction,
    handler: MediaSessionActionHandler | null,
  ) {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {}
  }

  function registerMediaHandlers() {
    setMediaAction("play", () => {
      void audioEl?.play().catch(() => {});
    });
    setMediaAction("pause", () => {
      audioEl?.pause();
    });
    setMediaAction("seekto", (details) => {
      if (!audioEl || details.seekTime == null) return;
      const total = duration > 0 ? duration : 30;
      const next = Math.max(0, Math.min(total, details.seekTime));
      audioEl.currentTime = next;
      currentTime = next;
      syncMediaPosition();
    });
    setMediaAction("seekbackward", (details) => {
      if (!audioEl) return;
      const step = details.seekOffset ?? 5;
      const next = Math.max(0, audioEl.currentTime - step);
      audioEl.currentTime = next;
      currentTime = next;
      syncMediaPosition();
    });
    setMediaAction("seekforward", (details) => {
      if (!audioEl) return;
      const step = details.seekOffset ?? 5;
      const total = duration > 0 ? duration : 30;
      const next = Math.min(total, audioEl.currentTime + step);
      audioEl.currentTime = next;
      currentTime = next;
      syncMediaPosition();
    });
    setMediaAction("stop", () => {
      resetAudio();
      clearMediaPosition();
      syncMediaPlaybackState();
    });
  }

  function clearMediaSession() {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
    clearMediaPosition();
    for (const action of [
      "play",
      "pause",
      "seekto",
      "seekbackward",
      "seekforward",
      "stop",
    ] as const) {
      setMediaAction(action, null);
    }
  }

  const LIVE_POLL_MS = 20_000;
  const IDLE_POLL_MS = 60_000;
  const MAX_BACKOFF_MS = 180_000;
  const FOCUS_COOLDOWN_MS = 10_000;

  let failureStreak = 0;
  let lastFetchAt = 0;
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  let lyricsSeq = 0;
  let lyricsController: AbortController | undefined;
  let stackVisible = false;

  async function loadLyrics(
    target: NowPlayingTrack,
    forceRefresh = false,
  ) {
    lyricsController?.abort();
    const controller = new AbortController();
    lyricsController = controller;
    const seq = ++lyricsSeq;

    lyricsLoading = true;
    lyricsReady = false;
    lyricsError = "";

    try {
      const result = await fetchTrackLyrics(
        target.artist,
        target.name,
        controller.signal,
        forceRefresh,
      );
      if (seq !== lyricsSeq || controller.signal.aborted) return;
      lyrics = result;
      lyricsReady = true;
    } catch (err) {
      if (seq !== lyricsSeq || controller.signal.aborted) return;
      lyrics = null;
      lyricsError =
        err instanceof UnisonFetchError && err.rateLimited
          ? "Rate limited by Unison, try again shortly."
          : "Couldn’t load lyrics from Unison.";
      lyricsReady = true;
    } finally {
      if (seq === lyricsSeq) {
        lyricsLoading = false;
      }
    }
  }

  function toggleLyrics() {
    lyricsEnabled = !lyricsEnabled;
    if (lyricsEnabled && track && !lyricsReady && !lyricsLoading) {
      void loadLyrics(track);
    }
  }

  function isSameTrack(a: NowPlayingTrack | null, b: NowPlayingTrack): boolean {
    return (
      Boolean(a) &&
      a!.name === b.name &&
      a!.artist === b.artist &&
      a!.album === b.album
    );
  }

  function clearPollTimer() {
    if (pollTimer !== undefined) {
      clearTimeout(pollTimer);
      pollTimer = undefined;
    }
  }

  function nextPollDelay(): number {
    const base = track?.isLive ? LIVE_POLL_MS : IDLE_POLL_MS;
    if (failureStreak === 0) return base;
    return Math.min(MAX_BACKOFF_MS, base * 2 ** (failureStreak - 1));
  }

  function schedulePoll() {
    clearPollTimer();
    if (typeof document !== "undefined" && document.hidden) return;
    pollTimer = setTimeout(() => {
      void loadTrack({ silent: true });
    }, nextPollDelay());
  }

  async function loadTrack(options?: { silent?: boolean }) {
    const silent = Boolean(options?.silent && track);

    clearPollTimer();
    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;
    lastFetchAt = Date.now();

    if (!silent) {
      resetAudio();
      loading = true;
      failed = false;
    }

    const seq = ++requestSeq;

    try {
      const latest = await fetchLatestTrack(10000, controller.signal);
      if (seq !== requestSeq || controller.signal.aborted) return;

      failureStreak = 0;
      const unchanged = isSameTrack(track, latest);

      if (unchanged && silent) {
        if (
          track!.isLive !== latest.isLive ||
          track!.date !== latest.date ||
          track!.url !== latest.url
        ) {
          track = latest;
        }
        return;
      }

      if (silent) {
        resetAudio();
      }

      track = latest;
      artworkSrc = latest.artworkUrl;
      fallbackArtworkUrl = "";
      artworkLoaded = false;
      previewUrl = "";
      lyrics = null;
      lyricsError = "";
      lyricsReady = false;

      if (stackVisible || lyricsEnabled) {
        void loadLyrics(latest, !silent);
      } else {
        lyricsController?.abort();
        lyricsLoading = false;
      }

      const media = await fetchItunesMedia(
        latest.artist,
        latest.name,
        latest.album,
        controller.signal,
      );
      if (seq !== requestSeq || controller.signal.aborted) return;

      fallbackArtworkUrl = media.artworkUrl;
      if (!artworkSrc && media.artworkUrl) {
        artworkSrc = media.artworkUrl;
      }
      previewUrl = media.previewUrl;
    } catch (err) {
      if (seq !== requestSeq || controller.signal.aborted) return;
      failureStreak =
        err instanceof LastFmFetchError && err.rateLimited
          ? Math.max(failureStreak + 1, 2)
          : failureStreak + 1;

      if (!silent) {
        failed = true;
        track = null;
        artworkSrc = "";
        fallbackArtworkUrl = "";
        artworkLoaded = false;
        previewUrl = "";
        lyrics = null;
        lyricsError = "";
        lyricsReady = false;
        lyricsController?.abort();
        lyricsLoading = false;
      }
    } finally {
      if (seq === requestSeq) {
        loading = false;
        schedulePoll();
      }
    }
  }

  $effect(() => {
    const onWake = () => {
      if (typeof document !== "undefined" && document.hidden) {
        clearPollTimer();
        return;
      }
      if (Date.now() - lastFetchAt >= FOCUS_COOLDOWN_MS) {
        void loadTrack({ silent: true });
      } else {
        schedulePoll();
      }
    };

    untrack(() => void loadTrack());
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("online", onWake);

    return () => {
      clearPollTimer();
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("online", onWake);
      activeController?.abort();
      lyricsController?.abort();
      audioEl?.pause();
      clearMediaSession();
    };
  });

  $effect(() => {
    if (!stackEl || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? false;
      stackVisible = visible;
      if (visible && track && !lyricsReady && !lyricsLoading) {
        void loadLyrics(track);
      }
    });
    io.observe(stackEl);
    return () => io.disconnect();
  });

  $effect(() => {
    if (!track || !previewUrl) {
      clearMediaSession();
      return;
    }
    syncMediaMetadata();
    registerMediaHandlers();
  });

  $effect(() => {
    void previewUrl;
    void previewPlaying;
    syncMediaPlaybackState();
  });

  $effect(() => {
    if (!previewPlaying) return;
    let rafId = 0;
    const syncTime = () => {
      if (audioEl) currentTime = audioEl.currentTime;
      rafId = requestAnimationFrame(syncTime);
    };
    rafId = requestAnimationFrame(syncTime);
    return () => cancelAnimationFrame(rafId);
  });

  $effect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      loadShapeIndex = (loadShapeIndex + 1) % LOADING_SHAPES.length;
    }, 650);
    return () => clearInterval(timer);
  });

  $effect(() => {
    if (loading || (!track?.isLive && !previewPlaying)) return;
    const timer = setInterval(cycleArtShape, 2600);
    return () => clearInterval(timer);
  });

  const titleText = $derived(
    failed ? "Couldn’t load Last.fm" : track ? track.name : "Loading…",
  );
  const lyricsOpen = $derived(lyricsEnabled && Boolean(track) && lyricsReady);
</script>

<Section id="now" title="Listening">
  <div class="np-stack" bind:this={stackEl}>
    <div class="np surface-morph" class:split-top={lyricsOpen}>
    <div class="art-wrap" onpointerenter={cycleArtShape} role="presentation">
      <Shape
        shape={currentArtShape}
        spring={loading ? "fast" : "slow"}
        spin={loading}
        masked
        class="art"
      >
        {#if !artworkLoaded}
          <span class="fallback-icon" aria-hidden="true">
            <MusicNoteIcon />
          </span>
        {/if}
        {#if artworkSrc}
          <img
            src={artworkSrc}
            alt="Album art"
            referrerpolicy="no-referrer"
            class:visible={artworkLoaded}
            onload={() => (artworkLoaded = true)}
            onerror={() => {
              if (fallbackArtworkUrl && artworkSrc !== fallbackArtworkUrl) {
                artworkSrc = fallbackArtworkUrl;
                artworkLoaded = false;
                return;
              }
              artworkSrc = "";
              artworkLoaded = false;
            }}
          />
        {/if}
      </Shape>
    </div>

    <div class="npi">
      <h3 class="flex600">{titleText}</h3>

      {#if track?.artist}
        <div class="tl sub">{track.artist}</div>
      {/if}

      {#if previewUrl}
        <audio
          bind:this={audioEl}
          src={previewUrl}
          preload="none"
          onplay={() => {
            previewPlaying = true;
            syncMediaMetadata();
            syncMediaPlaybackState();
            syncMediaPosition();
          }}
          onpause={() => {
            previewPlaying = false;
            syncMediaPlaybackState();
            syncMediaPosition();
          }}
          onended={() => {
            previewPlaying = false;
            currentTime = 0;
            syncMediaPlaybackState();
            clearMediaPosition();
          }}
          onloadedmetadata={() => {
            if (audioEl?.duration && Number.isFinite(audioEl.duration)) {
              duration = audioEl.duration;
            }
            syncMediaPosition();
          }}
          ontimeupdate={() => {
            if (audioEl && !previewPlaying) currentTime = audioEl.currentTime;
          }}
          onerror={() => {
            previewPlaying = false;
            previewUrl = "";
          }}
        ></audio>

        <div class="player">
          <Button
            variant={previewPlaying ? "filled" : "tonal"}
            tone="on-tertiary"
            iconOnly
            class="play-btn"
            ariaLabel={previewPlaying ? "Pause preview" : "Play 30s preview"}
            onclick={togglePreview}
          >
            {#snippet icon()}
              {#if previewPlaying}
                <PauseIcon />
              {:else}
                <PlayArrowIcon />
              {/if}
            {/snippet}
          </Button>

          <Wave
            progress={previewProgress}
            playing={previewPlaying}
            ariaLabel="Song preview progress"
            onseek={seekPreview}
          />

          <span class="bs sub time">
            {formatClock(currentTime)} / {formatClock(duration)}
          </span>
        </div>
      {/if}

      <div class="row acts">
        <Button tone="on-tertiary" href={track?.url ?? SITE.lastfmUrl} external>
          {#snippet icon()}
            <OpenInNewIcon />
          {/snippet}
          Open on Last.fm
        </Button>

        <Button
          variant={lyricsEnabled ? "filled" : "tonal"}
          tone="on-tertiary"
          ariaPressed={lyricsEnabled}
          onclick={toggleLyrics}
        >
          {#snippet icon()}
            <LyricsIcon />
          {/snippet}
          Lyrics
        </Button>

        <Button
          variant="tonal"
          tone="on-tertiary"
          iconOnly
          spinning={loading}
          ariaLabel="Refresh"
          onclick={() => void loadTrack()}
        >
          {#snippet icon()}
            <RefreshIcon />
          {/snippet}
        </Button>
      </div>
    </div>
  </div>

    <div class="lyrics-collapse" class:open={lyricsOpen} inert={!lyricsOpen}>
      <div class="lyrics-clip">
        <div class="lyrics-card">
          {#if lyricsError}
            <p class="bs sub lyrics-state">{lyricsError}</p>
          {:else if lyrics && lyrics.lines.length > 0}
            <div class="lyrics-lines">
              {#each lyrics.lines as line}
                <p>{line}</p>
              {/each}
            </div>
            <div class="bs sub lyrics-credit">
              <a
                href={lyrics.songUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lyrics from Unison
              </a>
              {#if lyrics.submitterName && lyrics.submitterUrl}
                <span> · submitted by </span>
                <a
                  href={lyrics.submitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lyrics.submitterName}
                </a>
              {/if}
            </div>
          {:else}
            <p class="bs sub lyrics-state">No lyrics found on Unison.</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</Section>

<style>
  .np-stack {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .np {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 28px;
    align-items: center;
    background: var(--tc);
    color: var(--ontc);
    padding: 28px;
    width: 100%;
  }

  .np.split-top,
  .np.split-top:hover {
    border-bottom-left-radius: var(--r-md);
    border-bottom-right-radius: var(--r-md);
  }

  @media (max-width: 620px) {
    .np {
      grid-template-columns: 1fr;
      justify-items: start;
    }
  }

  .art-wrap {
    flex: none;
  }

  .art-wrap :global(.art) {
    position: relative;
    width: 168px;
    height: 168px;
    background: var(--p);
    color: var(--onp);
  }

  .fallback-icon :global(.ms-icon) {
    font-size: 56px;
  }

  .art-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .art-wrap img.visible {
    opacity: 1;
  }

  .npi {
    min-width: 0;
    width: 100%;
  }

  .npi h3 {
    font-size: clamp(24px, 4vw, 32px);
    line-height: 1.15;
    margin-bottom: 4px;
    overflow-wrap: anywhere;
  }

  .npi .sub,
  .lyrics-card .sub {
    opacity: 0.85;
  }

  .player {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    max-width: 440px;
  }

  .player :global(.play-btn) {
    width: 40px;
    height: 40px;
    flex: none;
  }

  .time {
    flex: none;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .npi .acts {
    margin-top: 18px;
  }

  .lyrics-collapse {
    display: grid;
    grid-template-rows: 0fr;
    margin-top: 0;
    opacity: 0;
    pointer-events: none;
    transition:
      grid-template-rows var(--dur-med4) var(--ease-emphasized-decel),
      margin-top var(--dur-med4) var(--ease-emphasized-decel),
      opacity var(--dur-short4) var(--ease-emphasized);
  }

  .lyrics-collapse.open {
    grid-template-rows: 1fr;
    margin-top: 4px;
    opacity: 1;
    pointer-events: auto;
  }

  .lyrics-clip {
    min-height: 0;
    overflow: hidden;
    border-radius: var(--r-md) var(--r-md) var(--r-card) var(--r-card);
    transition: border-radius var(--dur-spring) var(--spring);
  }

  .lyrics-clip:hover {
    border-radius: var(--r-md) var(--r-md) var(--r-card-hover)
      var(--r-card-hover);
  }

  .lyrics-card {
    width: 100%;
    padding: 24px 28px;
    background: var(--tc);
    color: var(--ontc);
  }

  .lyrics-lines {
    max-height: 240px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 8px;
  }

  .lyrics-lines p {
    margin: 0;
    font-size: 15px;
    line-height: 1.55;
  }

  .lyrics-state {
    margin: 0;
  }

  .lyrics-credit {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid color-mix(in srgb, var(--ontc) 14%, transparent);
  }

  .lyrics-credit a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
</style>
