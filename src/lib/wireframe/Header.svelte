<script>
	import { Menu } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
    import { ICON_SIZES } from "$lib/config.js"; 

	let isMenuOpen = $state(false);
</script>


{#if isMenuOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 z-10" onclick={() => (isMenuOpen = false)}></div>
{/if}

<header>
	<div class="flex justify-between items-center p-2">
		<Button size="sm" onclick={() => (isMenuOpen = true)}>
			<Menu size={ICON_SIZES.SMALL} />
		</Button>
        <div>
            開発.dev
        </div>
        <div></div>
	</div>
</header>


<div class={`fixed top-0 left-0 w-64 h-full bg-slate-900 transform transition-transform duration-300 ease-in-out z-20 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
	<div class="p-4">
		<h2 class="text-lg font-semibold">Menu</h2>
		<ul class="mt-4 space-y-2">
			<li><a href="#home" class="block py-2">Home</a></li>
			<li><a href="#about" class="block py-2">About</a></li>
			<li><a href="#contact" class="block py-2">Contact</a></li>
		</ul>
		<Button size="sm" onclick={() => (isMenuOpen = false)} class="mt-4">
			Close
		</Button>
	</div>
</div>