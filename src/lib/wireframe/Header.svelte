<script>
	import { Menu } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

    import { ICON_SIZES } from "$lib/config.js"; 
</script>

<header>
	<div class="flex justify-between items-center p-2">
		<Button size="sm">
			<Menu size={ICON_SIZES.SMALL} />
		</Button>
        <div>
            開発.dev
        </div>
        <div></div>
	</div>
</header>

