// Simple in-memory cache
const cacheStore = new Map();

export function getCached(key) {
	const entry = cacheStore.get(key);
	if (!entry) return null;

	const isExpired = Date.now() - entry.timestamp > entry.ttl;
	if (isExpired) {
		cacheStore.delete(key);
		return null;
	}

	return entry.data;
}

export function setCache(key, data, ttl = 1000 * 60 * 5) {
	cacheStore.set(key, {
		data,
		timestamp: Date.now(),
		ttl
	});
}
