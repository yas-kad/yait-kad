export type LimitResult = { allowed: boolean; retryAfter: number };
export interface RateLimiter { consume(key: string, limit: number, seconds: number): Promise<LimitResult> }

/** Local development only. Production must use a shared, atomic store. */
export function memoryLimiter(now = Date.now): RateLimiter {
  const buckets = new Map<string, { used: number; reset: number }>();
  return { async consume(key, limit, seconds) {
    const time = now();
    for (const [id, bucket] of buckets) if (bucket.reset <= time) buckets.delete(id);
    if (!buckets.has(key) && buckets.size >= 10000) throw new Error('LIMIT_STORE_FULL');
    const bucket = buckets.get(key) ?? { used: 0, reset: time + seconds * 1000 };
    buckets.set(key, bucket);
    const retryAfter = Math.max(1, Math.ceil((bucket.reset - time) / 1000));
    if (bucket.used >= limit) return { allowed: false, retryAfter };
    bucket.used++;
    return { allowed: true, retryAfter };
  } };
}

// Atomically check/increment and expire; blocked requests do not extend the window.
const SCRIPT = `local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count >= tonumber(ARGV[1]) then return {0, redis.call('TTL', KEYS[1])} end
count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[2]) end
return {1, redis.call('TTL', KEYS[1])}`;

export function redisLimiter(url: string, token: string, request: typeof fetch = fetch): RateLimiter {
  if (new URL(url).protocol !== 'https:') throw new Error('INVALID_REDIS_URL');
  return { async consume(key, limit, seconds) {
    const response = await request(url, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', SCRIPT, '1', `portfolio-chat:${key}`, String(limit), String(seconds)]),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error('LIMIT_STORE_UNAVAILABLE');
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('result' in data) || !Array.isArray(data.result)
      || data.result.length !== 2 || ![0, 1].includes(data.result[0]) || typeof data.result[1] !== 'number' || data.result[1] < 0) {
      throw new Error('INVALID_LIMIT_RESULT');
    }
    return { allowed: data.result[0] === 1, retryAfter: Math.max(1, data.result[1]) };
  } };
}
