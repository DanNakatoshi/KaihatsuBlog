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
        },
    }
}

export const articleMgr = createArticleData();

export function categorizeCategories(categories) {
  const mainCat = [];
  const childCat = [];
  const grandChildCat = [];

  // Iterate over each category
  categories.forEach((category) => {
      const parts = category.link.split('/').filter(Boolean); // Split the link by '/'
      
      category.id = String(category.id); // Convert parent to a string


      if (parts.length === 4) {
        if (category.name !== 'Uncategorized') {
          mainCat.push(category);
        }
      } 
      // Child categories are those with exactly 4 parts (e.g., 'series/technical')
      else if (parts.length === 5) {
          childCat.push(category);
      } 
      // Grandchild categories are those with exactly 5 parts (e.g., 'series/technical/svelte5-for-beginners')
      else if (parts.length === 6) {
          grandChildCat.push(category);
      }
  });

  // Return the categorized lists
  return {
      mainCat,
      childCat,
      grandChildCat
  };
}