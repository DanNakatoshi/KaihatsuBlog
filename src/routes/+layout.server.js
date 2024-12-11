// src/routes/+layout.server.js
import { fetchWordPressData } from '$lib/api/WPhandler.js';

/**
 * Load function to fetch WordPress data on the server.
 * @returns {Promise<{ posts: Array, categories: Array }>}
 */

export async function load() {
  try {
    const { posts, categories, tags } = await fetchWordPressData(10); // Adjust postsPerPage as needed
    return { posts, categories, tags };
  } catch (error) {
    console.error('Error in +layout.server.js load function:', error);
    return {
      posts: [],
      categories: [],
      tags: [],
      error: 'Failed to load data from WordPress.',
    };
  }
}
