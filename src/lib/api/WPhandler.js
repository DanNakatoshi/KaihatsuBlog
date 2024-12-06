// src/lib/utils.js
export async function fetchWordPressData(postsPerPage = 10) {
    const baseUrl = "https://kaihatsunosho.com";
    const postsUrl = `${baseUrl}/wp-json/wp/v2/posts?per_page=${postsPerPage}`;
    const categoriesUrl = `${baseUrl}/wp-json/wp/v2/categories`;
  
    try {
      const [postsResponse, categoriesResponse] = await Promise.all([
        fetch(postsUrl),
        fetch(categoriesUrl),
      ]);
  
      if (!postsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Error fetching data from WordPress API');
      }
  
      const posts = await postsResponse.json();
      const categories = await categoriesResponse.json();
  
      return { posts, categories };
    } catch (error) {
      console.error('Failed to fetch WordPress data:', error);
      throw error;
    }
  }
  