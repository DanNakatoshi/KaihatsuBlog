<script>
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { loginModalManager } from '$lib/store/pageControl.svelte.js';
	// Chadcn
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { toast } from 'svelte-sonner';

	// supabase
	import { supabase } from '$lib/api/supabaseClient';

	let position = $state('bottom');
	let isShowForm = $state(false);

	let formName = $state('');
	let formEmail = $state('');
	let formTitle = $state('');
	let formMessage = $state('');
	let formCategory = $state('');
	let isReplyNeeded = $state(false);

	const categoryDisplay = $derived(formCategory || 'カテゴリを選ぶ');

	$effect(() => {
		if (userMgr.user) {
			formName = userMgr?.userProfile?.display_name ?? '';
			formEmail = userMgr?.user?.email ?? '';
		}
	});

	async function handleSubmit() {
		if (!formName || !formEmail || !formMessage) {
			toast.error('⚠️ お名前、メール、内容をすべて入力してください。');
			return;
		}
		const isValidEmail = formEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
		if (!isValidEmail) {
			toast.error('⚠️ 有効なメールアドレスを入力してください。');
			return;
		}

		if (!formCategory) {
			toast.error('⚠️ カテゴリを選択してください。');
			return;
		}

		const { error } = await supabase.from('contact_messages').insert({
			name: formName,
			email: formEmail,
			category: formCategory,
			title: formTitle,
			message: formMessage,
			wants_reply: isReplyNeeded,
			user_id: userMgr.user?.id ?? null // optional FK if logged in
		});

		if (error) {
			console.error('Supabase insert error:', error);
			toast.error('❌ お問い合わせの送信に失敗しました。');
			return;
		}

		// Simulate sending...
		toast.success('✅ お問い合わせを送信しました！ありがとうございます');

		// Reset
		formName = '';
		formEmail = '';
		formTitle = '';
		formMessage = '';
		formCategory = '';
		isReplyNeeded = false;
	}
</script>

{#if !userMgr.user}
	<div class="flex flex-col items-center">
		<p>ログインして連絡した内容をサイトで簡単にトラッキングしよう。</p>
		<div>
			<Button onclick={() => loginModalManager.open()} class="">ログイン</Button>
			<Button variant="outline" onclick={() => (isShowForm = true)}>ゲストのまま連絡する</Button>
		</div>
		<p class="mt-4 text-sm text-gray-500">
			もしくはSNS経由でもご連絡いただけます：
			<a href="https://twitter.com/asameshicode" class="link">x.com/asameshicode</a>
		</p>
	</div>
{/if}

{#if isShowForm || userMgr.user}
	<div class="mx-auto mt-8 max-w-lg space-y-4">
		<h2 class="text-lg font-semibold">お問い合わせフォーム</h2>

		<div class="flex w-full max-w-lg flex-col gap-1.5">
			<Label for="name" class="text-sm font-medium leading-none">お名前</Label>
			<Input
				type="text"
				id="name"
				placeholder="Dan Asameshi"
				class="w-full"
				bind:value={formName}
			/>
		</div>

		<div class="flex w-full max-w-lg flex-col gap-1.5">
			<Label for="email" class="text-sm font-medium leading-none">メールアドレス</Label>
			<Input
				id="email"
				type="email"
				placeholder="asameshi@example.com"
				class="w-full"
				bind:value={formEmail}
			/>
		</div>

		<div class="flex w-full max-w-lg flex-col items-start gap-1.5">
			<Label for="category" class="text-sm font-medium leading-none">お問い合わせのカテゴリ</Label>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline">{categoryDisplay}</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.RadioGroup bind:value={formCategory}>
						<DropdownMenu.RadioItem value="バグ報告">バグ報告</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="記事のリクエスト"
							>記事のリクエスト</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem value="改善フィードバック"
							>改善フィードバック</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem value="コラボ・お仕事のご相談"
							>コラボ・お仕事のご相談</DropdownMenu.RadioItem
						>
						<DropdownMenu.RadioItem value="その他">その他</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="flex w-full max-w-lg flex-col gap-1.5">
			<Label for="title" class="text-sm font-medium leading-none">タイトル</Label>
			<Input
				id="title"
				type="text"
				placeholder="例：ウェブアプリ作成の依頼"
				class="w-full"
				bind:value={formTitle}
			/>
		</div>

		<div class="flex w-full max-w-lg flex-col gap-1.5">
			<Label for="details" class="text-sm font-medium leading-none">お問い合わせ内容</Label>
			<Textarea
				id="details"
				placeholder="詳細を記載してください。"
				class="w-full"
				bind:value={formMessage}
			/>
		</div>
		<div class="flex items-center space-x-2">
			<Checkbox id="isreply" bind:checked={isReplyNeeded} />
			<Label for="isreply" class="text-sm font-medium leading-none">
				メールでの返信を希望する場合はチェックをしてください。
			</Label>
		</div>
		<Button onclick={handleSubmit} disabled={!formName || !formEmail || !formMessage}>
			送信する
		</Button>
	</div>
{/if}
