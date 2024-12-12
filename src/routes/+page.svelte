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

	let { data } = $props();

	const { mainCats, childCats, grandchildCats, childCatNames, groupedChildCats } =
		categorizeCategories(data.categories);

	let articles = data.posts;
	let tags = data.tags;
	let sortByVal = $state('最新順');
	let selectedChildCatNames = $state(['エッセイ', '開発書']);
	const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));
	function getTagNames(tagIds) {
		return tagIds.map((tagId) => tagMap.get(tagId) || 'Unknown');
	}

	// Subcategories related
	const subCategoryMap = new Map(childCats.map((cat) => [cat.id, cat.name]));
	console.log(subCategoryMap);
	function getSubCategoryNames(categoryIds) {
		return categoryIds.map((catId) => subCategoryMap.get(catId) || 'Unknown');
	}

	function handleReadButton(slug) {
		goto(`articles/${slug}`);
	}

	function filterArticlesByCategory(articles, selectedChildCatNames) {
		return articles.filter((article) => {
			// For each article, check if any of its category names match the selected categories
			return article.categories.some((categoryId) => {
				// Find the category object corresponding to the current categoryId
				const category = childCats.find((cat) => cat.id === categoryId);
				// Check if the category name is selected
				return category && selectedChildCatNames.includes(category.name);
			});
		});
	}
</script>

<div>
	<div id="searchbox" class="flex flex-col items-center">
		<div>
			{#each mainCats as mainCat (mainCat.id)}
				<div class="flex items-center">
					<div class="mr-2 flex min-w-28 justify-end font-bold text-xs ">{mainCat.name} :</div>
					<ToggleGroup.Root
						size="sm"
						type="multiple"
						bind:value={selectedChildCatNames}
						class="my-2 gap-2"
					>
						{#each groupedChildCats[mainCat.id] ?? [] as cat (cat.id)}
							<ToggleGroup.Item value={cat.name} class="rounded-full text-xs font-bold">{cat.name}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>
			{/each}

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
	</div>

	<div class="grid gap-2">
		{#each filterArticlesByCategory(articles, selectedChildCatNames) as article (article.id)}
			<Card.Root>
				<Card.Header>
					<Card.Title>{article.title.rendered}</Card.Title>

					<div class="flex gap-1">
						<div class="mb-1">
							更新日：{new Date(article.modified).toLocaleDateString()}
						</div>
					</div>
					<div class="flex flex-wrap gap-1">
						{#each getTagNames(article.tags) as tagName}
							<Badge class="bg-blue-300">{tagName}</Badge>
						{/each}

						{#each Object.entries(groupedChildCats) as [mainCatId, childCategories]}
							{#if childCategories.some((cat) => article.categories.includes(cat.id))}
								<!-- <div class="font-bold">{mainCats.find((cat) => cat.id === mainCatId)?.name}</div> -->
								<div class="flex flex-wrap gap-2">
									{#each childCategories as childCat}
										{#if article.categories.includes(childCat.id)}
											<Badge
												class={!selectedChildCatNames.includes(childCat.name) ? 'opacity-60' : ''}
												>{childCat.name}</Badge
											>
										{/if}
									{/each}
								</div>
							{/if}
						{/each}
					</div>
				</Card.Header>
				<Card.Content>
					{article.yoast_head_json.description}
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button class="" onclick={() => handleReadButton(article.slug)}>読む</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
