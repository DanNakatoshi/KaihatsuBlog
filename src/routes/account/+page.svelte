<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { goto } from '$app/navigation';

	import { userMgr } from '$lib/store/userData.svelte.js';

	// Components
	import StatusCards from '$lib/components/ui/custom-user-status/StatusCards.svelte';
	let isOpen = $state(false);

	function closeModal() {
		isOpen = false;
	}

	function openModal() {
		isOpen = true;
	}

</script>


{#if userMgr?.user} 
<div>
	<!-- <Button variant="destructive">アカウントを削除</Button> -->
	<StatusCards />

	<div class="flex justify-end gap-2 p-2">
		<Button
			onclick={() => {
				userMgr.signOut();
			}}
		>
			<span>ログアウト</span>
		</Button>
		<Button variant="destructive" onclick={openModal}>アカウントを削除</Button>
	</div>
</div>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		アカウントを削除するとブックマークの記録やコメントなどアカウントに関連するデータを含めてすべてのデータが削除され取り戻すことが不可能になります。
		それでも、アカウントの削除をしますか？
		<div class="flex justify-center gap-3">
			<Button onclick={closeModal}>キャンセル</Button>
			<Button variant="destructive" onclick={() => userMgr.deleteAccount()}>アカウントを削除</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

{:else}

roguinnya
{/if}
