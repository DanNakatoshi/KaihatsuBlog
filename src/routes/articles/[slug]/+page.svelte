<script>
	import * as Card from '$lib/components/ui/card';
	import 'prismjs/themes/prism-twilight.min.css';
	import { onMount } from 'svelte';

	let { data } = $props();
	let isClient = $state(false);

	let post = data.post[0];

	onMount(() => {
		isClient = true;
		if (isClient) {
			import('prismjs').then((Prism) => {
				import('prismjs/components/prism-javascript'); // For JavaScript syntax highlighting, for example
				Prism.highlightAll();
			});
		}
	});
</script>

<div class="container max-w-full w-full mx-auto px-0 ">
	<div class="grid grid-cols-12 gap-2 w-full">
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
				<Card.Title>Card Title</Card.Title>
				<Card.Description>Card Description</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Card Content</p>
			</Card.Content>
			<Card.Footer>
				<p>Card Footer</p>
			</Card.Footer>
		</Card.Root>
	</div>
	{JSON.stringify(post.content.rendered)}
</div>

<style>


</style>