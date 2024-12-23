// DELETE IF NOT NEED

export const mainCategoryInfo = [
	{
		name:"エッセイ",
		slug: "essay",
		id: 21,
	},
	{
		name:"開発ログ",
		slug: "technical",
		id: 22
	}
]

function createTagsData() {
	let tagsData = $state([]);
	let tagMap = new Map();

	function updateTagMap() {
		tagMap = new Map(tagsData.map((tag) => [tag.id, tag.name]));
	}

	function getTagNames(tagIds) {
		return tagIds.map((tagId) => tagMap.get(tagId) || 'Unknown');
	}

	return {
		get tagsData() {
			return tagsData;
		},
		setTagsData(newData) {
			tagsData.splice(0, tagsData.length, ...newData); // Update reactive state
			updateTagMap(); // Refresh the map
		},
		getTagNames,
	}
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
		},
	}
}
export const seriesMgr = createSeriesData();


function createArticleData() {
	let articleData = $state([]);
	let selectedCategoryFilters = $state([])
	return {
		// Getters
		get articleData() {
			return articleData;
		},
		get selectedCategoryFilters() {
			return selectedCategoryFilters;
		},
		// Setters
		setArticleData(newData) {
			articleData = newData;
		},
		setCategoryData(newCategories) {
			categoryData = newCategories;
		},

		// Methods for Article Management
		addArticle(newArticle) {
			articleData = [...articleData, newArticle];
		},
		// removeArticle(articleId) {
		// 	articleData = articleData.filter(article => article.id !== articleId);
		// },
		filterArticlesByCategory(category) {
			return articleData.filter(article => 
				selectedCategoryFilters.length === 0 || 
				selectedCategoryFilters.includes(article.category)
			);
		},
	};
}

export const articleMgr = createArticleData();


export function createFilterData() {
	let selectedCategoryFilters = $state([])
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
			return articleData.filter(article => 
				selectedCategoryFilters.length === 0 || 
				selectedCategoryFilters.includes(article.category)
			);
		},
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

