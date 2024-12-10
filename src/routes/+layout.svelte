<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';


	let { children, data } = $props();
	// console.log(data.categories)

</script>


<div class="">

	<Header />

	<div class="">
		{@render children(data)}
	</div>
	
</div>

