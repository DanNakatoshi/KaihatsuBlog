<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { privacyDrawerManager } from '$lib/store/pageContorol.svelte';
	import { onMount  } from 'svelte';
	import { goto } from '$app/navigation';

	let isClient = $state(false);

    $effect(()=>{
        if (!privacyDrawerManager.isDrawerOpen) {
            goto('/')
        }
    })

    onMount(() => {
		isClient = true;
        if (isClient) {
            privacyDrawerManager.setDrawerState(true);
        }
    });
    

</script>


