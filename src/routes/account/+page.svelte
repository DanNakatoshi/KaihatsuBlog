<script>
	// Svelte
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// UI
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { userMgr } from '$lib/store/userData.svelte.js';
	import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';
	// Components
	import StatusCards from '$lib/components/ui/custom-user-status/StatusCards.svelte';

	// Icon
	import { Eye, EyeOff, Loader2 } from 'lucide-svelte';

	let isOpen = $state(false);

	// LOGGED IN USER
	// let isEmailUser = $state(false);
	// TODO: ADD PASSWORD UPDATE
	let isEmailUser = $derived(userMgr.user?.identities?.[0]?.provider === 'email');

	// GUEST
	// Email Signup
	let emailSignup = $state('');
	let passwordSignup = $state('');
	let showPasswordSignup = $state(false);
	let isSigningUp = $state(false);

	// EmailLogin
	let emailLogin = $state('');
	let passwordLogin = $state('');
	let showPasswordLogin = $state(false);
	let isLoggingIn = $state(false);

	let isResettingPassword = $state(false);
	let isResetting = $state(false);

	async function handleSignup() {
		isSigningUp = true;
		const result = await userMgr.signUpWithEmail(emailSignup, passwordSignup);
		isSigningUp = false;

		if (result) {
			emailSignup = '';
			passwordSignup = '';
			toast.success('✅ 登録成功！メールを確認してください。');
		}
	}

	async function handleLogin() {
		isLoggingIn = true;
		const result = await userMgr.loginWithEmail(emailLogin, passwordLogin);
		isLoggingIn = false;

		if (result) {
			emailLogin = '';
			passwordLogin = '';
			// toast.success('✅ ログイン成功！');
		} else {
			toast.error('❌ ログインに失敗しました。');
		}
	}

	async function handleSendResetEmail() {
		const email = userMgr.user?.email || emailLogin;

		if (!email) {
			toast.error('⚠️ メールアドレスを入力してください。');
			return;
		}

		isResetting = true;

		try {
			const response = await userMgr.sendPasswordResetEmail(email);
			// console.log('sendPasswordResetEmail response:', response); // Debug log

			// ✅ Ensure response is an object before destructuring
			if (!response || typeof response !== 'object') {
				toast.success('✅ パスワードリセットのリンクが送信されました！');
				return; // Exit to avoid destructuring error
			}

			const { error } = response;

			if (error) {
				console.error('Failed to send reset email:', error.message);
				toast.error('❌ パスワードリセットの送信に失敗しました。');
			} else {
				toast.success('✅ パスワードリセットのリンクが送信されました！');
			}
		} catch (err) {
			console.error('Unexpected error:', err);
			toast.error('❌ 予期しないエラーが発生しました。');
		} finally {
			isResetting = false;
		}
	}

	function closeModal() {
		isOpen = false;
	}

	function openModal() {
		isOpen = true;
	}

	async function sendPasswordResetEmail() {
		if (!userMgr.user?.email) return;

		const { data, error } = await supabase.auth.resetPasswordForEmail(userMgr.user.email);

		if (error) {
			console.error('Failed to send reset email:', error.message);
		} else {
			alert('パスワードリセットのリンクが送信されました。');
		}
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
				aria-label="ログアウト"
			>
				<span>ログアウト</span>
			</Button>
			{#if isEmailUser}
				<Button
					onclick={handleSendResetEmail}
					disabled={isResetting}
					variant="destructive"
					aria-label="パスワードの変更"
					class="min-w-20"
				>
					{#if isResetting}
						<Loader2 size={20} stroke-width={2} class="animate-spin" />
					{:else}
						パスワードの変更
					{/if}</Button
				>
			{/if}
			<Button variant="destructive" onclick={openModal} aria-label="アカウント削除"
				>アカウントを削除</Button
			>
		</div>
	</div>

	<Dialog.Root bind:open={isOpen}>
		<Dialog.Content>
			アカウントを削除するとブックマークの記録やコメントなどアカウントに関連するデータを含めてすべてのデータが削除され取り戻すことが不可能になります。
			それでも、アカウントの削除をしますか？
			<div class="flex justify-center gap-3">
				<Button onclick={closeModal} aria-label="キャンセル">キャンセル</Button>
				<Button
					variant="destructive"
					onclick={() => userMgr.deleteAccount()}
					aria-label="アカウント削除">アカウントを削除</Button
				>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Card.Root>
		<Card.Header class="mt-4 items-center justify-center">
			<Card.Title>🔓 Googleでサインインして、新機能を楽しもう！</Card.Title>
			<Card.Description
				>ログインすると、便利な機能がどんどん使えるようになります！✨</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col items-center justify-center gap-4 p-4">
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

				<!-- Tab -->

				<Tabs.Root value="login" class="mt-6 w-[400px]">
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="login">ログイン</Tabs.Trigger>
						<Tabs.Trigger value="signup">サインアップ</Tabs.Trigger>
					</Tabs.List>

					<!-- 📌 Google & Email Login -->
					<Tabs.Content value="login" class="rounded-md bg-secondary">
						<div class="flex flex-col items-center justify-center gap-4 p-4">
							{@render devider()}

							<form class="mx-auto flex max-w-md flex-col gap-4 p-4">
								<h2 class="text-xl font-bold">メールアドレスでログイン</h2>
								<Input
									type="email"
									bind:value={emailLogin}
									placeholder="yourname@example.com"
									class="max-w-xs"
									required
									autocomplete="username"
								/>

								{#if !isResettingPassword}
									<!-- Password Field (Hidden When Resetting) -->
									<div class="relative w-full max-w-xs">
										<Input
											type={showPasswordLogin ? 'text' : 'password'}
											bind:value={passwordLogin}
											placeholder="パスワード"
											class="w-full pr-10"
											required
											autocomplete="current-password"
										/>
										<button
											type="button"
											class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
											onclick={() => (showPasswordLogin = !showPasswordLogin)}
											aria-label="パスワードの表示"
										>
											{#if showPasswordLogin}
												<EyeOff size={20} stroke-width={1.5} />
											{:else}
												<Eye size={20} stroke-width={1.5} />
											{/if}
										</button>
									</div>

									<!-- 🔥 Forgot Password Button (Hides Password & Shows Reset) -->
									<button
										type="button"
										class="text-sm text-blue-500 hover:underline"
										onclick={() => (isResettingPassword = true)}
										aria-label="パスワードを忘れた場合"
									>
										パスワードを忘れましたか？
									</button>

									<Button onclick={handleLogin} disabled={isLoggingIn} aria-label="ログイン">
										{#if isLoggingIn}
											<Loader2 size={20} stroke-width={2} class="animate-spin" />
										{:else}
											ログイン
										{/if}
									</Button>
								{:else}
									<!-- 🔥 Password Reset Section -->
									<p class="text-gray text-sm">このメールアドレスにリセットリンクを送信します。</p>
									<Button
										onclick={handleSendResetEmail}
										disabled={isResetting}
										aria-label="リセットリンクを送信"
									>
										{#if isResetting}
											<Loader2 size={20} stroke-width={2} class="animate-spin" />
										{:else}
											リセットリンクを送信
										{/if}
									</Button>

									<button
										type="button"
										class="text-gray mt-2 text-sm hover:underline"
										onclick={() => (isResettingPassword = false)}
										aria-label="戻る"
									>
										戻る
									</button>
								{/if}
							</form>
						</div>
					</Tabs.Content>

					<!-- 📌 Google & Email Signup -->
					<Tabs.Content value="signup" class="rounded-md bg-secondary">
						<div class="flex flex-col items-center justify-center gap-4 p-4">
							{@render devider(true)}

							<form class="mx-auto flex max-w-md flex-col gap-4 p-4">
								<h2 class="text-xl font-bold">メールアドレスでサインアップ</h2>
								<Input
									type="email"
									bind:value={emailSignup}
									placeholder="yourname@example.com"
									class="max-w-xs"
									required
									autocomplete="username"
								/>
								<div class="relative w-full max-w-xs">
									<Input
										type={showPasswordSignup ? 'text' : 'password'}
										bind:value={passwordSignup}
										placeholder="パスワード"
										class="w-full pr-10"
										required
										autocomplete="new-password"
									/>
									<button
										type="button"
										class="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
										onclick={() => (showPasswordSignup = !showPasswordSignup)}
										aria-label="パスワードの表示"
									>
										{#if showPasswordSignup}
											<EyeOff size={20} stroke-width={1.5} />
										{:else}
											<Eye size={20} stroke-width={1.5} />
										{/if}
									</button>
								</div>
								<Button onclick={handleSignup} disabled={isSigningUp} aria-label="登録">
									{#if isSigningUp}
										<Loader2 size={20} stroke-width={2} class="animate-spin" />
									{:else}
										登録
									{/if}
								</Button>
							</form>
						</div>
					</Tabs.Content>
				</Tabs.Root>

				<!-- Tab -->
			</div></Card.Content
		>
	</Card.Root>
{/if}

{#snippet devider(isSignup)}
	<h2 class="text-xl font-bold">Googleで{isSignup ? 'サインアップ' : 'ログイン'}</h2>

	<GoogleSigninBtn class="w-full max-w-xs " />

	<div class="relative mt-4 flex w-full max-w-xs items-center">
		<hr class="w-full border-t border-gray-300" />
		<span class="text-gray absolute left-1/2 -translate-x-1/2 bg-secondary px-2 text-sm"
			>または</span
		>
	</div>
{/snippet}
