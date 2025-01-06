<script>
	import { Menu, Bell } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { ICON_SIZES } from '$lib/config.js';
	import { goto } from '$app/navigation';
	import { X } from 'lucide-svelte';

	let isMenuOpen = $state(false);
</script>

{#if isMenuOpen}
	<div class="fixed inset-0 z-10 bg-black bg-opacity-50" onclick={() => (isMenuOpen = false)}></div>
{/if}

<header>
	<div class="flex items-center justify-between p-2">
		<Button size="sm" onclick={() => (isMenuOpen = true)}>
			<Menu size={ICON_SIZES.SMALL} />
		</Button>
		<Button variant="ghost" onclick={() => goto('/')}>
			<span class="font-extrabold">あさめしコード</span>
		</Button>

		<Button size="sm" variant="ghost">
			<Bell size={ICON_SIZES.SMALL} />
		</Button>
	</div>
</header>

<div
	class={`primary fixed left-0 top-0 z-20 h-full w-64 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
	style="background-color: hsl(var(--secondary));"
>
	<div class="relative p-4">
		<Button
			variant="ghost"
			size="sm"
			class="absolute right-2 top-2 rounded-full "
			onclick={() => (isMenuOpen = false)}><X size="12" strokeWidth={6} /></Button
		>
		<h2 class="text-lg font-semibold">Menu</h2>
		<ul class="mt-4 space-y-2">
			<li><a href="#home" class="block py-2">Home</a></li>
			<li><a href="#about" class="block py-2">About</a></li>
			<li><a href="#contact" class="block py-2">Contact</a></li>
		</ul>
	</div>
</div>
