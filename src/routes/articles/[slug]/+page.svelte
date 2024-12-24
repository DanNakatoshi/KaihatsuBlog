<script>
	import '$lib/styles/wp-articles.css';
	import '$lib/styles/ToC.css';
	import * as Card from '$lib/components/ui/card';
	// import 'prismjs/themes/prism-twilight.min.css';
	import 'highlight.js/styles/monokai.css'; // Replace with your preferred Highlight.js theme
	import { onMount } from 'svelte';
	import { generateTableOfContents } from '$lib/helper/createToc.js';
	// import Prism from 'prismjs';
	import hljs from 'highlight.js/lib/core';
	// Import the languages you need
	import javascript from 'highlight.js/lib/languages/javascript';
	import python from 'highlight.js/lib/languages/python';
	import css from 'highlight.js/lib/languages/css';
	import xml from 'highlight.js/lib/languages/xml';
	import nginx from 'highlight.js/lib/languages/nginx';
	import php from 'highlight.js/lib/languages/php';
	import Button from '$lib/components/ui/button/button.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { fetchSinglePost } from '$lib/api/WPhandler.js';
	import { page } from '$app/stores';

	let { data } = $props();
	let isClient = $state(false);

	let post = $state(data.post);
	let seriesId = $state(data.seriesId);
	let seriesDescription = $state(data.seriesData.series);
	let seriesPosts = $state(data.seriesData.posts);

	let currentUrl = $page.url;
	let pathname = $page.url.pathname;
	let slug = $page.params.slug;
	let seriesIdFromURL = $page.url.searchParams.get('seriesId');

	console.log(slug)
	console.log(seriesIdFromURL)

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


// 	async function fetchPost(slug) {
//     post = await fetchSinglePost(slug);
//   }
// 	$effect(() => {
// 		fetchPost(post.slug)
//   });

	onMount(() => {
		isClient = true;
		if (isClient) {
			// if(post.content) {
			// 	toc = generateTableOfContents(post?.content?.rendered);
			// }
			// Register languages with Highlight.js
			hljs.registerLanguage('javascript', javascript);
			hljs.registerLanguage('python', python);
			hljs.registerLanguage('css', css);
			hljs.registerLanguage('xml', xml);
			hljs.registerLanguage('nginx', nginx);
			hljs.registerLanguage('php', php);

			// Highlight all code blocks
			document.querySelectorAll('pre code').forEach((block) => {
				hljs.highlightElement(block);
			});
		}
	});
</script>

<!-- {JSON.stringify(seriesPosts)} -->

{#if post}
<div class=" ">
	<div class="grid grid-cols-12 gap-2">
		<Card.Root class="col-span-12 md:col-span-9 ">
			<Card.Header>
				<Card.Title>{post.title.rendered}</Card.Title>
				<Card.Description>
					{#if seriesId}
						<div class="mt-2 rounded bg-secondary p-2">
							<h4 class=" px-2 py-1 text-xs text-yellow-300">
								シリーズ: <strong>{seriesDescription.name}</strong>
							</h4>

							<p>
								{seriesDescription.description}
							</p>
							<div class="flex flex-col items-start justify-start">
								{#each seriesPosts as seriesPost, index (seriesPost.id)}
									<div>
										<Button
											variant="link"
											onclick={() => articleMgr.handleReadButton(post.slug, seriesId)}
										>
											{index + 1}: {seriesPost.title}
										</Button>
										{#if seriesPost.slug == post.slug}
											👈いまここ
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{:else}
						maybe
					{/if}
				</Card.Description>
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
{/if}

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
