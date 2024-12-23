// src/lib/utils.js
const baseUrl = 'https://kaihatsunosho.com';

export async function fetchWordPressData(postsPerPage = 10) {
	const postsUrl = `${baseUrl}/wp-json/wp/v2/posts?per_page=${postsPerPage}`;
	const seriesUrl =  `${baseUrl}/wp-json/publishpress/v1/series/`;
	const categoriesUrl = `${baseUrl}/wp-json/wp/v2/categories?_fields=id,name,link,count,parent,slug&orderby=slug&order=asc`;
	const tagsUrl = `${baseUrl}/wp-json/wp/v2/tags?_fields=id,name,slug,count`;


  try {
		const [postsResponse, seriesResponse, categoriesResponse, tagsResponse] = await Promise.all([
			fetch(postsUrl),
			fetch(seriesUrl),
			fetch(categoriesUrl),
			fetch(tagsUrl)
		]);

		if (!postsResponse.ok || !seriesResponse.ok ||  !categoriesResponse.ok || !tagsResponse.ok) {
			throw new Error('Error fetching data from WordPress API');
		}

		const posts = await postsResponse.json();
		const series = await seriesResponse.json();
		const categories = await categoriesResponse.json();
		const tags = await tagsResponse.json();
		return { posts, series, categories, tags  };
	} catch (error) {
		console.error('Failed to fetch WordPress data:', error);
		throw error;
	}
}



export async function fetchSinglePost(slug) {
	const postUrl = `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`;

	try {
		const postResponse = await fetch(postUrl);
    console.log(postUrl)

		if (!postResponse.ok) {
			throw new Error('Error fetching single post from WordPress API');
		}

		const post = await postResponse.json();

		return post;
	} catch (error) {
		console.error('Failed to fetch WordPress data:', error);
		throw error;
	}
}
