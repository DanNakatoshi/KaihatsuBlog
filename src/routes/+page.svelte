<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	// import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { categorizeCategories } from '$lib/store/articleData.svelte.js';
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/category/category-filter.svelte';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';
	import ArticleCard from '$lib/components/ui/article-card/article-card.svelte';
	let { data } = $props();

	const { langCats, seriesCats } = categorizeCategories(data.categories);

	let posts = data.posts;
	let activeTab = $state('ALL');
	let tags = data.tags;
	let sortByVal = $state('最新順');
	let searchInputValue = $state('');

	const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));

	function getTagNames(tagIds) {
		return tagIds.map((tagId) => tagMap.get(tagId) || 'Unknown');
	}

	function filterPostsByCategory() {
		let filteredPosts = posts;

		// Filter by activeTab (category)
		if (activeTab !== 'ALL') {
			const category = mainCategoryInfo.find((category) => category.name === activeTab);
			if (category) {
				filteredPosts = filteredPosts.filter((post) => post.categories.includes(category.id));
			} else {
				return []; // No posts for the active tab
			}
		}

		if (searchInputValue) {
			const searchTerm = searchInputValue.toLowerCase();
			filteredPosts = filteredPosts.filter((post) => {
				const title = post.title?.rendered?.toLowerCase() || '';
				const description = post.yoast_head_json?.description?.toLowerCase() || '';
				return title.includes(searchTerm) || description.includes(searchTerm);
			});
		}

		return filteredPosts;
	}
</script>

<div id="searchbox" class="flex flex-col items-center gap-2">
	<Tabs.Root bind:value={activeTab} class="">
		<Tabs.List>
			<Tabs.Trigger value="ALL" class="min-w-16">ALL</Tabs.Trigger>
			<Tabs.Trigger value="開発ログ" class="min-w-16">開発ログ</Tabs.Trigger>
			<Tabs.Trigger value="エッセイ" class="min-w-16">エッセイ</Tabs.Trigger>
		</Tabs.List>

		<!-- <Tabs.Content value="開発ログ">
			<CategoryFilter filterName="言語ごと" filterOptions={langCats} />
			<CategoryFilter filterName="シリーズ" filterOptions={seriesCats} />
		</Tabs.Content> -->
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
						<DropdownMenu.RadioItem value="最新順">最新順</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem value="人気順">人気順</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button size="sm">
				<ListFilter />
			</Button>
		</div>
	</div>
</div>

<div class="grid grid-cols-12 gap-4">
	{#each filterPostsByCategory() as post (post.id)}
		<!-- {getTagNames(post.tags)} -->
		<!-- {(post.tags)} -->
		<!-- {JSON.stringify(post)} -->
		<div class="col-span-12 sm:col-span-6 lg:col-span-4">
			<div class="break-inside-avoid">
				<ArticleCard {post} tags={getTagNames(post.tags)}/>
			</div>
		</div>
	{/each}
</div>

<!-- <div class="columns-1 md:columns-2 lg:columns-3 gap-6">
	{#each filterPostsByCategory() as post (post.id)}
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<div class="break-inside-avoid mb-6 ">
				<ArticleCard {post} />
			</div>
		</div>
	{/each}
</div> -->
