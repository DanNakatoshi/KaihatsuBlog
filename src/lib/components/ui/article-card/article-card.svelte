<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';

	let { post, tags } = $props();

	// function getMainCategoryName() {
	// 	const category = post.categories
	// 		.map((categoryId) => mainCategoryInfo.find((cat) => cat.id === categoryId))
	// 		.find(Boolean);
	// 	return category ? category.name : '未カテゴリ';
	// }

	function handleReadButton(slug) {
		goto(`articles/${slug}`);
	}
</script>

<Card.Root class=" ">
	<Card.Header>
		<!-- {JSON.stringify(post)} -->
		<Card.Title class="flex flex-wrap items-center gap-2">

			{post.title.rendered}
        </Card.Title>

			<!-- <Badge variant="secondary">{getMainCategoryName()}</Badge> -->
	</Card.Header>
	<Card.Content class="">
		{post.yoast_head_json.description}

		<div class="flex flex-wrap justify-start gap-2 pt-2">
			{#each tags as tag (tag)}
				<span class="text-xs font-bold">
					#{tag}
				</span>
			{/each}
		</div>
	</Card.Content>

	<Card.Footer class="flex justify-end">
		<Button class="" onclick={() => handleReadButton(post.slug)}>
            <span class="font-bold">読む</span>
        </Button>
	</Card.Footer>
</Card.Root>
