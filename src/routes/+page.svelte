<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
    import { Badge } from "$lib/components/ui/badge/index.js";
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { categorizeCategories } from '$lib/store/articleData.svelte.js';
	import { goto } from '$app/navigation';
	// import { effect } from 'zod';
	// import * as Popover from '$lib/components/ui/popover/index.js';
	// import * as Command from '$lib/components/ui/command/index.js';
	// import * as Form from '$lib/components/ui/form';
	// import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	// import Check from 'lucide-svelte/icons/check';
	// import { cn } from '$lib/utils.js';

	let { data } = $props();

	const { mainCat, childCat, grandChildCat, childCatIds } = categorizeCategories(data.categories);

	// console.log(childCat);

	let articles = data.posts;
	let tags = data.tags;
	// console.log(tags);
	let sortByVal = $state('最新順');
	// let selectedMainCat = $state('記事');
	let selectedMainCatId = $state('20');
	let selectedChildCatId = $state(childCatIds);

	// Tags related
	const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));

	// console.log(tagMap)
	function getTagNames(tagIds) {
		return tagIds.map((tagId) => tagMap.get(tagId) || 'Unknown');
	}

	// End Tags

	function handleReadButton(slug) {
		goto(`articles/${slug}`);
	}
</script>

<!-- <Button>Click me</Button> -->

<div class="flex w-full flex-col items-center">
	<Tabs.Root bind:value={selectedMainCatId} class="w-[400px] p-1">
		<div class="flex justify-center">
			<Tabs.List>
				{#each mainCat as cat (cat.id)}
					<Tabs.Trigger value={cat.id}>{cat.name}</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</div>
		<ToggleGroup.Root size="sm" type="multiple" bind:value={selectedChildCatId} class="my-2 gap-2">
			{#each childCat as cat (cat.id)}
				{#if cat.parent == selectedMainCatId}
					<ToggleGroup.Item value={cat.id}>{cat.name}</ToggleGroup.Item>
				{/if}
			{/each}
		</ToggleGroup.Root>

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

		<Tabs.Content value="9">
			<div class="grid gap-2">
				{#each articles as article (article.id)}
					<Card.Root>
						<Card.Header>
							<Card.Title>{article.title.rendered}</Card.Title>
							<Card.Description class="py-1"
								>
                                <div class="mb-1">
                                更新日：{new Date(article.modified).toLocaleDateString()}
                                </div>
                                <div class="flex gap-1">
                                    {#each getTagNames(article.tags) as tagName}
                                    <Badge>{tagName}</Badge>
                                    {/each}
                                </div>
							</Card.Description>

							<!-- <Card.Description class="py-1">{JSON.stringify(article)}</Card.Description> -->
						</Card.Header>
						<!-- {JSON.stringify(article.slug)} -->
						<Card.Content>
							{article.yoast_head_json.description}
						</Card.Content>
						<Card.Footer class="flex justify-end">
							<Button class="" onclick={() => handleReadButton(article.slug)}>読む</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="5">Change your password here.</Tabs.Content>
	</Tabs.Root>
</div>
