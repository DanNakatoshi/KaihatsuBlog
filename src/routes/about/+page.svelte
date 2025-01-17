<script>
	let { data } = $props();

	let about = data.about;
	let title = data.about.title;
	let content = data.about.content;
	console.log(about);
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

<h1>
	{title}
</h1>
<div class=" md:container">{@html content}</div>
