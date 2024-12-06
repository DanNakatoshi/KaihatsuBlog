<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';


	let { children, data } = $props();
	console.log(data)

</script>


<div class="">

	<Header />

	<div class="">
		{@render children()}
	</div>
	
</div>
