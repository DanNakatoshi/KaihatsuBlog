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

	// Components
	import PublishInfoBadge from '$lib/components/ui/article-card/publish-info-badge.svelte';

	// Initalize data
	let { data } = $props();
	let isClient = $state(false);
	let post = $state(data.post);
	let seriesDetails = $state(data.seriesData.series);
	let seriesPosts = $state(data.seriesData.posts);
	let toc = $state([]);
	let urlSlug = $state($page.params.slug);
	let urlSeriesId = $state($page.url.searchParams.get('seriesId'));
	let relatedSeries = $state([]);

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
			level: parseInt(heading.tagName[1], 10) // Extract heading level (e.g., 1 for <h1>)
		}));
	}

	function observeHeadings() {
		const headings = document.querySelectorAll(
			'h1.wp-block-heading, h2.wp-block-heading, h3.wp-block-heading'
		);

		// Log found headings for debugging
		console.log('Headings found:', headings);

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Heading is visible within the viewport
						entry.target.classList.add('heading-container');
						console.log('Class added:', entry.target.textContent);
					} else {
						// Heading has completely exited the viewport
						entry.target.classList.remove('heading-container');
						console.log('Class removed:', entry.target.textContent);
					}
				});
			},
			{
				root: null, // Observe relative to the viewport
				threshold: 0 // Trigger as soon as any part of the heading is visible or not visible
			}
		);

		headings.forEach((heading) => observer.observe(heading));
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

		const currentSeriesId = urlSeriesId?.toString(); // Safely handle null or undefined
		const activeSeries = [];
		const otherSeries = [];

		post.series.forEach((seriesId) => {
			const series = data.series[seriesId];
			if (series && series.series_ID != null) {
				if (series.series_ID.toString() === currentSeriesId) {
					activeSeries.push(series);
				} else {
					otherSeries.push(series);
				}
			}
		});

		return [...activeSeries, ...otherSeries];
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
			if (urlSlug) {
				fetchPost(urlSlug)
				// observeHeadings();

			};
			if (urlSeriesId) {
				fetchSeries(urlSeriesId);
				displayRelatedSeries();
				// observeHeadings();
			}
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
		observeHeadings();
	});
</script>

{#if post}
	<div class=" ">
		<div class="grid grid-cols-12 gap-2">
			<Card.Root class="col-span-12 md:col-span-9 ">
				<Card.Header>
					<Card.Title class="mb-4">{post.title.rendered}</Card.Title>
					<div class="pb-2">
						<PublishInfoBadge date={post.date} modified={post.modified} />
					</div>
				</Card.Header>
				<Card.Content>
					{#if post.series?.length > 0}
					<div class="mb-4 rounded bg-secondary p-2 py-4">
						<div class="mb-4 flex flex-wrap gap-4">
							{#each displayRelatedSeries() as series (series.series_ID)}
								<div class="relative">
									<span
										class="text-yellow absolute -top-3 left-0 z-10 -rotate-3 whitespace-nowrap px-2 py-1 text-xs font-bold"
									>
										{series.series_ID != urlSeriesId ? 'シリーズで読む' : 'このシリーズ'}
									</span>
									<Button
										class={series.series_ID == urlSeriesId ? 'text-primary' : 'text-gray'}
										variant="outline"
										onclick={() => articleMgr.handleReadButton(post.slug, series.series_ID)}
									>
										<span class="font-bold">{series.ser_name}</span>
									</Button>
								</div>
							{/each}
						</div>
						{#if urlSeriesId}
							<div class="mt-2">
								<!-- <h4 class=" px-2 py-1 text-xs text-yellow-300">
								シリーズ: <strong>{seriesDetails?.name}</strong>
							</h4> -->
								{seriesDetails?.description}
								<div class="flex flex-col items-start justify-start">
									{#each seriesPosts as seriesPost, index (seriesPost.id)}
										<div class="flex w-full items-center overflow-hidden">
											<!-- {#if seriesPost.slug == post.slug}
											<span class="text-sm">👉</span>
										{/if} -->
											<Button
												variant="link"
												onclick={() => articleMgr.handleReadButton(seriesPost.slug, urlSeriesId)}
											>
												<span class={seriesPost.slug == post.slug ? ' text-primary' : 'text-gray'}
													>{index + 1}. {seriesPost.title}</span
												>
											</Button>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
					{/if}

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
