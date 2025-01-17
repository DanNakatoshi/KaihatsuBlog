<script>
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { filterMgr } from '$lib/store/articleData.svelte';

	let { filterName = '', filterOptions = [] } = $props();
	let selectedValues = $state([]);
</script>

<div class="flex items-center">
	<div class="mr-2 flex min-w-28 justify-end text-xs font-bold">{filterName} :</div>
	<ToggleGroup.Root size="sm" type="multiple" class="my-2 gap-2" value="">
		{#each filterOptions as filter}
			<ToggleGroup.Item value={filter.name} class="rounded-full text-xs font-bold"
				>{filter.name}</ToggleGroup.Item
			>
		{/each}
	</ToggleGroup.Root>
</div>
