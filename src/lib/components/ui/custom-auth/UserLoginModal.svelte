<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { loginModalManager } from '$lib/store/pageControl.svelte.js';
	// components
	import UserLogin from '$lib/components/ui/custom-auth/UserLogin.svelte';

	$effect(() => {
		if (userMgr?.user) loginModalManager.close();
	});
</script>


<Dialog.Root bind:open={loginModalManager.isModalOpen}>
	<Dialog.Content class="flex justify-center">
		<UserLogin />
	</Dialog.Content>
</Dialog.Root>
