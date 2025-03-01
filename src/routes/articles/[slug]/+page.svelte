<script>
	// Style
	import '$lib/styles/wp-articles.css';
	import '$lib/styles/ToC.css';

	// Icons
	import { TableOfContents, Home, User } from 'lucide-svelte';

	// Highlight.js
	import 'highlight.js/styles/monokai.css';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import python from 'highlight.js/lib/languages/python';
	import css from 'highlight.js/lib/languages/css';
	// import xml from 'highlight.js/lib/languages/xml';
	import nginx from 'highlight.js/lib/languages/nginx';
	import php from 'highlight.js/lib/languages/php';
	import bash from 'highlight.js/lib/languages/bash';
	import json from 'highlight.js/lib/languages/json'; 
	import sql from 'highlight.js/lib/languages/sql';

	// Chadcn
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer/index.js';

	// Helper
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { fetchWordPressData } from '$lib/api/WPhandler.js';

	// Svelte
	import { onMount, tick, onDestroy } from 'svelte'; // Import `tick`
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Components
	import PublishInfoBadge from '$lib/components/ui/custom-article-card/publish-info-badge.svelte';
	import ArticleCard from '$lib/components/ui/custom-article-card/article-card.svelte';
	import Bio from '$lib/components/about/Bio.svelte';
	import Bookmark from '$lib/components/ui/custom-article-card/bookmark.svelte';

	// Initalize data
	let { data } = $props();
	let isClient = $state(false);
	let post = $state(data.post);
	let seriesDetails = $state(data?.seriesData?.series);
	let seriesPosts = $state(data?.seriesData?.posts);
	let toc = $state([]);
	let urlSlug = $state($page.params.slug);
	let urlSeriesId = $state($page.url.searchParams.get('seriesId'));
	let relatedSeries = $state([]);
	let isOpenDrawer = $state(false);
	let observer;
	let isOpenLoginModal = $state(false);


// Mobile Menu
function openMobileToc() {
    isOpenDrawer = true;
	console.log(isOpenDrawer)
}

function handleClick(path) {
    goto(path);
}

