export function generateTableOfContents(articleContent) {
    if (typeof articleContent !== 'string' || !articleContent.trim()) {
      console.warn('Invalid article content provided');
      return [];
    }
  
    // Parse the HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(articleContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
  
    // Build the ToC without modifying the original HTML
    return Array.from(headings).map((heading) => ({
      text: heading.textContent.trim(),
      level: parseInt(heading.tagName[1], 10), // Extract heading level (e.g., 1 for <h1>)
    }));
  }
  