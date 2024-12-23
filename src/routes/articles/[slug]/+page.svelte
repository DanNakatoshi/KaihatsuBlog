<script>
	import '$lib/styles/wp-articles.css';
	import '$lib/styles/ToC.css';
	import * as Card from '$lib/components/ui/card';
	import 'prismjs/themes/prism-twilight.min.css';
	import { onMount } from 'svelte';
	import { generateTableOfContents } from '$lib/helper/createToc.js';
	import Prism from 'prismjs';

	let { data } = $props();
	let isClient = $state(false);

	let post = data.post[0];

	let toc = $state([]);

	function scrollToHeading(text) {
		const heading = Array.from(document.querySelectorAll('h1, h2, h3')).find(
			(el) => el.textContent.trim() === text
		);

		if (heading) {
			heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
			heading.focus({ preventScroll: true }); // Optional for accessibility
		}
	}

	onMount(() => {
		isClient = true;
		toc = generateTableOfContents(post.content.rendered);
		if (isClient) {
			import('prismjs').then((Prism) => {
				import('prismjs/components/prism-javascript'); 
				import('prismjs/components/prism-python'); 
				import('prismjs/components/prism-css'); 
				import('prismjs/components/prism-markup'); 
				import('prismjs/components/prism-nginx');
				// import('prismjs/components/prism-php'); 
				Prism.highlightAll();
			});
		}
	});
</script>

<div class=" ">
	<div class="grid grid-cols-12 gap-2">
		<Card.Root class="col-span-12 md:col-span-9 ">
			<Card.Header>
				<Card.Title>{post.title.rendered}</Card.Title>
				<!-- <Card.Description>Card Description</Card.Description> -->
			</Card.Header>
			<Card.Content>
				{@html post.content.rendered}
			</Card.Content>
			<Card.Footer>
				<!--  -->
			</Card.Footer>
		</Card.Root>

		<div class="sticky top-4 col-span-12 max-h-screen md:col-span-3">
			<Card.Root class="col-span-12 md:col-span-3 ">
				<Card.Header>
					<Card.Title>目次ナビ</Card.Title>
					<Card.Description class="pb-4">
						{#if toc.length > 0}
							{@render tocSnippet()}
						{:else}
							No Table of Contents available.
						{/if}
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
	</div>
	<!-- {JSON.stringify(post.content.rendered)} -->
</div>

{#snippet tocSnippet()}
	<ul id="toc" class="flex max-w-full flex-col items-start">
		{#each toc as item (item.text)}
			<li class="w-full">
				<button
					onclick={() => scrollToHeading(item.text)}
					class="w-full overflow-hidden text-left hover:underline"
				>
					<span class="block w-full truncate">
						{item.text}
					</span>
				</button>
			</li>
		{/each}
	</ul>
{/snippet}
