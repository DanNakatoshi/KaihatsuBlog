import { fetchWordPressData } from '$lib/api/WPhandler.js';

/**
 * Load function to fetch WordPress data on the server.
 * Fetches posts, series, categories, and tags from WordPress API.
 *
 * @returns {Promise<{ posts: Array, series: Array, categories: Array, tags: Array, error?: string }>}.
 */
export async function load() {
	const postsPerPage = 12; // Default number of posts per page

	try {
		// Fetch data from WordPress API using the updated fetchWordPressData
		const posts = await fetchWordPressData({ type: 'posts', limit: postsPerPage });
		const series = await fetchWordPressData({ type: 'series' });
		const categories = await fetchWordPressData({ type: 'categories' });
		const tags = await fetchWordPressData({ type: 'tags' });

		return {
			posts,
			series,
			categories,
			tags
		};
	} catch (error) {
		console.error('Error loading data in +layout.server.js:', {
			message: error.message,
			stack: error.stack
		});

		// Return fallback data and an error message for the client
		return {
			posts: [],
			series: [],
			categories: [],
			tags: [],
			error: 'Failed to load data from WordPress.'
		};
	}
}
