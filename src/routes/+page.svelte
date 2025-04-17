<script>
	// Chadcn
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';

	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { userMgr } from '$lib/store/userData.svelte.js';

	import { ListFilter } from 'lucide-svelte';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';

	// FetchData
	import { fetchWordPressData } from '$lib/api/WPhandler.js';

	// Svelte
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	// Components
	import ArticleCard from '$lib/components/ui/custom-article-card/article-card.svelte';
	import LoadingIcon from '$lib/components/ui/custom-spin-icon/LoadingIcon.svelte';
	import Masonry from '$lib/helper/Masonry.svelte';
	// import BookmarkCounter from '$lib/components/ui/custom-bookmark-counter/BookmarkCounter.svelte';

	let { data } = $props();
	let masonryGrid = $state();

	let activeTab = $state('ALL');
	let sortByVal = $state('公開日順');
	let searchInputValue = $state('');
	let filterBookmarks = $state(false);

	let displayedArticles = $state([...articleMgr.articleData]);
	let isLoading = $state(false);
	let hasMore = $state(true);
	let isDebounced = false;

	// Infinite Scroll Setup
	let loadMoreTrigger = $state();
	let observer = null; // ✅ Declare observer globally

	function handleTabChange(newTab) {
		activeTab = newTab; // Update the active tab
		hasMore = true;
		isLoading = false;
		// displayedArticles = filterPostsByCategory();
	}

	function filterPostsByCategory() {
		return [...articleMgr.articleData]
			.filter((post) => {
				const categoryId = mainCategoryInfo.find((cat) => cat.name === activeTab)?.id;
				return activeTab === 'ALL' || post.categories?.includes(categoryId);
			})
			.filter((post) => {
				if (!searchInputValue) return true;
				const searchTerm = searchInputValue.toLowerCase();
				return (
					post.title?.rendered?.toLowerCase().includes(searchTerm) ||
					post.yoast_head_json?.description?.toLowerCase().includes(searchTerm)
				);
			})
			.filter((post) => {
				if (filterBookmarks) {
					return userMgr?.bookmarks?.includes(post.id);
				}
				return true;
			})
			.sort((a, b) => {
				if (sortByVal === '人気順') {
					return (b.view_count || 0) - (a.view_count || 0); // Sort by view_count (descending)
				} else {
					const key = sortByVal === '公開日順' ? 'date' : 'modified';
					return new Date(b[key]).getTime() - new Date(a[key]).getTime();
				}
			});
	}

	async function loadMoreArticles() {
		if (isLoading || !hasMore || isDebounced) return;

		console.log(`Loading more articles... Page: ${articleMgr.page}`);
		isLoading = true;
		isDebounced = true;

		setTimeout(() => {
			isDebounced = false;
		}, 1000);

		try {
			const categoryId =
				activeTab !== 'ALL' ? mainCategoryInfo.find((cat) => cat.name === activeTab)?.id : null;

			const newArticles = await fetchWordPressData({
				type: 'posts',
				page: articleMgr.page + 1,
				limit: 12,
				category: categoryId
			});

			if (newArticles.length > 0) {
				const uniqueArticles = newArticles.filter(
					(article) =>
						article.id && !articleMgr.articleData.some((existing) => existing.id === article.id)
				);

				if (uniqueArticles.length > 0) {
					articleMgr.setArticleData([...articleMgr.articleData, ...uniqueArticles]);
					displayedArticles = [...displayedArticles, ...uniqueArticles];

					articleMgr.setPage(articleMgr.page + 1);
				}
			} else {
				hasMore = false; // No more articles to load
			}
		} catch (error) {
			console.error('Error loading more articles:', error);
		} finally {
			isLoading = false;
		}
	}

	function setupInfiniteScroll() {
		if (observer) observer.disconnect(); // ✅ Prevent multiple observers
		if (!loadMoreTrigger) return; // ✅ Prevent re-creating observer

		observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				loadMoreArticles();
			}
		});

		observer.observe(loadMoreTrigger);
	}

	onMount(() => {
		// displayedArticles = filterPostsByCategory();
		setupInfiniteScroll();
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	});

	$effect(() => {
		const filtered = filterPostsByCategory();
		if (JSON.stringify(filtered) !== JSON.stringify(displayedArticles)) {
			displayedArticles = filtered;
		}
	});
