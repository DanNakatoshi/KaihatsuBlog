<script>
	import { Home, User, BookOpen, MessageCircle, LogIn  } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { onMount } from 'svelte';
	// import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';

	let { articleNavButtons } = $props();
	let nowReading = null;
	let nowReadingURL = '';
	// let isOnArticlesPage = $state(false);

	function handleClick(path) {
		goto(path);
	}

	function navigateToReading() {
		nowReading = userMgr.getNowReadingArticle();

		if (!nowReading) {
			toast.info('まだ読み始めた記事はありません');
			return;
		}

		nowReadingURL = nowReading.seriesId
			? `/articles/${nowReading.slug}?seriesId=${nowReading.seriesId}`
			: `/articles/${nowReading.slug}`;
		goto(nowReadingURL);
	}

	let messageIndex = 0; // Track current message index
	function handleMessage() {
		const messages = [
			'あさめしコードはアメリカから最新情報をお届けします',
			'GitHubでこのサイトのリポを公開しています',
			'YouTubeをフォローしてね',
			'新しいオープンソースプロジェクトを公開予定'
		];

		// ✅ Show message in order
		toast.info(messages[messageIndex]);

		// ✅ Move to the next message (loop back to 0 after the last message)
		messageIndex = (messageIndex + 1) % messages.length;
	}

	onMount(() => {
		// nowReading = userMgr.getNowReadingArticle();
	});
</script>


<div
	class="fixed bottom-0 left-1/2 flex w-full max-w-screen-sm -translate-x-1/2 items-center justify-around 
	border-t border-primary 
	rounded-t-md 
	bg-background p-2 shadow-lg 
	sm:mb-2 sm:rounded-md sm:border sm:border-primary"
>


	<!-- Home -->
	<Button
		variant="ghost"
		class="flex flex-col items-center gap-1 transition-all"
		onclick={() => handleClick('/')}
		aria-label="home"
	>
		<Home size="20" />
		<span class="text-xs">ホーム</span>
	</Button>

	<!-- Profile -->
	<Button
		variant="ghost"
		class="flex flex-col items-center gap-1 transition-all "
		onclick={() => handleClick('/account')}
		aria-label="my page"
	>
		{#if userMgr?.user}
			<User size="20" />
			<span class="text-xs">プロフィール</span>
		{:else}
			<LogIn size="20" />
			<span class="text-xs">ログイン</span>
		{/if}
	</Button>

	{#if !articleNavButtons}
		<Button
			variant="ghost"
			class="jello-horizontal flex flex-col items-center gap-1 transition-all"
			onclick={navigateToReading}
			aria-label="my page"
		>
			<BookOpen size="20" />
			<span class="text-xs">読みかけ</span>
		</Button>
		<Button
			variant="ghost"
			class="jello-horizontal flex flex-col items-center gap-1 transition-all"
			onclick={handleMessage}
			aria-label="my page"
		>
			<MessageCircle size="20" />
			<span class="text-xs">お知らせ</span>
		</Button>
	{/if}

	{#if articleNavButtons}
		{@render articleNavButtons()}
	{/if}
</div>
