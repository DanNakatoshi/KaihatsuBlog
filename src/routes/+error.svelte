<script>
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
</script>


<div class="mt-3">

    <h1>ページが見つかりませんでした。</h1>
    
    <Button
	variant="link"
	onclick={() => {
        goto('/');
	}}>HOMEに戻る</Button
>

</div>