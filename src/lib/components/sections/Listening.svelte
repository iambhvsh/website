<script lang="ts">
  import { untrack } from "svelte";
  import { Button, Scroll, Section, Shape, Wave } from "$lib/components/ui";
  import { SITE } from "$lib/data/site";
  import CalendarTodayIcon from "~icons/material-symbols/calendar-today-rounded";
  import CategoryIcon from "~icons/material-symbols/category-rounded";
  import LyricsIcon from "~icons/material-symbols/lyrics-rounded";
  import MusicNoteIcon from "~icons/material-symbols/music-note-rounded";
  import OpenInNewIcon from "~icons/material-symbols/open-in-new-rounded";
  import PauseIcon from "~icons/material-symbols/pause-rounded";
  import PlayArrowIcon from "~icons/material-symbols/play-arrow-rounded";
  import RefreshIcon from "~icons/material-symbols/refresh-rounded";
  import ScheduleIcon from "~icons/material-symbols/schedule-rounded";
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
  import {
    ARTWORK_SHAPES,
    LOADING_SHAPES,
  } from "$lib/shapes";

  let track = $state<NowPlayingTrack | null>(null);
  let artworkSrc = $state("");
  let fallbackArtworkUrl = $state("");
  let artworkLoaded = $state(false);
  let previewUrl = $state("");
  let trackGenre = $state("");
  let trackYear = $state("");
  let trackDuration = $state("");
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
        target.album,
      );
      if (seq !== lyricsSeq || controller.signal.aborted) return;
      lyrics = result;
      lyricsReady = true;
    } catch (err) {
      if (seq !== lyricsSeq || controller.signal.aborted) return;
      lyrics = null;
      lyricsError =
        err instanceof UnisonFetchError && err.rateLimited
          ? "Rate limited, try again shortly."
          : "Couldn’t load lyrics.";
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
      trackGenre = "";
      trackYear = "";
      trackDuration = "";
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
      trackGenre = media.genre ?? "";
      trackYear = media.releaseYear ?? "";
      trackDuration = media.durationText ?? "";
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
        trackGenre = "";
        trackYear = "";
        trackDuration = "";
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

<Section id="now">
  <div class="music-hero" bind:this={stackEl}>
    <div class="hero-left">
      <div class="music-head">
        <div class="status-row">
          <span class="status-pill label" class:live={track?.isLive}>
            <span class="status-dot" aria-hidden="true"></span>
            {track?.isLive ? "Now playing" : "Last played"}
          </span>
          {#if track?.date && !track.isLive}
            <span class="time-pill label">{track.date}</span>
          {/if}
        </div>
        <h1 class="hero music-title">{titleText}</h1>
        <p class="tl music-sub">
          {track?.artist ?? "Checking what’s playing right now."}
          {#if track?.album}
            <span class="album-sep"> · {track.album}</span>
          {/if}
        </p>
      </div>

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

        <div class="player-card surface-morph">
          <div class="player">
            <button
              type="button"
              class="exp-play"
              class:playing={previewPlaying}
              aria-label={previewPlaying ? "Pause preview" : "Play 30s preview"}
              onclick={togglePreview}
            >
              {#if previewPlaying}
                <PauseIcon />
              {:else}
                <PlayArrowIcon />
              {/if}
            </button>

            <div class="wave-wrap">
              <span class="label time">{formatClock(currentTime)}</span>
              <Wave
                progress={previewProgress}
                playing={previewPlaying}
                ariaLabel="Song preview progress"
                onseek={seekPreview}
              />
              <span class="label time">{formatClock(duration)}</span>
            </div>
          </div>
        </div>
      {/if}

      <div class="row acts">
        <Button href={track?.url ?? SITE.lastfmUrl} external>
          {#snippet icon()}
            <OpenInNewIcon />
          {/snippet}
          Open on Last.fm
        </Button>

        <Button
          variant={lyricsEnabled ? "filled" : "tonal"}
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

    <div
      class="hero-visual"
      class:lyrics-active={lyricsOpen}
      onpointerenter={() => {
        if (!lyricsOpen) cycleArtShape();
      }}
      role="presentation"
    >
      {#if lyricsOpen}
        <div class="lyrics-card surface-morph">
          <div class="lyrics-head">
            <span class="label lyrics-eyebrow">Lyrics</span>
            {#if track}
              <span class="bm sub">{track.name} · {track.artist}</span>
            {/if}
          </div>
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
                Lyrics from {lyrics.source === "lrclib" ? "LRCLib" : "Unison"}
              </a>
              {#if lyrics.source === "unison" && lyrics.submitterName && lyrics.submitterUrl}
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
            <p class="bs sub lyrics-state">No lyrics found.</p>
          {/if}
        </div>
      {:else}
        <div class="art-stage surface-morph">
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

          {#if trackGenre || trackYear || trackDuration}
            <div class="art-pills">
              {#if trackGenre}
                <span class="label art-chip tonal-sec">
                  <CategoryIcon aria-hidden="true" />
                  <span>{trackGenre}</span>
                </span>
              {/if}

              {#if trackYear}
                <span class="label art-chip tonal-ter">
                  <CalendarTodayIcon aria-hidden="true" />
                  <span>{trackYear}</span>
                </span>
              {/if}

              {#if trackDuration}
                <span class="label art-chip tonal-pri">
                  <ScheduleIcon aria-hidden="true" />
                  <span>{trackDuration}</span>
                </span>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="hero-scroll">
      <Scroll href="#favorites" label="Favorites" />
    </div>
  </div>
</Section>

<style>
  :global(#now.page-section) {
    padding-top: 48px !important;
  }

  .music-hero {
    position: relative;
    min-height: calc(100svh - 88px);
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    align-content: center;
    gap: 48px;
    padding: 20px 0 80px;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .music-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .status-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 6px 14px;
    border-radius: 9999px;
    background: var(--sc);
    color: var(--onsc);
  }

  .time-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 9999px;
    background: var(--sf2);
    color: var(--onv);
  }

  .status-pill.live {
    background: var(--tc);
    color: var(--ontc);
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  .music-title {
    font-size: clamp(38px, 6vw, 68px);
    line-height: 0.96;
    letter-spacing: -0.025em;
    overflow-wrap: anywhere;
  }

  .music-sub {
    color: var(--onv);
    max-width: 44ch;
  }

  .album-sep {
    opacity: 0.72;
  }

  .hero-visual {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .art-stage {
    width: 100%;
    max-width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 28px;
    background: radial-gradient(
        circle at 50% 35%,
        color-mix(in srgb, var(--pc) 32%, transparent),
        transparent 70%
      ),
      var(--sf);
    border-radius: var(--r-xl);
  }

  .art-pills {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .art-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: 100%;
    padding: 5px 12px;
    border-radius: 9999px;
  }

  .art-chip span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .art-chip :global(.ms-icon) {
    font-size: 15px;
    flex: none;
  }

  .art-chip.tonal-sec {
    background: var(--sc);
    color: var(--onsc);
  }

  .art-chip.tonal-ter {
    background: var(--tc);
    color: var(--ontc);
  }

  .art-chip.tonal-pri {
    background: var(--pc);
    color: var(--onpc);
  }

  .hero-visual :global(.art) {
    position: relative;
    width: 280px;
    height: 280px;
    background: var(--pc);
    color: var(--onpc);
    cursor: pointer;
  }

  .hero-visual img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .hero-visual img.visible {
    opacity: 1;
  }

  .fallback-icon :global(.ms-icon) {
    font-size: 72px;
  }

  .hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  .player-card {
    width: 100%;
    max-width: 500px;
    padding: 12px 16px;
    background: var(--sf);
    border-radius: var(--r-card);
  }

  .player {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .exp-play {
    width: 64px;
    height: 48px;
    flex: none;
    border: 0;
    border-radius: 24px;
    display: grid;
    place-items: center;
    cursor: pointer;
    background: var(--pc);
    color: var(--onpc);
    transition:
      width var(--dur-spring-fast) var(--spring-fast),
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .exp-play:hover {
    width: 70px;
    border-radius: 18px;
  }

  .exp-play.playing {
    width: 70px;
    border-radius: 16px;
    background: var(--p);
    color: var(--onp);
  }

  .exp-play:active {
    width: 74px;
    border-radius: 12px;
  }

  .wave-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--p);
  }

  .time {
    color: var(--onv);
    flex: none;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 860px) {
    .music-hero {
      grid-template-columns: 1fr;
      gap: 24px;
      align-content: center;
      padding: 16px 0 24px;
    }

    .hero-visual {
      order: -1;
      justify-content: center;
    }

    .art-stage,
    .lyrics-card {
      max-width: 100%;
      height: 300px;
      padding: 20px;
    }

    .hero-visual :global(.art) {
      width: 188px;
      height: 188px;
    }

    .fallback-icon :global(.ms-icon) {
      font-size: 56px;
    }
  }

  @media (max-width: 640px) {
    :global(#now.page-section) {
      padding-top: 20px !important;
    }

    .music-hero {
      min-height: calc(100svh - 56px);
      align-content: start;
      gap: 18px;
      padding: 20px 0 68px;
    }

    .hero-left {
      gap: 14px;
    }

    .acts {
      flex-wrap: nowrap;
      gap: 8px;
    }

    .acts :global(.btn) {
      height: 42px;
      padding: 0 14px;
      gap: 6px;
      font-size: 13px;
      white-space: nowrap;
    }

    .acts :global(.btn.icon-btn) {
      width: 42px;
      height: 42px;
      padding: 0;
      flex: none;
    }
  }

  .lyrics-card .sub {
    opacity: 0.85;
  }

  .lyrics-card {
    width: 100%;
    max-width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    background: var(--sf);
    color: var(--on);
    border-radius: var(--r-xl);
  }

  .lyrics-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
    flex: none;
  }

  .lyrics-eyebrow {
    color: var(--p);
  }

  .lyrics-lines {
    flex: 1;
    min-height: 0;
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
    border-top: 1px solid color-mix(in srgb, var(--onv) 16%, transparent);
  }

  @media (max-width: 860px) {
    .hero-visual.lyrics-active {
      padding: 0;
      background: transparent;
      min-height: 0;
    }
  }

  .lyrics-credit a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
</style>
