<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';

	let { children } = $props();
</script>

<div class="relative z-0 grid min-h-screen grid-rows-[auto,1fr,auto] items-start">

	<Header />

	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr] ">
		{@render children()}
	</div>
	
</div>
