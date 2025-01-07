<script>
	// Style
	import '$lib/styles/wp-articles.css';
	import '$lib/styles/ToC.css';

	// Highlight.js
	import 'highlight.js/styles/monokai.css'; // Replace with your preferred Highlight.js theme
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import python from 'highlight.js/lib/languages/python';
	import css from 'highlight.js/lib/languages/css';
	import xml from 'highlight.js/lib/languages/xml';
	import nginx from 'highlight.js/lib/languages/nginx';
	import php from 'highlight.js/lib/languages/php';
	import bash from 'highlight.js/lib/languages/bash';


	// Chadcn
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';

	// Helper
	// import { generateTableOfContents } from '$lib/helper/createToC.js';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { fetchSinglePost, fetchSeriesById } from '$lib/api/WPhandler.js';

	// Svelte
	import { onMount, tick } from 'svelte'; // Import `tick`
	import { page } from '$app/stores';

	// Initalize data
	let { data } = $props();
	let isClient = $state(false);
	let post = $state(data.post);
	let seriesDetails = $state(data.seriesData.series);
	let seriesPosts = $state(data.seriesData.posts);
	let toc = $state([]);
	let urlSlug = $state($page.params.slug);
	let urlSeriesId = $state($page.url.searchParams.get('seriesId'));



	function generateTableOfContents(articleContent) {
    if (typeof articleContent !== 'string' || !articleContent.trim()) {
      console.warn('Invalid article content provided');
      return [];
    }
  
    // Parse the HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(articleContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
  
    // Build the ToC without modifying the original HTML
    return Array.from(headings).map((heading) => ({
      text: heading.textContent.trim(),
      level: parseInt(heading.tagName[1], 10), // Extract heading level (e.g., 1 for <h1>)
    }));
  }
  
	function scrollToHeading(text) {
		document
			.querySelectorAll('h1, h2, h3')
			.forEach(
				(el) =>
					el.textContent.trim() === text &&
					el.scrollIntoView({ behavior: 'smooth', block: 'start' })
			);
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

	function displayRelatedSeries() {
		if (!post.series || !data.series) {
			return [];
		}
		const relatedSeries = post.series.map((seriesId) => data.series[seriesId]).filter(Boolean);
		return relatedSeries;
	}

	async function fetchSeries(seriesId) {
		try {
			if (seriesId) {
				seriesPosts = await fetchSeriesById(seriesId);
				// console.log(seriesPosts)
				seriesDetails = seriesPosts?.series;
				seriesPosts = seriesPosts?.posts;
				// console.log($page.url.searchParams.get('seriesId'))
				// seriesId = $page.url.searchParams.get('seriesId')
			}
		} catch (error) {
			// console.error('Error fetching series:', error);
		}
	}

	function highlightSyntax() {
		const blocks = document.querySelectorAll('pre code');
		if (blocks.length > 0) {
			blocks.forEach((block) => {
				hljs.highlightElement(block);
				// console.log('Highlighted block:', block); // Debugging output
			});
		} else {
			// console.warn('No code blocks found to highlight.');
		}
	}

	$effect(() => {
		const currentSlug = $page.params.slug;
		const currentSeriesId = $page.url.searchParams.get('seriesId');
		if (urlSlug !== currentSlug || urlSeriesId !== currentSeriesId) {
			urlSlug = currentSlug;
			urlSeriesId = currentSeriesId;
			// seriesId = currentSeriesId
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
			hljs.registerLanguage('bash', bash);

			highlightSyntax();
		}
	});
</script>

{#if post}
	<div class=" ">
		<div class="grid grid-cols-12 gap-2">
			<Card.Root class="col-span-12 md:col-span-9 ">
				<Card.Header>
					<Card.Title class="mb-4">{post.title.rendered}</Card.Title>
					<!-- <Card.Description> -->
					{#if urlSeriesId}
						<div class="mt-2 rounded bg-secondary p-2">
							<h4 class=" px-2 py-1 text-xs text-yellow-300">
								シリーズ: <strong>{seriesDetails?.name}</strong>
							</h4>
							{seriesDetails?.description}
							<div class="flex flex-col items-start justify-start">
								{#each seriesPosts as seriesPost, index (seriesPost.id)}
									<div class="w-full overflow-hidden flex items-center">
										{#if seriesPost.slug == post.slug}
										<span class="text-sm ">
											👉
										</span>
										{/if}
										<Button
											variant="link"
											onclick={() => articleMgr.handleReadButton(seriesPost.slug, urlSeriesId)}
										>
											<span class={ seriesPost.slug == post.slug ? ' text-yellow-300' : '' }>{seriesPost.title}</span>
										</Button>
							
									</div>
								{/each}
							</div>
						</div>
					{:else if post.series.length > 0}
						<div class="mt-2 rounded bg-secondary p-2">
							<p class="text-sm p-2 text-gray-300">
								シリーズを表示
							</p>
							<div class="flex flex-row flex-wrap gap-2">
								{#each displayRelatedSeries() as series (series.series_ID)}
									<Button onclick={() => articleMgr.handleReadButton(post.slug, series.series_ID)}>
										{series.ser_name}
									</Button>
								{/each}
							</div>
							<ul></ul>
						</div>
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
