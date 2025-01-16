<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';
	import ArticleCard from '$lib/components/ui/article-card/article-card.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
// FetchData

import { fetchMoreArticles } from '$lib/api/WPhandler.js';

	
	// Svelte
	import { onMount, onDestroy } from 'svelte';


	let { data } = $props();
	let activeTab = $state('ALL');
	let sortByVal = $state('公開日順');
	let searchInputValue = $state('');

	let displayedArticles = $state([...articleMgr.articleData]); // Reactive articles list
	let isLoading = $state(false); // Loading indicator
	let hasMore = $state(true); // Flag to check if more articles can be loaded

	function filterPostsByCategory() {
		let filteredPosts = [...articleMgr.articleData]; // Create a shallow copy to avoid mutation

		// Filter by activeTab (category)
		if (activeTab !== 'ALL') {
			const category = mainCategoryInfo.find((category) => category.name === activeTab);
			if (category) {
				filteredPosts = filteredPosts.filter((post) => post.categories?.includes(category.id));
			} else {
				return []; // No posts for the active tab
			}
		}

		// Filter by search input
		if (searchInputValue) {
			const searchTerm = searchInputValue.toLowerCase();
			filteredPosts = filteredPosts.filter((post) => {
				const title = post.title?.rendered?.toLowerCase() || '';
				const description = post.yoast_head_json?.description?.toLowerCase() || '';
				return title.includes(searchTerm) || description.includes(searchTerm);
			});
		}

		if (sortByVal === '公開日順') {
			filteredPosts = [...filteredPosts].sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateB.getTime() - dateA.getTime(); // Newest first
			});
		} else if (sortByVal === '更新日順') {
			filteredPosts = [...filteredPosts].sort((a, b) => {
				const dateA = new Date(a.modified);
				const dateB = new Date(b.modified);
				return dateB.getTime() - dateA.getTime(); // Most recently modified first
			});
		}
		return filteredPosts;
	}

	async function loadMoreArticles() {
	if (isLoading || !hasMore) return;
	isLoading = true;

	try {
		// Get the category ID for the active tab
		const categoryId = activeTab !== 'all'
			? mainCategoryInfo.find((cat) => cat.name === activeTab)?.id
			: null;

		// Fetch articles for the active category or all categories
		const newArticles = await fetchMoreArticles({ page: articleMgr.page, limit: 12, category: categoryId });

		if (newArticles.length > 0) {
			// Append new articles and remove duplicates
			const uniqueArticles = newArticles.filter(
				(article) => !articleMgr.articleData.some((existing) => existing.id === article.id)
			);
			articleMgr.addArticles(uniqueArticles); // Add only unique articles
			articleMgr.addPage(); // Increment page
			updateDisplayedArticles();
		} else {
			hasMore = false; // No more articles
		}
	} catch (error) {
		console.error('Error loading more articles:', error);
	} finally {
		isLoading = false;
	}
}




	function updateDisplayedArticles() {
		if (activeTab === 'all') {
			displayedArticles = [...articleMgr.articleData]; // Show all articles
		} else {
			displayedArticles = articleMgr.articleData.filter((article) => article.category_id == activeTab);
		}
	}

	// Intersection Observer setup for infinite scroll
	let loadMoreTrigger = $state(); // Element at the bottom of the page
	let observer = $state();

	onMount(() => {
		observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				loadMoreArticles();
			}
		});
		if (loadMoreTrigger) {
			observer.observe(loadMoreTrigger);
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
			<Tabs.Trigger value="ALL" class="min-w-16">ALL</Tabs.Trigger>
			<Tabs.Trigger value="開発ログ" class="min-w-16">開発ログ</Tabs.Trigger>
			<Tabs.Trigger value="エッセイ" class="min-w-16">エッセイ</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<div>
		<Input type="text" placeholder="検索" class="min-w-52" bind:value={searchInputValue} />

		<div class="my-2 flex justify-between">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" builders={[builder]}>{sortByVal}</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="">
					<DropdownMenu.RadioGroup bind:value={sortByVal}>
						<DropdownMenu.RadioItem value="公開日順">最新の公開日から表示</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="更新日順">最新の更新日から表示</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button size="sm" aria-label="Filter">
				<ListFilter />
			</Button>
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
<div class="w-full h-10 flex items-center justify-center" bind:this={loadMoreTrigger}>
	{#if isLoading}
		<span class="loading loading-dots loading-md text-slate-100"></span>
	{/if}
</div>