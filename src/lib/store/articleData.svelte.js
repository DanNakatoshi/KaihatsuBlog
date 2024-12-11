// DELETE IF NOT NEED
function createArticleData() {
	let articleData = $state([]);
	return {
		get articleData() {
			return articleData;
		},
		setArticleData(newData) {
			articleData = newData;
		},
		addArticle(newArticle) {
			articleData = [...articleData, newArticle];
		}
	};
}

export const articleMgr = createArticleData();



export function categorizeCategories(categories) {
	const mainCats = [];
	const childCats = [];
	const grandchildCats = [];
	const childCatNames = [];
	const groupedChildCats = {};

	// Iterate over each category
	categories.forEach((category) => {
		// Check if category is a main category (no parent or parent is 0)
		if (category.parent === 0 || category.parent === null) {
			if (category.name !== 'Uncategorized') {
				mainCats.push(category);
			}
		}
		// Check if category is a child category (has a parent)
		else if (category.parent > 0) {
			childCats.push(category);
			childCatNames.push(category.name);
		}
		// Grandchild categories (can be identified based on another logic)
		// If needed, can check for categories with multiple nested parents
		else if (category.parent) {
			grandchildCats.push(category);
		}
	});

	// Group child categories by their parent
	childCats.forEach((cat) => {
		if (!groupedChildCats[cat.parent]) {
			groupedChildCats[cat.parent] = [];
		}
		groupedChildCats[cat.parent].push(cat);
    console.log(groupedChildCats)
	});


	return {
		mainCats,
		childCats,
		grandchildCats,
		childCatNames,
		groupedChildCats
	};
}

// export function categorizeCategories(categories) {
// 	const mainCats = [];
// 	const childCats = [];
// 	const grandchildCats = [];
// 	const childCatNames = [];
// 	const groupedChildCats = {};

// 	// Iterate over each category
// 	categories.forEach((category) => {
// 		const parts = category.link.split('/').filter(Boolean); // Split the link by '/'

// 		// category.id = String(category.id); // Convert parent to a string

// 		if (parts.length === 4) {
// 			if (category.name !== 'Uncategorized') {
// 				mainCats.push(category);
// 			}
// 		}
// 		// Child categories are those with exactly 4 parts (e.g., 'series/technical')
// 		else if (parts.length === 5) {
// 			childCats.push(category);
// 			childCatNames.push(category.name);
// 		}
// 		// Grandchild categories are those with exactly 5 parts (e.g., 'series/technical/svelte5-for-beginners')
// 		else if (parts.length === 6) {
// 			grandchildCats.push(category);
// 		}
// 	});

// 	childCats.forEach((cat) => {
// 		if (!groupedChildCats[cat.parent]) {
// 			groupedChildCats[cat.parent] = [];
// 		}
// 		groupedChildCats[cat.parent].push(cat);
// 	});

//   console.log(groupedChildCats)
// 	// Return the categorized lists
// 	return {
// 		mainCats,
// 		childCats,
// 		grandchildCats,
// 		childCatNames,
// 		groupedChildCats
// 	};
// }
