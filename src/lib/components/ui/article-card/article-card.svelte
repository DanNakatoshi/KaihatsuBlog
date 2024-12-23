<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';
	import { Description } from 'formsnap';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';

	let { post } = $props();
	let publishedDate = new Date(post.date).toLocaleDateString();
	let modifiedDate = new Date(post.modified).toLocaleDateString();

	function getSeriesNames(seriesIds) {
		return seriesIds
			.map((seriesId) => {
				const series = seriesMgr.seriesData[seriesId];
				return series ? { id: series.series_ID, name: series.ser_name } : null; // Returns an object with both id and ser_name
			})
			.filter((series) => series !== null); // Filter out null values
	}

	function handleReadButton(slug, seriesId = null) {
		const url = seriesId ? `articles/${slug}?seriesId=${seriesId}` : `articles/${slug}`;
		goto(url);
	}
	// console.log(post.series)
</script>

<Card.Root class=" ">
	<Card.Header>
		<Card.Title class="flex flex-wrap items-center gap-2">
			{post.title.rendered}
		</Card.Title>
		<div>
			<Badge variant="secondary">
				公開日：{publishedDate}
			</Badge>
			<Badge variant="secondary">
				更新日：{modifiedDate}
			</Badge>
		</div>
		<Card.Description>
			{post.yoast_head_json.description}
		</Card.Description>
	</Card.Header>
	<Card.Content class="">
		<div class="flex flex-wrap justify-start gap-2 pt-2">
			{#each tagMgr.getTagNames(post.tags) as tag (tag)}
				<span class="text-xs font-bold">
					#{tag}
				</span>
			{/each}
		</div>

		{#each getSeriesNames(post.series) as series (series.id)}
			{series.name}
		{/each}

		<!-- {#if seriesObj.length > 0}
			<div class="pb-1 text-sm font-bold">シリーズで読むなら</div>
			<div class="flex flex-wrap gap-2">
				{#each seriesObj as series}
					<Button
						size="xs"
						class="p-1 text-xs"
						onclick={() => handleReadButton(post.slug, series.id)}>{series.name}</Button
					>
				{/each}
			</div>
		{/if} -->
	</Card.Content>

	<Card.Footer class="flex justify-end">
		<Button class="" onclick={() => handleReadButton(post.slug)}>
			<span class="font-bold">読む</span>
		</Button>
	</Card.Footer>
</Card.Root>
