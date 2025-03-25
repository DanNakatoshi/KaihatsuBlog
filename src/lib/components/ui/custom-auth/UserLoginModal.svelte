<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { userMgr } from '$lib/store/userData.svelte.js';

	// components
	import UserLogin from '$lib/components/ui/custom-auth/UserLogin.svelte';

	let { loginModalButton } = $props();
	let isOpen = $state(false);

	const openModal = () => (isOpen = true);

	$effect(() => {
		userMgr?.user ? (isOpen = false) : '';
	});
</script>

{#if loginModalButton}
	{@render loginModalButton()}
{:else}
	<Button onclick={openModal} class="w-full">ログイン</Button>
{/if}

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="flex justify-center">
		<UserLogin />
	</Dialog.Content>
</Dialog.Root>
