<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';
	import { Description } from 'formsnap';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import PublishInfoBadge from '$lib/components/ui/custom-article-card/publish-info-badge.svelte';
	import Bookmark from '$lib/components/ui/custom-article-card/bookmark.svelte';
	let { post } = $props();

	function getSeriesNames(seriesIds) {
		return seriesIds
			.map((seriesId) => {
				const series = seriesMgr.seriesData[seriesId];
				return series ? { id: series.series_ID, name: series.ser_name } : null; // Returns an object with both id and ser_name
			})
			.filter((series) => series !== null); // Filter out null values
	}
</script>

<Card.Root class="fade-in">
	<Card.Header>
		<div class="flex items-start justify-between gap-2">
			<button
				onclick={() => articleMgr.handleReadButton(post?.slug)}
				class="text-left leading-tight hover:text-primary"
			>
				<h3 class="font-semibold">{post?.title?.rendered}</h3>
			</button>
			<div class="">
				<Bookmark postId={post?.id} />
			</div>
		</div>
		<div class="pt-2">
			<PublishInfoBadge date={post?.date} modified={post?.modified} viewCount={post.view_count} />
		</div>
	</Card.Header>
	<Card.Content class="">
		<div class=" text-gray-dark text-sm">
			{post?.yoast_head_json?.description}
		</div>
		<div class="flex flex-wrap justify-start gap-2 ">
			{#if post?.tags}
				{#each tagMgr.getTagNames(post?.tags) as tag (tag)}
					<span class="text-xs font-bold">
						#{tag}
					</span>
				{/each}
			{/if}
		</div>
	</Card.Content>

	<Card.Footer>
		{#if post?.series?.length > 0}
			<div class="flex flex-wrap items-center justify-start gap-2">
				<span class=" py-0 text-xs font-bold"> 📖シリーズで読む: </span>
				{#each getSeriesNames(post?.series) as series (series.id)}
					<button
						aria-label={series?.name}
						onclick={() => articleMgr.handleReadButton(post?.slug, series?.id)}
						class="rounded p-2 pt-1 text-left leading-tight text-primary hover:bg-primary hover:text-white"
					>
						<span class="max-w-[10rem] truncate text-xs font-bold">{series?.name}</span>
					</button>
				{/each}
			</div>
		{/if}
	</Card.Footer>
</Card.Root>
