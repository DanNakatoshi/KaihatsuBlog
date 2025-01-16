import { fetchWordPressData } from '$lib/api/WPhandler.js';

export const GET = async () => {
    const baseUrl = 'https://asameshicode.com';

    // Fetch article data from WordPress
    const { posts } = await fetchWordPressData();

    // Static routes
    const staticRoutes = ['', 'about', 'privacy-policy', 'contact'];

    // Combine static routes and dynamic article routes
    const sitemapRoutes = [
        ...staticRoutes.map(route => ({
            loc: `${baseUrl}/${route}`,
            lastmod: new Date().toISOString(),
            priority: route === '' ? 1.0 : 0.8,
        })),
        ...posts.map(post => ({
            loc: `${baseUrl}/articles/${post.slug}`,
            lastmod: post.modified || post.date,
            priority: 0.9,
        })),
    ];

    // Generate the XML content for the sitemap
    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapRoutes
            .map(route => `
              <url>
                <loc>${route.loc}</loc>
                <lastmod>${route.lastmod}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>${route.priority}</priority>
              </url>
            `)
            .join('')}
      </urlset>
    `.trim();

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
};
