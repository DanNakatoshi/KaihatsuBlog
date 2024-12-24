// import { fetchSinglePost, fetchSeriesById } from '$lib/api/WPhandler.js';

// export async function load({ params, url }) {
// 	try {
// 		const { slug } = params; // Extract the slug from params
//         const post = await fetchSinglePost(slug);
//         const seriesId = url.searchParams.get('seriesId'); // Get the seriesId from the URL
// 		let seriesData = [];

// 		if (!post) {
// 			return {
// 				status: 404, // Return a 404 status if the article is not found
// 				error: new Error('Article not found') // Custom error message
// 			};
// 		}

// 		if (seriesId) {
// 			seriesData = await fetchSeriesById(seriesId);
// 		}
		
// 		return {
// 			post,
// 			seriesId,
// 			seriesData
// 		};
// 	} catch (error) {
// 		console.error('Error fetching article:', error.message);
// 		return {
// 			status: 500, // Internal server error if something goes wrong
// 			error: new Error('Internal Server Error') // Custom error message
// 		};
// 	}
// }

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
