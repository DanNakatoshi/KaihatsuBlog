<script>
	import Bio from '$lib/components/about/Bio.svelte';
	// Chadcn
	import * as Card from "$lib/components/ui/card";

	let { data } = $props();

	let siteupdates = data.siteupdates;
	let title = data.siteupdates.title;
	let content = data.siteupdates.content;
</script>

<svelte:head>
	<title>{siteupdates?.title} | あさめしコード</title>
	<meta name="description" content={'あさめしコードのサイト更新情報'} />
	<meta name="keywords" content="あさめしコード, フロントエンド開発, チュートリアル" />
	<meta property="og:title" content={siteupdates?.title} />
	<meta
		property="og:description"
		content={'あさめしコードはホカホカのウェブ開発ブログをアメリカからお届けします'}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://asameshicode.com/siteupdates" />
	<!-- <meta property="og:image" content="https://asameshicode.com/static/og-image-about.png" /> -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={siteupdates?.title} />
	<meta
		name="twitter:description"
		content={'あさめしコードはホカホカのウェブ開発ブログをアメリカからお届けします'}
	/>
	<!-- <meta name="twitter:image" content="https://asameshicode.com/static/twitter-image-about.png" /> -->
</svelte:head>


<Card.Root>
	<Card.Header>
		<Card.Title>SITE UPDATE</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<Card.Content>
		{@html content}
	</Card.Content>
</Card.Root>

<div class="mt-2">
	<Bio />
</div>