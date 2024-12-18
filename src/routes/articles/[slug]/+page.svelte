<script>
	import '$lib/styles/wp-articles.css';
	import '$lib/styles/ToC.css';
	import * as Card from '$lib/components/ui/card';
	import 'prismjs/themes/prism-twilight.min.css';
	import { onMount } from 'svelte';
	import { generateTableOfContents } from '$lib/helper/createToc.js';
	import Prism from 'prismjs';
	// import 'prismjs/components/prism-javascript'; // Add other languages as needed

	// Prism.highlightAll();
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
			console.log(post);

			import('prismjs').then((Prism) => {
				import('prismjs/components/prism-javascript'); // For JavaScript syntax highlighting, for example
				Prism.highlightAll();
			});
		}
	});
</script>

<div class="">
	<div class="grid grid-cols-12 gap-2">
		<Card.Root class="col-span-12 md:col-span-9 ">
			<Card.Header>
				<Card.Title>{post.title.rendered}</Card.Title>
				<Card.Description>Card Description</Card.Description>
			</Card.Header>
			<Card.Content>
				{@html post.content.rendered}
			</Card.Content>
			<Card.Footer>
				<!--  -->
			</Card.Footer>
		</Card.Root>
		<Card.Root class="col-span-12 md:col-span-3">
			<Card.Header>
				<!-- <Card.Title>ToC</Card.Title> -->
				<Card.Description>
					{#if toc.length > 0}
						{@render tocSnippet()}
					{:else}
						No Table of Contents available.
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Card Content</p>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
			</Card.Footer>
		</Card.Root>
	</div>
	<!-- {JSON.stringify(post.content.rendered)} -->
</div>

{#snippet tocSnippet()}
  <h2 class="mb-2 text-sm font-bold">目次ナビ</h2>
  <ul id="toc" class="flex max-w-full flex-col items-start">
    {#each toc as item (item.text)}
      <li class="w-full">
        <button
          onclick={() => scrollToHeading(item.text)}
          class="text-left hover:underline overflow-hidden w-full"
        >
          <span class="truncate block w-full">
            {item.text}
          </span>
        </button>
      </li>
    {/each}
  </ul>
{/snippet}
