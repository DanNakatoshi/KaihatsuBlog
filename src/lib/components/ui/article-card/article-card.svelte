<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	// import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';
	import { Description } from 'formsnap';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import PublishInfoBadge from '$lib/components/ui/article-card/publish-info-badge.svelte';

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

<Card.Root class=" ">
	<Card.Header>
		<Card.Title class="flex flex-wrap items-center gap-2">
			<button
				onclick={() => articleMgr.handleReadButton(post?.slug)}
				class="text-left leading-tight hover:text-primary"
			>
				<span class="font-semibold">{post?.title?.rendered}</span>
			</button>
		</Card.Title>
		<div class="pt-2">
			<PublishInfoBadge date={post?.date} modified={post?.modified} />
		</div>
	</Card.Header>
	<Card.Content class="">
		<p class=" text-gray-dark text-sm">
			{post?.yoast_head_json?.description}
		</p>
		<div class="flex flex-wrap justify-start gap-2 pt-2">
			{#if post?.tags}
				{#each tagMgr.getTagNames(post?.tags) as tag (tag)}
					<span class="text-xs font-bold">
						#{tag}
					</span>
				{/each}
			{/if}
		</div>
	</Card.Content>


	{#if post?.series?.length > 0}
		<Card.Footer class="flex flex-col min-w-max ">
			<span class="flex min-w-auto ">
				<span class=" mb-1 px-2 py-0 text-xs font-bold "> シリーズで読む </span>
			</span>
			<div class="flex flex-wrap justify-end gap-2">
				{#each getSeriesNames(post?.series) as series (series.id)}
					<button
						onclick={() => articleMgr.handleReadButton(post?.slug, series?.id)}
						class="rounded p-2 pt-1 text-left leading-tight text-primary hover:bg-primary hover:text-white"
					>
						<span class="text-xs font-bold">{series?.name}</span>
					</button>
				{/each}
			</div>
		</Card.Footer>
	{/if}
</Card.Root>
