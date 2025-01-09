<script>
	import { Badge } from '$lib/components/ui/badge/index.js';

	let { date, modified } = $props();

	let publishedDate = new Date(date).toLocaleDateString();
	let modifiedDate = new Date(modified).toLocaleDateString();

</script>


<div class="flex flex-wrap gap-2">
    {#if publishedDate}
	<Badge variant="secondary" class="text-gray">
        公開日：{publishedDate}
	</Badge>
    {/if}
    {#if modifiedDate}
	<Badge variant="secondary" class="text-gray">
        更新日：{modifiedDate}
	</Badge>
    {/if}
</div>