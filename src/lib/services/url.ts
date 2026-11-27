export function sanitizeHttpsUrl(
  raw: unknown,
  allowedDomains: readonly string[],
  fallback = ''
): string {
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return fallback;
    if (parsed.username || parsed.password) return fallback;

    const host = parsed.hostname.toLowerCase();
    const allowed = allowedDomains.some(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    );
    return allowed ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function createTimeoutSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', onAbort);
    },
  };
}
