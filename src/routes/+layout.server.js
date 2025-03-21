import { fetchWordPressData } from '$lib/api/WPhandler.js';
import { getCached, setCache } from '$lib/api/cache.js';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const cacheKey = 'layout-wordpress-data';
	const cached = getCached(cacheKey);

	if (cached) {
		return cached;
	}

	const postsPerPage = 12;

	try {
		const [posts, series, categories, tags] = await Promise.all([
			fetchWordPressData({ type: 'posts', limit: postsPerPage }),
			fetchWordPressData({ type: 'series' }),
			fetchWordPressData({ type: 'categories' }),
			fetchWordPressData({ type: 'tags' })
		]);

		const result = { posts, series, categories, tags };

		// Cache for 5 minutes
		setCache(cacheKey, result, 1000 * 60 * 5);

		return result;
	} catch (error) {
		console.error('Error loading data in +layout.server.js:', {
			message: error.message,
			stack: error.stack
		});

		return {
			posts: [],
			series: [],
			categories: [],
			tags: [],
			error: 'Failed to load data from WordPress.'
		};
	}
}
