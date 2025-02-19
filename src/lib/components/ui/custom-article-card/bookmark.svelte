<script>
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark } from 'lucide-svelte';
	import LoginPopup from '../custom-google-login/LoginPopup.svelte';
	// ✅ Props: Post ID to be bookmarked
	let { postId } = $props();

	// ✅ Check if this post is already bookmarked
	// let isBookmarked = $state(userMgr?.bookmarks?.includes(postId) ?? false);
	let isBookmarked = $derived(userMgr?.bookmarks?.includes(postId) ?? false);

	// $effect(() => {
	// 	isBookmarked = userMgr?.bookmarks?.includes(postId) ?? false;
	// });

	async function handleBookmark() {
		if (!userMgr?.user) {
			// alert("Please log in to bookmark this post.");
			return;
		}
		await userMgr.toggleBookmark(postId);
	}

</script>
<!-- {isBookmarked} -->
 <LoginPopup/>
<button onclick={handleBookmark} aria-label="Toggle Bookmark">
	<Bookmark class={isBookmarked ? 'fill-black' : 'fill-none'} />
</button>

<style>
	.fill-black {
		fill: black;
		stroke: black;
	}
</style>
