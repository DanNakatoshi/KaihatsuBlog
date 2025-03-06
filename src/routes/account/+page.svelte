<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card/index.js';

	import { userMgr } from '$lib/store/userData.svelte.js';
	import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';
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
				<Button variant="destructive" onclick={() => userMgr.deleteAccount()}
					>アカウントを削除</Button
				>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Card.Root>
		<Card.Header class="justify-center items-center mt-4">
			<Card.Title>🔓 Googleでサインインして、新機能を楽しもう！</Card.Title>
			<Card.Description
				>ログインすると、便利な機能がどんどん使えるようになります！✨</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col gap-4 p-4 justify-center items-center">
				<ul class=" space-y-2 text-sm">
					<div>
						<li class="flex items-center gap-2">
							✅ <span class="font-semibold">ブックマーク機能</span>
						</li>
						<li class="flex items-center gap-2">
							💬 <span class="font-semibold">コメント機能（準備中）</span>
						</li>
						<li class="flex items-center gap-2">
							⭐ <span class="font-semibold">オープンソースに投票（準備中）</span>
						</li>
						<li class="flex items-center gap-2">
							🔑 <span class="font-semibold">メンバー限定記事（準備中）</span>
						</li>
					</div>
				</ul>

				<p class="mt-2 text-center text-sm">🚀 **今すぐログインして、新機能を体験しよう！** 🎉</p>

				<div class="flex justify-center">
					<GoogleSigninBtn class="w-full max-w-xs" />
				</div>
			</div>		</Card.Content>
	</Card.Root>
{/if}
