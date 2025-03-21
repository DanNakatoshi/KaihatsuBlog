import { fetchWordPressPage } from '$lib/api/WPhandler.js';
import { getCached, setCache } from '$lib/api/cache.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const cacheKey = 'wp-siteupdates-page';
	const cached = getCached(cacheKey);

	if (cached) {
		console.log('✅ Using cached /siteupdates page data');
		return cached;
	}

	console.log('🔄 Fetching fresh /siteupdates page data...');

	try {
		const page = await fetchWordPressPage({ slug: 'siteupdates' });

		const siteupdates = {
			title: page.title.rendered,
			content: page.content.rendered
		};

		// Cache for 10 minutes
		setCache(cacheKey, { siteupdates }, 1000 * 60 * 10);

		console.log('✅ /siteupdates page data cached');

		return { siteupdates };
	} catch (error) {
		console.error('❌ Error loading siteupdates page:', error);

		return {
			error: 'Failed to load siteupdates page. Please try again later.'
		};
	}
}
