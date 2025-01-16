import { fetchWordPressData } from '$lib/api/WPhandler.js';

/**
 * Load function to fetch a single post and associated series data.
 * 
 * @param {object} params - Parameters from the route.
 * @param {object} url - URL object to retrieve query parameters.
 * @returns {Promise<{ post: object, seriesData: object | null, seriesId: string | null, error?: string }>}
 */
export async function load({ params, url }) {
  const { slug } = params;
  const seriesId = url.searchParams.get('seriesId');

  try {
    // console.log(`Fetching post with slug: "${slug}"`);

    // Fetch the single post
    const [post] = await fetchWordPressData({ type: 'singlePost', slug });
    if (!post) {
      throw new Error(`Post with slug "${slug}" not found.`);
    }
    // console.log('Fetched post:', post);

    // Fetch series data related to the post
    let postSeriesData = null;
    if (post.series?.length > 0) {
      const postSeriesId = post.series[0]; // Assuming the post can only belong to one series for now
      postSeriesData = await fetchWordPressData({ type: 'seriesById', seriesId: postSeriesId });
      // console.log(`Fetched series for post (${postSeriesId}):`, postSeriesData);
    }

    // Fetch series data by seriesId if provided
    let urlSeriesData = null;
    if (seriesId) {
      urlSeriesData = await fetchWordPressData({ type: 'seriesById', seriesId });
      // console.log(`Fetched series by seriesId (${seriesId}):`, urlSeriesData);
    }

    return {
      post,
      seriesData: urlSeriesData || postSeriesData,
      seriesId: urlSeriesData ? seriesId : post.series?.[0] || null,
    };
  } catch (error) {
    console.error('Error loading post data:', error.message);
    return {
      status: 500,
      error: new Error('Internal Server Error'),
    };
  }
}

