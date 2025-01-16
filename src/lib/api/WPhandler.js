const baseUrl = 'https://kaihatsunosho.com';

async function fetchWordPressAPI(endpoint, params = {}) {
	const url = new URL(`${baseUrl}/wp-json${endpoint}`);
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	// console.log("Full URL:", url.toString());

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Error fetching from ${url}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching data from WordPress API:', error);
		throw error;
	}
}

export async function fetchWordPressData(postsPerPage = 10) {
	const posts = await fetchWordPressAPI('/wp/v2/posts', {
		per_page: postsPerPage,
		_fields: 'id,title,slug,date,modified,yoast_head_json.description,series,tags,categories'
	});
	const series = await fetchWordPressAPI('/publishpress/v1/series');
	const categories = await fetchWordPressAPI('/wp/v2/categories', { _fields: 'id,name,link,count,parent,slug', orderby: 'slug', order: 'asc' });
	const tags = await fetchWordPressAPI('/wp/v2/tags', { _fields: 'id,name,slug,count' });

	return { posts, series, categories, tags };
}

export async function fetchSinglePost(slug) {
	const posts = await fetchWordPressAPI('/wp/v2/posts', { slug });
	return posts[0]; 
}

export async function fetchSeriesById(seriesId) {
	return fetchWordPressAPI(`/publishpress/v1/seriesId/${seriesId}`);
}

// Fetch more articles for infinite scrolling
export async function fetchMoreArticles({ page = 1, limit = 12, category }) {
	const params = {
		page,
		per_page: limit,
		_fields: 'id,title,slug,date,modified,yoast_head_json.description,series,tags,categories',
	};

	// Only include the `categories` parameter if a valid category ID is provided
	if (category && category !== 'all') {
		params.categories = category; // `category` should be the numeric ID
	}

	try {
		const articles = await fetchWordPressAPI('/wp/v2/posts', params);
		return articles; // Return fetched articles
	} catch (error) {
		console.error('Error fetching more articles:', error);
		return [];
	}
}
