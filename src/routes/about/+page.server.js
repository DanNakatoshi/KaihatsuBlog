import { fetchWordPressPage } from '$lib/api/WPhandler.js';

export async function load() {
	try {
		// Fetch the WordPress page with the slug 'about'
		const page = await fetchWordPressPage({ slug: 'about' });

		// Ensure the content is returned

		return {
			about: {
				title: page.title.rendered,
				content: page.content.rendered,
			}
		};
	} catch (error) {
		console.error('Error loading About page:', error);

		// Provide a fallback error message
		return {
			error: 'Failed to load About page. Please try again later.'
		};
	}
}
