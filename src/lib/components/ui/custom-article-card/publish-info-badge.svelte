<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Eye } from 'lucide-svelte';

	let { date, modified, viewCount } = $props();

	// Convert date to YYYY-MM-DD format for easy comparison
	let publishedDate = date.split('T')[0];
	let modifiedDate = modified.split('T')[0];

	// Get today's date and the date 7 days ago in YYYY-MM-DD format
	let today = new Date().toISOString().split('T')[0];
	let sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	// Check if the publish date is within the last 7 days
	let isNew = publishedDate >= sevenDaysAgo;
</script>

<div class="flex flex-wrap items-end gap-2 ">
	<div class="relative ">
		{#if isNew}
			<span class="absolute -top-2 left-0 z-10 rotate-[-15deg] text-xs font-bold text-red-500">
				NEW
			</span>
		{/if}
		<Badge variant="secondary" >
			公開日：{publishedDate}
		</Badge>
	</div>

	<Badge variant="secondary">更新日：{modifiedDate}</Badge>
	{#if viewCount}
		<Badge variant="secondary">
			<Eye size="12" /> <span class="ml-2">{viewCount}</span>
		</Badge>
	{/if}
</div>
