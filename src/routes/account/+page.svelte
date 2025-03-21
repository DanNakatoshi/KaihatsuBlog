<script>
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
	import UserLogin from '$lib/components/ui/custom-auth/UserLogin.svelte';
	// Icon
	import { Eye, EyeOff, Loader2 } from 'lucide-svelte';

	let isAccoutModalOpen = $state(false);
	let isPasswordResetModalOpen = $state(false);

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

	function closeAccountModal() {
		isAccoutModalOpen = false;
	}

	function openAccountModal() {
		isAccoutModalOpen = true;
	}

	function closePasswordResetModal() {
		isPasswordResetModalOpen = false;
	}

	function openPasswordResetModal() {
		isPasswordResetModalOpen = true;
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
					onclick={openPasswordResetModal}
					disabled={isResetting}
					variant="destructive"
					aria-label="パスワードの変更"
					class="min-w-20">パスワードの変更</Button
				>
			{/if}
			<Button variant="destructive" onclick={openAccountModal} aria-label="アカウント削除"
				>アカウントを削除</Button
			>
		</div>
	</div>

	<Dialog.Root bind:open={isAccoutModalOpen}>
		<Dialog.Content>
			アカウントを削除するとブックマークの記録やコメントなどアカウントに関連するデータを含めてすべてのデータが削除され取り戻すことが不可能になります。
			それでも、アカウントの削除をしますか？
			<div class="flex justify-center gap-3">
				<Button onclick={closeAccountModal} aria-label="キャンセル">キャンセル</Button>
				<Button
					variant="destructive"
					onclick={() => userMgr.deleteAccount()}
					aria-label="アカウント削除">アカウントを削除</Button
				>
			</div>
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={isPasswordResetModalOpen}>
		<Dialog.Content>
			パスワードリセットのリンクが {userMgr?.user?.email} に送信されます。しばらくしても届かない場合はスパムフォルダを確認してください。
			<div class="flex justify-center gap-3">
				<Button onclick={closePasswordResetModal} aria-label="キャンセル">キャンセル</Button>
				<Button
					variant="destructive"
					onclick={handleSendResetEmail}
					aria-label="パスワードをリセットする"
					disabled={isResetting}
					class="min-w-24"
				>
					{#if isResetting}
						<Loader2 size={20} stroke-width={2} class="animate-spin" />
					{:else}
						パスワードをリセットする
					{/if}
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<div class="flex justify-center mt-4 ">
		<UserLogin/>
	</div>
{/if}

