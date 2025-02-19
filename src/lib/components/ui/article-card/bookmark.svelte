<script>
	// import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark } from 'lucide-svelte';

	let { postId } = $props();
</script>

<!-- <button onclick={() => userMgr.toggleBookmark(postId)}>
	<Bookmark class={userMgr.bookmarks.includes(postId) ? 'fill-black' : 'fill-none'} />
</button> -->

<!-- <style>
	.fill-black {
		fill: black;
		stroke: black;
	}
</style> -->
