import { fetchSinglePost, fetchSeriesById } from '$lib/api/WPhandler.js';

export async function load({ params, url }) {
  try {
    const { slug } = params;
    const seriesId = url.searchParams.get('seriesId');
    const post = await fetchSinglePost(slug);
    let seriesData = [];

    if (!post) {
      throw new Error('Post not found');
    }

    if (seriesId) {
      seriesData = await fetchSeriesById(seriesId);
	  console.log(seriesData)
    }

	// console.log(post)

    return {
      post,
      seriesData,
      seriesId
    };
  } catch (error) {
    console.error('Error loading post data:', error.message);
    return {
      status: 500,
      error: new Error('Internal Server Error')
    };
  }
}
