const baseUrl = 'https://kaihatsunosho.com';

async function fetchWordPressAPI(endpoint, params = {}) {
	const url = new URL(`${baseUrl}/wp-json${endpoint}`);
	Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

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

// Generalized function to fetch WordPress data

export async function fetchWordPressData({
	type,
	page = 1,
	limit = 12,
	category = null,
	slug = null,
	seriesId = null
} = {}) {
	const endpoints = {
		posts: '/wp/v2/posts',
		series: '/publishpress/v1/series',
		categories: '/wp/v2/categories',
		tags: '/wp/v2/tags',
		singlePost: '/wp/v2/posts',
		seriesById: `/publishpress/v1/seriesId/${seriesId}`
	};

	const fieldsMap = {
		posts:
			'id,title,slug,date,modified,yoast_head_json.description,series,tags,categories,view_count',
		singlePost:
			'id,title,slug,date,modified,content.rendered,excerpt.rendered,categories,tags,series,yoast_head_json.description,view_count'
	};

	const params = {
		page,
		per_page: limit,
		_fields: fieldsMap[type] || ''
	};

	if (type === 'singlePost' && slug) {
		params.slug = slug;
	} else if (type === 'posts' && category && category !== 'all') {
		params.categories = category;
	}

	try {
		const endpoint = endpoints[type];
		if (!endpoint) throw new Error(`Invalid type: ${type}`);
		return await fetchWordPressAPI(endpoint, params);
	} catch (error) {
		console.error(`Error fetching WordPress data`, { type, params, error });
		return [];
	}
}

// Wrapper Functions
export async function fetchPosts({ page = 1, limit = 12, category }) {
	return fetchWordPressData({ type: 'posts', page, limit, category });
}

export async function fetchSinglePost(slug) {
	return fetchWordPressData({ type: 'singlePost', slug });
}

export async function fetchSeriesById(seriesId) {
	return fetchWordPressData({ type: 'seriesById', seriesId });
}

/**
 * Fetch a single page from the WordPress REST API.
 * @param {Object} options - Options for fetching the page.
 * @param {string} [options.slug] - The slug of the page.
 * @param {number} [options.id] - The ID of the page.
 * @returns {Promise<Object>} - The page data.
 * @throws Will throw an error if the request fails or no page is found.
 */
export async function fetchWordPressPage({ slug = null, id = null } = {}) {
	const endpoint = '/wp/v2/pages';

	// Build the query parameters
	const params = new URLSearchParams();
	if (slug) {
		params.append('slug', slug);
	}
	if (id) {
		params.append('id', id);
	}

	// 必要なフィールドのみ取得
	params.append('_fields', 'title,content');

	try {
		const url = `${baseUrl}/wp-json${endpoint}?${params.toString()}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Error fetching page: ${response.statusText}`);
		}

		const pageData = await response.json();

		// If fetching by slug, response is an array; return the first item
		if (slug && Array.isArray(pageData)) {
			if (pageData.length === 0) {
				throw new Error(`No page found with slug: ${slug}`);
			}
			return pageData[0];
		}

		// If fetching by ID, response is a single object
		if (id) {
			return pageData;
		}

		throw new Error('Invalid fetch parameters: Provide either slug or id.');
	} catch (error) {
		console.error('Error fetching WordPress page:', error);
		throw error;
	}
}
