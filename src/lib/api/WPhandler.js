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
    seriesId = null,
} = {}) {
    const endpoints = {
        posts: '/wp/v2/posts',
        series: '/publishpress/v1/series',
        categories: '/wp/v2/categories',
        tags: '/wp/v2/tags',
        singlePost: '/wp/v2/posts',
        seriesById: `/publishpress/v1/seriesId/${seriesId}`,
    };

    const fieldsMap = {
        posts: 'id,title,slug,date,modified,yoast_head_json.description,series,tags,categories',
        singlePost:
            'id,title,slug,date,modified,content.rendered,excerpt.rendered,categories,tags,series,yoast_head_json.description',
    };

    const params = {
        page,
        per_page: limit,
        _fields: fieldsMap[type] || '',
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