</script>

<svelte:head>
	<title>Home - Asameshicode | 開発ログ & エッセイ</title>
	<meta
		name="description"
		content="Explore the latest 開発ログ and エッセイ posts on Asameshicode. Stay updated with our latest insights and articles!"
	/>
	<meta name="keywords" content="Asameshicode, 開発ログ, エッセイ, tech blog, articles" />
	<link rel="canonical" href="https://asameshicode.com/" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Home - Asameshicode | 開発ログ & エッセイ" />
	<meta
		property="og:description"
		content="Explore the latest 開発ログ and エッセイ posts on Asameshicode. Stay updated with our latest insights and articles!"
	/>
	<meta property="og:url" content="https://asameshicode.com/" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://asameshicode.com/og-image.png" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Home - Asameshicode | 開発ログ & エッセイ" />
	<meta
		name="twitter:description"
		content="Explore the latest 開発ログ and エッセイ posts on Asameshicode. Stay updated with our latest insights and articles!"
	/>
	<meta name="twitter:image" content="https://asameshicode.com/og-image.png" />
</svelte:head>

<div class="flex items-center justify-center px-4">
	<h2
		class="flex flex-wrap justify-center py-10 text-center text-2xl font-bold leading-tight md:text-4xl"
	>
		<div>
			<span class="whitespace-nowrap text-cyan-500 dark:text-cyan-300">アメリカ</span><span
				class="text-gray-dark text-lg md:text-2xl">から</span
			>
		</div>
		<br class="block sm:hidden" />
		<div>
			<span class="whitespace-nowrap text-pink-500 dark:text-pink-400">ウェブ開発情報</span><span
				class="text-gray-dark text-lg md:text-2xl">をお届け</span
			>
		</div>
	</h2>
</div>

<div id="searchbox" class="flex flex-col items-center gap-2">
	<Tabs.Root bind:value={activeTab} class="">
		<Tabs.List class="">
			<Tabs.Trigger onclick={() => handleTabChange('ALL')} value="ALL" class="min-w-16"
				>ALL</Tabs.Trigger
			>
			<Tabs.Trigger onclick={() => handleTabChange('開発ログ')} value="開発ログ" class="min-w-16"
				>開発ログ</Tabs.Trigger
			>
			<Tabs.Trigger onclick={() => handleTabChange('エッセイ')} value="エッセイ" class="min-w-16"
				>エッセイ</Tabs.Trigger
			>
		</Tabs.List>
	</Tabs.Root>

	<div>
		<Input
			type="text"
			placeholder="キーワード検索"
			class="min-w-52"
			bind:value={searchInputValue}
		/>

		<div class="my-2 flex justify-between">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline">{sortByVal}</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="">
					<DropdownMenu.RadioGroup bind:value={sortByVal}>
						<DropdownMenu.RadioItem value="公開日順">最新の公開日</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="更新日順">最新の更新日</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="人気順">人気の記事</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<!-- <Button size="sm" variant="outline" aria-label="Filter">
				<ListFilter />
			</Button> -->
		</div>
		<div class="mb-2 flex items-center space-x-2">
			<Switch id="bookmark" bind:checked={filterBookmarks} disabled={!userMgr?.user} />
			<Label for="bookmark">ブックマークした記事だけ</Label>
		</div>
	</div>
</div>

<Masonry
	key={displayedArticles.length}
	items={displayedArticles}
	gridGap={'0.2rem'}
	stretchFirst={false}
	colWidth={'minmax(22rem, 1fr)'}
	reset
>
	{#each displayedArticles as post (post.id)}
		<div class="p-2">
			<ArticleCard {post} />
		</div>
	{/each}
</Masonry>

<!-- Infinite Scroll Trigger -->
<div class="flex h-10 w-full items-center justify-center" bind:this={loadMoreTrigger}>
	{#if isLoading}
		<LoadingIcon />
	{/if}
</div>

<style>
</style>
