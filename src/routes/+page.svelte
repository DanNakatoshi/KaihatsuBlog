<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { categorizeCategories } from '$lib/store/articleData.svelte.js';
	import { effect } from 'zod';
	// import * as Popover from '$lib/components/ui/popover/index.js';
	// import * as Command from '$lib/components/ui/command/index.js';
	// import * as Form from '$lib/components/ui/form';
	// import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	// import Check from 'lucide-svelte/icons/check';
	// import { cn } from '$lib/utils.js';

	let { data } = $props();

	const { mainCat, childCat, grandChildCat } = categorizeCategories(data.categories);

	console.log(childCat);

	let articles = data.posts;
	let sortByVal = $state('最新順');
	// let selectedMainCat = $state('記事');
	let selectedMainCatId = $state('9');


</script>

<!-- <Button>Click me</Button> -->

<div class="flex w-full flex-col items-center">
	<Tabs.Root value={selectedMainCatId} class="w-[400px] p-1">
		<div class="flex justify-center">
			<Tabs.List>
				{#each mainCat as cat (cat.id)}
					<Tabs.Trigger value={cat.id}>{cat.name}</Tabs.Trigger>
				{/each}
			</Tabs.List>
		</div>

		<ToggleGroup.Root size="sm" type="multiple" class="my-2 gap-2">
			<!-- {#if }
                
            {/if} -->
			<ToggleGroup.Item value="a">ブログ</ToggleGroup.Item>
			<ToggleGroup.Item value="b">テクニカル</ToggleGroup.Item>
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

		<Tabs.Content value="article">
			<div class="grid gap-2">
				{#each articles as article (article.id)}
					<Card.Root>
						<Card.Header>
							<Card.Title>{article.title.rendered}</Card.Title>
							{@html article.excerpt.rendered}
							<Card.Description></Card.Description>
						</Card.Header>
						<!-- <Card.Content>
							<p>
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ex quod quidem.
								Voluptates ea minus odio, maiores numquam quis dolorum!
							</p>
						</Card.Content> -->
						<Card.Footer>
							<Button class="w-full">読む</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="series">Change your password here.</Tabs.Content>
	</Tabs.Root>
</div>
