<script>
	// Component
	import Bio from '$lib/components/about/Bio.svelte';

	// Chadcn
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();

	let about = data.about;
	let title = data.about.title;
	let content = data.about.content;
</script>

<svelte:head>
	<title>{about?.title} | あさめしコード</title>
	<meta name="description" content={'このページであさめしコードについて詳しく学びましょう。'} />
	<meta name="keywords" content="あさめしコード, フロントエンド開発, チュートリアル" />
	<meta property="og:title" content={about?.title} />
	<meta
		property="og:description"
		content={'あさめしコードはホカホカのウェブ開発ブログをアメリカからお届けします'}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://asameshicode.com/about" />
	<meta property="og:image" content="https://asameshicode.com/static/og-image-about.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={about?.title} />
	<meta
		name="twitter:description"
		content={'あさめしコードはホカホカのウェブ開発ブログをアメリカからお届けします'}
	/>
	<meta name="twitter:image" content="https://asameshicode.com/static/twitter-image-about.png" />
</svelte:head>

<Card.Root>
	<Card.Header>
		<Card.Title>ABOUT</Card.Title>
		<!-- <Card.Description>Card Description</Card.Description> -->
	</Card.Header>
	<Card.Content>
		{@html content}
	</Card.Content>
</Card.Root>

<div class="mt-2">
	<Bio />
</div>