function generateTableOfContents(articleContent) {
		if (typeof articleContent !== 'string' || !articleContent.trim()) {
			console.warn('Invalid article content provided');
			return [];
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString(articleContent, 'text/html');
		const headings = doc.querySelectorAll('h1, h2, h3');

		return Array.from(headings).map((heading) => ({
			text: heading.textContent.trim(),
			level: parseInt(heading.tagName[1], 10)
		}));
}

function observeHeadings() {
    if (observer) {
        observer.disconnect();
    }

    const headings = document.querySelectorAll(
        'h1.wp-block-heading, h2.wp-block-heading, h3.wp-block-heading'
    );

    observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (
                    entry.intersectionRatio > 0 &&
                    entry.boundingClientRect.top <= window.innerHeight / 2
                ) {
                    // Add the class permanently
                    entry.target.classList.add('heading-container');
                    
                    // Stop observing this heading to improve performance
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            root: null, // Observe relative to the viewport
            rootMargin: '0px 0px -50% 0px', // Trigger when halfway in the viewport
            threshold: 0 // Trigger as soon as the element is in view
        }
    );

    headings.forEach((heading) => observer.observe(heading));
}


	function scrollToHeading(text) {
		const heading = Array.from(document.querySelectorAll('h1, h2, h3')).find(
			(el) => el.textContent.trim() === text
		);

		if (!heading) {
			console.warn(`Heading not found for text: ${text}`);
			return;
		}

		if (isOpenDrawer) {
			isOpenDrawer = false;
			setTimeout(() => {
				heading.scrollIntoView({
					behavior: 'smooth',
					block: 'start', // モバイルでヘッダーを隠す問題を回避
					inline: 'nearest'
				});
			}, 350);
		} else {
			heading.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			});
		}
	}

	async function fetchPost(slug) {
		try {
			const [fetchedPost] = await fetchWordPressData({ type: 'singlePost', slug });

			if (!fetchedPost) {
				throw new Error(`Post with slug "${slug}" not found.`);
			}

			post = fetchedPost;
			toc = generateTableOfContents(post?.content?.rendered || '');

			await tick();

			highlightSyntax();
			observeHeadings();
		} catch (error) {
			console.error('Error fetching post:', error);
		}
	}

	function displayRelatedSeries() {
		if (!post.series || !data.series) {
			return [];
		}

		const currentSeriesId = urlSeriesId?.toString();
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
				const seriesResponse = await fetchWordPressData({ type: 'seriesById', seriesId });
				seriesDetails = seriesResponse?.series;
				seriesPosts = seriesResponse?.posts;
			}
		} catch (error) {
			console.error('Error fetching series:', error);
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
		userMgr.setNowReadingArticle(currentSlug, currentSeriesId);

		if (urlSlug !== currentSlug || urlSeriesId !== currentSeriesId) {
			urlSlug = currentSlug;
			urlSeriesId = currentSeriesId;
			if (urlSlug) {
				fetchPost(urlSlug);
			}
			if (urlSeriesId) {
				fetchSeries(urlSeriesId);
				displayRelatedSeries();
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
			// hljs.registerLanguage('xml', xml);
			hljs.registerLanguage('nginx', nginx);
			hljs.registerLanguage('php', php);
			hljs.registerLanguage('bash', bash);
			hljs.registerLanguage('json', json); 
			hljs.registerLanguage('sql', sql);

			
			highlightSyntax();

			// userMgr.setNowReadingArticle($page.params.slug, $page.url.searchParams.get('seriesId'));
			// console.log(userMgr.getNowReadingArticle())
		}
		observeHeadings();

	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<svelte:head>
	<title>{post.title?.rendered} - あさめしコード</title>
	<meta name="description" content={post.excerpt?.rendered?.replace(/<\/?[^>]+(>|$)/g, '')} />
	<meta
		name="robots"
		content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
	/>
	<link rel="canonical" href={post?.link} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{post.title?.rendered} - あさめしコード" />
	<meta property="og:description" content={post.excerpt?.rendered.replace(/<\/?[^>]+(>|$)/g, '')} />
	<meta property="og:url" content={post?.link} />
	<meta property="og:site_name" content="あさめしコード" />
	<meta property="article:published_time" content={post?.date} />
	<meta property="article:modified_time" content={post?.modified} />
	<meta name="author" content="DanNakatoshi" />
	<!-- <meta property="og:image" content="https://kaihatsunosho.com/wp-content/uploads/2025/01/image-3.png" /> -->
	<meta property="og:image:width" content="1348" />
	<meta property="og:image:height" content="1075" />
</svelte:head>


{#if post}
	<div class="grid grid-cols-12 gap-2">
		<Card.Root class="col-span-12 md:col-span-9 ">
			<Card.Header>
				<div class="flex justify-between items-start gap-2">
					<Card.Title class="mb-4">{post.title?.rendered}</Card.Title>
					<Bookmark postId={post?.id}/>
				</div>
					<div class="pb-2">
					<PublishInfoBadge date={post.date} modified={post.modified} />
				</div>
			</Card.Header>


			<Card.Content>
				{#if post.series?.length > 0}
					<div class="mb-4 rounded py-4 ">
						<div class="mb-4 flex flex-col flex-wrap gap-4">
							<span
								class="   px-2 py-0 text-xs font-bold"
							>
							##シリーズ##
							</span>
							<div class="flex flex-wrap gap-2">

								{#each displayRelatedSeries() as series (series.series_ID)}
									<button
									aria-label={series?.ser_name}
									class="rounded border border-primary p-2 text-left leading-tight hover:bg-primary hover:text-white text-primary {series.series_ID == urlSeriesId ? 'text-white bg-primary' : ''}"
									
									onclick={() => articleMgr.handleReadButton(post?.slug, series?.series_ID)}
									>
									
										<span class="font-bold">{series?.ser_name}</span>

									</button>
								{/each}
							</div>
						</div>
						{#if urlSeriesId}
							<div class="mt-2">
								<span>{seriesDetails?.description}</span>
								<div class="flex flex-col flex-wrap items-start justify-start gap-2">
									{#each seriesPosts as seriesPost, index (seriesPost.id)}

										<div class="flex w-full items-center ">
											<button
											aria-label={seriesPost.title}
												onclick={() => articleMgr.handleReadButton(seriesPost.slug, urlSeriesId)}
												class="text-left text-sm hover:underline hover:decoration-2 hover:decoration-primary"
											>
												<span class={`whitespace-normal break-word  ${seriesPost.slug == post.slug ? 'text-primary' : 'text-gray'}`}>
													{index + 1}. {seriesPost.title}
												</span>
											</button>
										</div>
									{/each}
									<div class="w-full border-t border-gray my-2"></div>

								</div>
							</div>
						{/if}
					</div>
				{/if}

				{@html post?.content?.rendered || ''}
			</Card.Content>
		</Card.Root>
	
		
		<div class="hidden md:block md:sticky top-4 col-span-12  max-h-screen md:col-span-3">
			<Card.Root class="col-span-12 md:col-span-3 ">
				<Card.Header>
					<Card.Title>目次ナビ</Card.Title>
					<Card.Description class="pb-4">
						{#if toc.length > 0}
							{@render tocSnippet()}
						{:else}
							目次コンテンツがありません。
						{/if}
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>

		<div class="col-span-12 md:col-span-9 ">
			<Bio/>
		</div>
	</div>
{/if}


<div class="block md:hidden">
	<Drawer.Root bind:open={isOpenDrawer}>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title class="flex justify-center">目次ナビ</Drawer.Title>
			</Drawer.Header>

			<Drawer.Footer>
				{#if toc.length > 0}
					{@render tocSnippet()}
				{:else}
					<p>No Table of Contents available.</p>
				{/if}
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
</div>


<!-- Mobile Menu -->
<!-- <div class="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-border flex justify-around p-2 shadow-md items-center">
	<Button variant="ghost" class="flex flex-col items-center gap-1 transition-all" onclick={() => handleClick('/')} aria-label="home">
	  <Home size="20" />
	  <span class="text-xs">ホーム</span>
	</Button>
  
	<Button  variant="ghost" class="flex flex-col items-center gap-1 transition-all" onclick={() => handleClick('/account')} aria-label="my page">
	  <User size="20" />
	  <span class="text-xs">ﾏｲﾍﾟｰｼﾞ</span>
	</Button>
  
	<Button variant="ghost" class="flex flex-col items-center gap-1 transition-all" onclick={()=> openMobileToc()} aria-label="Table of contents">
	  <TableOfContents size="20" />
	  <span class="text-xs">目次</span>
	</Button>
  
	 
	<div class="flex flex-col items-center gap-1 transition-all" aria-label="Bookmark">
		<Bookmark size="20" postId={post.id} isCircleBtn={true} hasShowLable={true} isOpenModal={isOpenLoginModal}/>
	</div>
 </div> -->




<!-- Table of Contents Snippet -->
{#snippet tocSnippet()}
	<div id="toc" class="flex max-w-full flex-col items-start">
		{#each toc as item (item.text)}
			<div class="w-full">
				<button
					onclick={() => scrollToHeading(item.text)}
					class="w-full overflow-hidden text-left hover:underline"
					aria-label={item.text}
				>
					<span class="block w-full truncate">
						{item.text}
					</span>
				</button>
			</div>
		{/each}
	</div>
{/snippet}
