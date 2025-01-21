import { fetchWordPressPage } from '$lib/api/WPhandler.js';

export async function load() {
	try {
		const page = await fetchWordPressPage({ slug: 'siteupdates' });

		return {
			siteupdates: {
				title: page.title.rendered,
				content: page.content.rendered,
			}
		};
	} catch (error) {
		console.error('Error loading siteupdates page:', error);

		// Provide a fallback error message
		return {
			error: 'Failed to load siteupdates page. Please try again later.'
		};
	}
}
