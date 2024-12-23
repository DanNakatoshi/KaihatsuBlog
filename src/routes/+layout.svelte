<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { categorizeCategories } from '$lib/store/articleData.svelte.js';

	let { children, data } = $props();

	tagMgr.setTagsData(data.tags)
	seriesMgr.setSeriesData(data.series)
	articleMgr.setArticleData(data.posts)
	
</script>

<div class="sm:container mb-4">
	<Header />

	<div class="">
		{@render children(data)}
	</div>
</div>
