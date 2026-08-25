/**
 * Small in-memory sliding-window limiter.
 *
 * Best effort by design: it is per-instance, so a horizontally scaled deploy
 * gets `limit * instances`. It exists to stop a single script hammering the
 * lead endpoint, not as a security boundary — the honeypot, timing check and
 * schema validation do the real filtering.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 5000;

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/** Records a hit without consuming quota checks — used after a lead lands. */
export function recordHit(key: string, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((hit) => now - hit < windowMs);
  bucket.hits.push(now);
  buckets.set(key, bucket);
}

/** Reads the current window without recording a hit. */
export function peek(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const hits = (buckets.get(key)?.hits ?? []).filter((hit) => now - hit < windowMs);
  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };

  bucket.hits = bucket.hits.filter((hit) => now - hit < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now;
    buckets.set(key, bucket);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [entryKey, entry] of buckets) {
      if (entry.hits.every((hit) => now - hit >= windowMs)) buckets.delete(entryKey);
      if (buckets.size <= MAX_TRACKED_KEYS) break;
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
