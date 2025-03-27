<script>
	// Svelte
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/api/supabaseClient';
	// UI
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { toast } from 'svelte-sonner';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	import { userMgr } from '$lib/store/userData.svelte.js';
	import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';
	// Components
	import StatusCards from '$lib/components/ui/custom-user-status/StatusCards.svelte';
	import UserLogin from '$lib/components/ui/custom-auth/UserLogin.svelte';
	// Icon
	import { Eye, EyeOff, Loader2, SquareArrowOutUpRight } from 'lucide-svelte';

	let isAccoutModalOpen = $state(false);
	let isPasswordResetModalOpen = $state(false);

	// LOGGED IN USER
	// let isEmailUser = $state(false);
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

	// Account Delete
	let confirmAnonymousComments = $state(false);
	let confirmDataDeletion = $state(false);

	// Comments
	let userComments = $state([]);

	let isAccountDeleteConfirmed = $derived(confirmAnonymousComments && confirmDataDeletion);
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

	// Commnet
	async function fetchUserComments() {
		if (!userMgr?.user?.id) return;

		const { data, error } = await supabase
			.from('view_comment_thread')
			.select('*')
			.eq('is_owner', true)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('❌ Error fetching user comments:', error.message);
			return;
		}

		userComments = data;
	}

	onMount(() => {
		fetchUserComments();
	});
</script>

{#if userMgr?.user}
	<div>
		<StatusCards />

		<!-- COMMENT SECTION -->

		{#if userComments.length > 0}
			<div class="mt-6 space-y-4">
				<h2 class="text-lg font-semibold">自分のコメント一覧</h2>
				{#each userComments as comment (comment.id)}
					<Card.Root>
						<Card.Content class="flex flex-col gap-1">
							<div class="break-words text-sm text-foreground">{comment.content}</div>
							<div class="flex items-center justify-between text-xs text-muted-foreground">
								<span>{new Date(comment.created_at).toLocaleString()}</span>
								<button
									onclick={() => goto(`/articles/${comment.article_id}`)}
									class="flex items-center gap-1 hover:underline"
								>
									<span>記事を見る</span>
									<SquareArrowOutUpRight size={16} />
								</button>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{:else}
			<p class="mt-4 text-sm text-gray-500">まだコメントがありません。</p>
		{/if}

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
			<div class="my-4 flex items-start space-x-2">
				<Checkbox id="confirm-anonymous" bind:checked={confirmAnonymousComments} />
				<Label
					for="confirm-anonymous"
					class="text-sm font-medium leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					コメントはアカウントを削除しても匿名で残ることを理解し、不要なコメントは削除しました。
				</Label>
			</div>

			<div class="my-4 flex items-start space-x-2">
				<Checkbox id="confirm-deletion" bind:checked={confirmDataDeletion} />
				<Label
					for="confirm-deletion"
					class="text-sm font-medium leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					アカウントを削除するとブックマークの記録やアカウントに関連するデータを含めてすべてのデータが削除され復元できないことを理解しました。
				</Label>
			</div>
			<div class="flex justify-center gap-3">
				<Button onclick={closeAccountModal} aria-label="キャンセル">キャンセル</Button>
				<Button
					variant="destructive"
					onclick={() => userMgr.deleteAccount()}
					aria-label="アカウント削除"
					disabled={!isAccountDeleteConfirmed}
				>
					アカウントを削除
				</Button>
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
	<div class="mt-4 flex justify-center">
		<div class="rounded-md bg-background px-8 py-3">
			<UserLogin />
		</div>
	</div>
{/if}
