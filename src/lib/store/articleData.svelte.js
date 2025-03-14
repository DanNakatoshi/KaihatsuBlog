// DELETE IF NOT NEED
import { goto } from '$app/navigation';

export const mainCategoryInfo = [
	{
		name: 'エッセイ',
		slug: 'essay',
		id: 21
	},
	{
		name: '開発ログ',
		slug: 'technical',
		id: 22
	}
];

function createTagsData() {
	let tagsData = $state([]); // Reactive state for tags
	let tagMap = new Map(); // Map to store tag IDs and names

	function updateTagMap() {
		// Create a Map of tag IDs to names
		tagMap = new Map(tagsData.map((tag) => [tag.id, tag.name]));
	}

	function getTagNames(tagIds) {
		// Ensure `tagIds` is an array
		if (!Array.isArray(tagIds)) {
			console.warn('Tags property is not an array:', tagIds);
			return []; // Return an empty array for invalid input
		}

		// Map tag IDs to tag names using the tagMap
		return tagIds
			.map((tagId) => tagMap.get(tagId)) // Retrieve tag name from the map
			.filter((tagName) => tagName !== undefined); // Filter out undefined tag names
	}

	return {
		// Getter for tagsData
		get tagsData() {
			return tagsData;
		},

		// Setter for tagsData
		setTagsData(newData) {
			tagsData.splice(0, tagsData.length, ...newData); // Update reactive state
			updateTagMap(); // Refresh the map
		},

		// Expose `getTagNames`
		getTagNames
	};
}

export const tagMgr = createTagsData();

function createSeriesData() {
	let seriesData = $state([]);

	return {
		get seriesData() {
			return seriesData;
		},
		setSeriesData(newData) {
			seriesData = newData;
		}
	};
}
export const seriesMgr = createSeriesData();




function createArticleData() {
	let articleData = $state([]);
	let selectedCategoryFilters = $state([]);
    let page = $state(1);

	function handleReadButton(slug, seriesId = null) {
		const url = seriesId ? `/articles/${slug}?seriesId=${seriesId}` : `/articles/${slug}`;
		goto(url);
	}

	return {
		handleReadButton,
        // Getters
        get articleData() {
            return articleData;
        },
        get selectedCategoryFilters() {
            return selectedCategoryFilters;
        },
        get page() {
            return page; 
        },

        // Setters
        setArticleData(newData) {
            articleData = newData;
        },
        setCategoryData(newCategories) {
            categoryData = newCategories;
        },
        setPage(newPage) {
            page = newPage; 
        },
		// Methods for Article Management
		addArticles(newArticle) {
			articleData = [...articleData, newArticle];
		},

		incrementPage() {
            page += 1; 
        },

        resetPage() {
            page = 1; 
        },

		// removeArticle(articleId) {
		// 	articleData = articleData.filter(article => article.id !== articleId);
		// },
		filterArticlesByCategory(category) {
			return articleData.filter(
				(article) =>
					selectedCategoryFilters.length === 0 || selectedCategoryFilters.includes(article.category)
			);
		}
	};
}

export const articleMgr = createArticleData();

export function createFilterData() {
	let selectedCategoryFilters = $state([]);
	return {
		// Getters
		get selectedCategoryFilters() {
			return selectedCategoryFilters;
		},
		// Setters
		setCategoryData(newCategories) {
			categoryData = newCategories;
		},

		// Methods for Article Management
		filterArticlesByCategory(category) {
			return articleData.filter(
				(article) =>
					selectedCategoryFilters.length === 0 || selectedCategoryFilters.includes(article.category)
			);
		}
	};
}
export const filterMgr = createFilterData();

export function categorizeCategories(categories) {
	const langCats = [];
	const seriesCats = [];

	categories.forEach((category) => {
		if (category.parent != 0) {
			if (category.link.includes('2-programming-language')) {
				langCats.push(category);
			} else if (category.link.includes('3-series')) {
				seriesCats.push(category);
			}
		}
	});

	return {
		langCats,
		seriesCats
	};
}
