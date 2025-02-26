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

	// Components
	import ArticleCard from '$lib/components/ui/custom-article-card/article-card.svelte';
	import LoadingIcon from '$lib/components/ui/custom-spin-icon/LoadingIcon.svelte';

	// import BookmarkCounter from '$lib/components/ui/custom-bookmark-counter/BookmarkCounter.svelte';

	let { data } = $props();
	let activeTab = $state('ALL');
	let sortByVal = $state('公開日順');
	let searchInputValue = $state('');
	let filterBookmarks = $state(false);

	let displayedArticles = $state([...articleMgr.articleData]); // Reactive articles list
	let isLoading = $state(false); // Loading indicator
	let hasMore = $state(true); // Flag to check if more articles can be loaded
	let isDebounced = false;

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
				// If filter toggle is on, only include posts that are bookmarked.
				if (filterBookmarks) {
					return userMgr?.bookmarks?.includes(post.id);
				}
				return true;
			})
			.sort((a, b) => {
				const key = sortByVal === '公開日順' ? 'date' : 'modified';
				return new Date(b[key]).getTime() - new Date(a[key]).getTime();
			});
	}

	async function loadMoreArticles() {
		if (isLoading || !hasMore || isDebounced) return;

		console.log('Loading more...');
		isLoading = true;
		isDebounced = true; // Prevent immediate subsequent calls
		setTimeout(() => {
			isDebounced = false;
		}, 3000); // 3-second delay

		try {
			const categoryId =
				activeTab !== 'ALL' ? mainCategoryInfo.find((cat) => cat.name === activeTab)?.id : null;

			const newArticles = await fetchWordPressData({
				type: 'posts',
				page: articleMgr.page,
				limit: 12,
				category: categoryId
			});

			if (newArticles.length > 0) {
				const uniqueArticles = newArticles.filter(
					(article) => !articleMgr.articleData.some((existing) => existing.id === article.id)
				);

				articleMgr.setArticleData([...articleMgr.articleData, ...uniqueArticles]);
				displayedArticles = filterPostsByCategory();
			} else {
				hasMore = false; // No more articles to load
			}
		} catch (error) {
			console.error('Error loading more articles:', error);
		} finally {
			isLoading = false; // Reset loading state
		}
	}

	// Infinite Scroll Setup
	let loadMoreTrigger = $state();
	let observer = $state();

	onMount(() => {
		// console.log('Observer mounted');
		observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				// console.log('Load more trigger intersecting');
				loadMoreArticles();
			}
		});
		if (loadMoreTrigger) {
			// console.log('Observing loadMoreTrigger element:', loadMoreTrigger);
			observer?.observe(loadMoreTrigger);
		}
	});

	onDestroy(() => observer?.disconnect());
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
						<DropdownMenu.RadioItem value="公開日順">最新の公開日から表示</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="更新日順">最新の更新日から表示</DropdownMenu.RadioItem>
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

<div class="columns-1 gap-2 md:columns-2 md:gap-4 xl:columns-3">
	{#each filterPostsByCategory() as post (post.id)}
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<div class="mb-6 break-inside-avoid">
				<ArticleCard {post} />
			</div>
		</div>
	{/each}
</div>

<!-- Infinite Scroll Trigger -->
<div class="flex h-10 w-full items-center justify-center" bind:this={loadMoreTrigger}>
	{#if isLoading}
		<LoadingIcon />
	{/if}
</div>
