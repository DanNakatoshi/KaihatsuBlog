<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Eye } from 'lucide-svelte';

	let { date, modified, viewCount } = $props();

	let publishedDate = new Date(date).toLocaleDateString();
	let modifiedDate = new Date(modified).toLocaleDateString();
</script>

<div class="flex flex-wrap gap-2">
	{#if publishedDate}
		<Badge variant="secondary">
			公開日：{publishedDate}
		</Badge>
	{/if}
	{#if modifiedDate}
		<Badge variant="secondary">
			更新日：{modifiedDate}
		</Badge>
	{/if}
	<!-- {#if viewCount}
		<Badge variant="secondary">
			<Eye size="12"/> <span class="ml-2">{viewCount}</span>
		</Badge>
	{/if} -->
</div>
