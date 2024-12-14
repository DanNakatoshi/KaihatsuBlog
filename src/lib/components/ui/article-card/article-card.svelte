<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';

	let { post } = $props();

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

<Card.Root>
	<Card.Header>
		<!-- {JSON.stringify(post)} -->
		<Card.Title class="flex flex-wrap items-center gap-2"
			>{post.title.rendered}
			<!-- <Badge variant="secondary">{getMainCategoryName()}</Badge> -->
		</Card.Title>
	</Card.Header>
	<Card.Content>
		{post.yoast_head_json.description}
	</Card.Content>
	<Card.Footer class="flex justify-end">
		<Button class="" onclick={() => handleReadButton(post.slug)}>読む</Button>
	</Card.Footer>
</Card.Root>
