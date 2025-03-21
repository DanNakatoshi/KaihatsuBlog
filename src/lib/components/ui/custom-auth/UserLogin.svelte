<script>
	// UI
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { userMgr } from '$lib/store/userData.svelte.js';
	import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';

	// Icon
	import { Eye, EyeOff, Loader2 } from 'lucide-svelte';

	let isPasswordResetModalOpen = $state(false);

	// LOGGED IN USER
	// TODO: ADD PASSWORD UPDATE

	// GUEST
	// Email Signup
	let emailSignup = $state('');
	let confirmPasswordSignup = $state('');
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
		if (!emailSignup.includes('@')) {
			toast.error('⚠️ 有効なメールアドレスを入力してください。');
			return;
		}

		if (passwordSignup !== confirmPasswordSignup) {
			toast.error('❌ パスワードが一致しません。');
			return;
		}

		isSigningUp = true;
		const result = await userMgr.signUpWithEmail(emailSignup, passwordSignup);
		isSigningUp = false;

		if (result) {
			emailSignup = '';
			passwordSignup = '';
			confirmPasswordSignup = '';
			toast.success('✅ 登録成功！メールを確認してください。');
		}
	}

	async function handleLogin() {
		if (!emailLogin.includes('@')) {
			toast.error('⚠️ 有効なメールアドレスを入力してください。');
			return;
		}

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

		if (!email || !email.includes('@')) {
			toast.error('⚠️ 有効なメールアドレスを入力してください。');
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

<Tabs.Root value="login" class="mt-6 w-[400px]">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="login">ログイン</Tabs.Trigger>
		<Tabs.Trigger value="signup">サインアップ</Tabs.Trigger>
	</Tabs.List>

	<!-- 📌 Google & Email Login -->
	<Tabs.Content value="login" class=" ">
		<div class="flex flex-col items-center justify-center gap-4 p-4">
			{@render devider()}

			<form class="mx-auto flex min-h-64 max-w-md flex-col gap-4 p-4">
				<h2 class="text-xl font-bold">メールアドレスでログインする</h2>
				<Input
					type="email"
					bind:value={emailLogin}
					placeholder="yourname@example.com"
					class="max-w-xs"
					required
					autocomplete="username"
				/>

				{#if !isResettingPassword}
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

					<Button
						onclick={handleLogin}
						disabled={isLoggingIn || !emailLogin || !passwordLogin}
						aria-label="ログイン"
					>
						{#if isLoggingIn}
							<Loader2 size={20} stroke-width={2} class="animate-spin" />
						{:else}
							ログイン
						{/if}
					</Button>

					<button
						type="button"
						class="text-xs text-blue-500 hover:underline"
						onclick={() => (isResettingPassword = true)}
						aria-label="パスワードを忘れた場合"
					>
						パスワードを忘れましたか？
					</button>
				{:else}
					<p class="text-gray text-sm">このメールアドレスにリセットリンクを送信します。</p>
					<Button
						onclick={handleSendResetEmail}
						disabled={isResetting || !emailLogin}
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
	<Tabs.Content value="signup" class="">
		<div class="flex flex-col items-center justify-center gap-4 p-4">
			{@render devider(true)}

			<form class="mx-auto flex min-h-64 max-w-md flex-col gap-4 p-4">
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

				<!-- ✅ Confirm Password Field -->
				<Input
					type="password"
					bind:value={confirmPasswordSignup}
					placeholder="パスワード（確認用）"
					class="w-full"
					required
					autocomplete="new-password"
				/>

				<Button
					class=""
					onclick={handleSignup}
					disabled={isSigningUp || !emailSignup || !passwordSignup || !confirmPasswordSignup}
					aria-label="登録"
				>
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

{#snippet devider(isSignup)}
	<h2 class="text-xl font-bold">Googleで{isSignup ? 'サインアップ' : 'ログイン'}</h2>

	<GoogleSigninBtn class="w-full max-w-xs " />

	<div class="relative mt-4 flex w-full max-w-xs items-center gap-2">
		<hr class="flex-grow border-t border-[color:var(--muted-foreground)]" />
		<span class="text-sm text-[color:var(--muted-foreground)]">または</span>
		<hr class="flex-grow border-t border-[color:var(--muted-foreground)]" />
	</div>
{/snippet}
