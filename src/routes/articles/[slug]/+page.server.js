import { fetchSinglePost } from '$lib/api/WPhandler.js';

export async function load({ params, url }) {
	try {
		const { slug } = params; // Extract the slug from params
        const post = await fetchSinglePost(slug);
        const seriesId = url.searchParams.get('seriesId'); // Get the seriesId from the URL

		if (!post) {
			return {
				status: 404, // Return a 404 status if the article is not found
				error: new Error('Article not found') // Custom error message
			};
		}
		return {
			post
		};
	} catch (error) {
		console.error('Error fetching article:', error.message);
		return {
			status: 500, // Internal server error if something goes wrong
			error: new Error('Internal Server Error') // Custom error message
		};
	}
}
