<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	// import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { mainCategoryInfo } from '$lib/store/articleData.svelte';
	import ArticleCard from '$lib/components/ui/article-card/article-card.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	let { data } = $props();
	let activeTab = $state('ALL');
	let sortByVal = $state('公開日順');
	let searchInputValue = $state('');

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
</script>

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

			<Button size="sm">
				<ListFilter />
			</Button>
		</div>
	</div>
</div>



<div class="columns-1 gap-2 md:columns-2 xl:columns-3 md:gap-4">
	{#each filterPostsByCategory() as post (post.id)}
		<div class="col-span-12 md:col-span-6 lg:col-span-4">
			<div class="mb-6 break-inside-avoid">
				<ArticleCard {post} />
			</div>
		</div>
	{/each}
</div>
