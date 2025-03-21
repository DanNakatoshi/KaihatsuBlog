import { fetchWordPressPage } from '$lib/api/WPhandler.js';
import { getCached, setCache } from '$lib/api/cache.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const cacheKey = 'wp-about-page';
	const cached = getCached(cacheKey);

	if (cached) {
		console.log('✅ Using cached /about page data');
		return cached;
	}

	console.log('🔄 Fetching fresh /about page data...');

	try {
		const page = await fetchWordPressPage({ slug: 'about' });

		const about = {
			title: page.title.rendered,
			content: page.content.rendered
		};

		// Cache for 10 minutes
		setCache(cacheKey, { about }, 1000 * 60 * 60 * 24); // 24 hours

		console.log('✅ /about page data cached');

		return { about };
	} catch (error) {
		console.error('❌ Error loading About page:', error);

		return {
			error: 'Failed to load About page. Please try again later.'
		};
	}
}
