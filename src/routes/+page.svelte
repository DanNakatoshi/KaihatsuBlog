<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { categorizeCategories } from '$lib/store/articleData.svelte.js';
	import { goto } from '$app/navigation';
	import CategoryFilter from '$lib/components/ui/category/category-filter.svelte';
	// import {filterMgr} from '$lib/store/articleData.svelte'

	let { data } = $props();

	const { langCats, seriesCats } = categorizeCategories(data.categories);

	let posts = data.posts;
	let activeTab = $state('ALL');
	let tags = data.tags;
	let sortByVal = $state('最新順');
	const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));

	function getTagNames(tagIds) {
		return tagIds.map((tagId) => tagMap.get(tagId) || 'Unknown');
	}

	function handleReadButton(slug) {
		goto(`articles/${slug}`);
	}

	function filterPostsByCategory() {
		if (activeTab === 'ALL') {
			return posts; // Return all posts
		} else if (activeTab === '開発ログ') {
			return posts.filter((post) => post.categories.includes(22));
		} else if (activeTab === 'エッセイ') {
			return posts.filter((post) => post.categories.includes(21));
		}
		return [];
	}
</script>

<div id="searchbox" class="flex flex-col items-center gap-2">
		<Tabs.Root bind:value={activeTab} class="">
			<Tabs.List>
				<Tabs.Trigger value="ALL" class="min-w-16">ALL</Tabs.Trigger>
				<Tabs.Trigger value="開発ログ" class="min-w-16">開発ログ</Tabs.Trigger>
				<Tabs.Trigger value="エッセイ" class="min-w-16">エッセイ</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>

			<div>
				<Input type="text" placeholder="検索" class="max-w-md" />

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

			<CategoryFilter filterName="言語ごと" filterOptions={langCats} />
			<CategoryFilter filterName="シリーズ" filterOptions={seriesCats} />

</div>

<div class="grid gap-2">
	{#each filterPostsByCategory() as post (post.id)}
		{@render postSnippet(post)}
	{/each}
</div>

<!-- BLOG CARD -->
{#snippet postSnippet(post)}
	<Card.Root>
		<Card.Header>
			<Card.Title>{post.title.rendered}</Card.Title>
		</Card.Header>
		<Card.Content>
			{post.yoast_head_json.description}
		</Card.Content>
		<Card.Footer class="flex justify-end">
			<Button class="" onclick={() => handleReadButton(post.slug)}>読む</Button>
		</Card.Footer>
	</Card.Root>
{/snippet}
