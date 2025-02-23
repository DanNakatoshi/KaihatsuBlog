<!-- <script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark } from 'lucide-svelte';
</script>

<Card.Root class="max-w-sm mx-auto">
	<Card.Header>
		<Card.Title class="flex items-center space-x-2">
			<Bookmark class="h-6 w-6 text-primary" />
			<span class="text-lg font-bold">ブックマーク</span>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="text-3xl font-bold">
			{userMgr?.bookmarks?.length || 0}
		</div>
		<p class="text-sm text-muted-foreground mt-1">お気に入りの記事</p>
	</Card.Content>
</Card.Root> -->

<script lang="ts">
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark } from 'lucide-svelte';

	let filterActive = false;

	function toggleBookmarkFilter() {
		filterActive = !filterActive;
		// Add your filtering logic here, for example:
		// articleMgr.filterByBookmarks(filterActive);
	}
</script>

<button 
	on:click={toggleBookmarkFilter} 
	class="relative inline-flex items-center px-4 py-2 border rounded shadow hover:bg-gray-100 focus:outline-none"
>
	<Bookmark class="h-6 w-6 text-primary" />
	<span class="ml-2 font-semibold">ブックマーク</span>
	<!-- Badge displaying number of bookmarks -->
	{#if userMgr?.bookmarks?.length}
		<span class="absolute top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
			{userMgr.bookmarks.length}
		</span>
	{/if}
</button>
