<script>
	import '$lib/styles/wp-articles.css';
	import '$lib/styles/ToC.css';
	import * as Card from '$lib/components/ui/card';
	// import 'prismjs/themes/prism-twilight.min.css';
	import 'highlight.js/styles/monokai.css'; // Replace with your preferred Highlight.js theme
	import { onMount, tick } from 'svelte'; // Import `tick`
	import { generateTableOfContents } from '$lib/helper/createToc.js';
	// import Prism from 'prismjs';

	// Highlight.js
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import python from 'highlight.js/lib/languages/python';
	import css from 'highlight.js/lib/languages/css';
	import xml from 'highlight.js/lib/languages/xml';
	import nginx from 'highlight.js/lib/languages/nginx';
	import php from 'highlight.js/lib/languages/php';

	import Button from '$lib/components/ui/button/button.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { fetchSinglePost, fetchSeriesById } from '$lib/api/WPhandler.js';
	import { page } from '$app/stores';

	let { data } = $props();
	let isClient = $state(false);

	let post = $state(data.post);
	let seriesId = $state(data.seriesId);
	let seriesDescription = $state(data.seriesData.series);
	let seriesPosts = $state(data.seriesData.posts);

	// let currentUrl = $page.url;
	// let pathname = $page.url.pathname;
	let urlSlug = $state($page.params.slug);
	let urlSeriesId = $page.url.searchParams.get('seriesId');

	// console.log(slug)
	// console.log(urlSeriesId)

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

	async function fetchPost(slug) {
		try {
			post = await fetchSinglePost(slug); // Fetch new post
			toc = generateTableOfContents(post?.content?.rendered || ''); // Update ToC

			// Wait for the DOM to update before applying syntax highlighting
			await tick();
			highlightSyntax(); // Highlight the newly fetched post
		} catch (error) {
			console.error('Error fetching post:', error);
		}
	}

	async function fetchSeries(seriesId) {
		try {
			if (seriesId) {
				// seriesPosts = await fetchSeriesById(seriesId);
				// console.log('Series fetched successfully:', seriesPosts);
			}
		} catch (error) {
			console.error('Error fetching series:', error);
		}
	}

	// function highlightSyntax() {
	// 	document.querySelectorAll('pre code').forEach((block) => {
	// 		if (block.dataset.highlighted) {
	// 			delete block.dataset.highlighted;
	// 			console.log(block.dataset.highlighted)
	// 			console.log("highlighted code deleted")

	// 		}
	// 		hljs.highlightElement(block);
	// 		// block.dataset.highlighted = 'yes';
	// 	});
	// 	console.log("highlighted")
	// }

	function highlightSyntax() {
		const blocks = document.querySelectorAll('pre code');
		if (blocks.length > 0) {
			blocks.forEach((block) => {
				hljs.highlightElement(block);
				// console.log('Highlighted block:', block); // Debugging output
			});
		} else {
			console.warn('No code blocks found to highlight.');
		}
	}

	$effect(() => {
		const currentSlug = $page.params.slug;
		const currentSeriesId = $page.url.searchParams.get('seriesId');

		if (urlSlug !== currentSlug || urlSeriesId !== currentSeriesId) {
			urlSlug = currentSlug;
			urlSeriesId = currentSeriesId;

			// Fetch updated data
			if (urlSlug) fetchPost(urlSlug);
			if (urlSeriesId) fetchSeries(urlSeriesId);
		}
	});

	onMount(() => {
		isClient = true;
		if (isClient) {
			toc = generateTableOfContents(post?.content?.rendered || '');

			hljs.registerLanguage('javascript', javascript);
			hljs.registerLanguage('python', python);
			hljs.registerLanguage('css', css);
			hljs.registerLanguage('xml', xml);
			hljs.registerLanguage('nginx', nginx);
			hljs.registerLanguage('php', php);

			highlightSyntax();
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
					<!-- <Card.Description> -->
					{#if seriesId}
						<div class="mt-2 rounded bg-secondary p-2">
							<h4 class=" px-2 py-1 text-xs text-yellow-300">
								シリーズ: <strong>{seriesDescription.name}</strong>
							</h4>

							{seriesDescription.description}
							<div class="flex flex-col items-start justify-start">
								{#each seriesPosts as seriesPost, index (seriesPost.id)}
									<div>
										<Button
											variant="link"
											onclick={() => articleMgr.handleReadButton(seriesPost.slug, seriesId)}
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
					<!-- </Card.Description> -->
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
