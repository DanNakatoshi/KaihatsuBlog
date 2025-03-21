<script>
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import UserLogin from '$lib/components/ui/custom-auth/UserLogin.svelte';

	
	let { postId, size = '36', isCircleBtn = false, hasShowLable = false,  } = $props();
	let isBookmarked = $derived(userMgr?.bookmarks?.includes(postId) ?? false);
	let isOpen = $state(false); // Controls the login dialog

	async function handleBookmark() {
		if (!userMgr?.user) {
			isOpen = true; // Open login dialog
			return;
		}
		await userMgr.toggleBookmark(postId);
	}

	$effect(()=>{
		userMgr?.user ? isOpen = false : ''
	})
	
</script>

<Button
	onclick={handleBookmark}
	aria-label="Toggle Bookmark"
	variant="ghost"
	class="flex flex-col items-center gap-1 transition-all"
>
	<Bookmark
		class="text-primary transition-all duration-200"
		style="fill: {isBookmarked ? 'currentColor' : 'none'};"
		{size}
	/>
	{#if hasShowLable}
		<span class="text-xs">ブクマ</span>
	{/if}
</Button>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="flex justify-center">
		<UserLogin/>
	</Dialog.Content>
</Dialog.Root>
