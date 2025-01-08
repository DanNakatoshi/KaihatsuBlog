<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	// import { goto } from '$app/navigation';
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

</script>

<Card.Root class=" " >
	<Card.Header>
		<Card.Title class="flex flex-wrap items-center gap-2">
			<button  onclick={() => articleMgr.handleReadButton(post.slug)} class="text-left leading-tight hover:text-primary">
				<span class="font-semibold ">{post.title.rendered}</span>
			</button>
			<!-- {post.title.rendered} -->
		</Card.Title>
		<div>
			<Badge variant="secondary" class="">
				公開日：{publishedDate}
			</Badge>
			<Badge variant="secondary" class="">
				更新日：{modifiedDate}
			</Badge>
		</div>
		<Card.Description>
			<!-- {post.yoast_head_json.description} -->
		</Card.Description>
	</Card.Header>
	<Card.Content class="">
		<p class=" text-sm">
			{post.yoast_head_json.description}
		</p>
		<div class="flex flex-wrap justify-start gap-2 pt-2 " >
			{#each tagMgr.getTagNames(post.tags) as tag (tag)}
				<span class="text-xs font-bold">
					#{tag}
				</span>
			{/each}
		</div>


	</Card.Content>

	<Card.Footer class="flex flex-wrap justify-end gap-2">
		{#each getSeriesNames(post.series) as series (series.id)}
			<div class="relative">
				<span
					class="absolute -top-3 left-0 z-10 -rotate-3 px-2 py-1 text-xs font-bold text-primary "
				>
					シリーズで読む
				</span>
				<!-- Button content -->
				<Button variant="outline" onclick={() => articleMgr.handleReadButton(post.slug, series.id)}>
					<span class="font-bold">{series.name}</span>
				</Button>
			</div>
		{/each}
		<!-- <Button class="" onclick={() => articleMgr.handleReadButton(post.slug)}>
			<span class="font-bold">読む</span>
		</Button> -->
	</Card.Footer>
</Card.Root>
