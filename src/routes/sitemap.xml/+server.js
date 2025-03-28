import { fetchWordPressData } from '$lib/api/WPhandler.js';

export const GET = async () => {
	const baseUrl = 'https://asameshicode.com';

	// Static routes
	const staticRoutes = ['', 'about', 'contact', 'account', 'articles', 'privacy-policy', 'siteupdates'];

	// Fetch WordPress posts directly as array
	const posts = await fetchWordPressData({ type: 'posts', limit: 100 });

	const sitemapRoutes = [
		...staticRoutes.map((route) => ({
			loc: `${baseUrl}/${route}`,
			lastmod: new Date().toISOString(),
			priority: route === '' ? 1.0 : 0.8
		})),
		...posts.map((post) => ({
			loc: `${baseUrl}/articles/${post.slug}`,
			lastmod: new Date(post.modified || post.date).toISOString(),
			priority: 0.9
		}))
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
	.map(
		(route) => `
	<url>
		<loc>${route.loc}</loc>
		<lastmod>${route.lastmod}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>${route.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
