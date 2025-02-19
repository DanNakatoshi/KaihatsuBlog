<script>
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark } from 'lucide-svelte';
	import LoginPopup from '$lib/components/ui/custom-google-login/LoginPopup.svelte';
	import { onMount } from 'svelte';

	let { postId } = $props();
	let isBookmarked = $derived(userMgr?.bookmarks?.includes(postId) ?? false);

	async function handleBookmark() {
		if (!userMgr?.user) {
			// alert("Please log in to bookmark this post.");
			return;
		}
		await userMgr.toggleBookmark(postId);
	}
</script>

<!-- {isBookmarked} -->

{#if userMgr?.user}
	<button onclick={handleBookmark} aria-label="Toggle Bookmark">
		<Bookmark
			class="text-current transition-all duration-200"
			style="fill: {isBookmarked ? 'currentColor' : 'none'};"
		/>
	</button>
{:else}
	<LoginPopup />
{/if}
