<script>
	import { Home, User, BookOpen } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
    import { userMgr } from "$lib/store/userData.svelte.js";
    import { onMount } from "svelte";

	let { slot } = $props();
    let nowReading = $state(null);
    let nowReadingURL = $state('')
	function handleClick(path) {
		goto(path);
	}


    function navigateToReading() {
        nowReading = userMgr.getNowReadingArticle();
        if (nowReading && nowReading.slug) {
            nowReadingURL = nowReading.seriesId 
                ? `/articles/${nowReading.slug}?seriesId=${nowReading.seriesId}` 
                : `/articles/${nowReading.slug}`;
            goto(nowReadingURL);
        }
    }

    onMount(() => {
        // console.log(nowReadingURL)
    });
</script>

<div
	class="fixed bottom-0 left-0 flex w-full items-center justify-around border-t border-border bg-background p-2 shadow-md md:hidden"
>
	<!-- Home -->
	<Button
		variant="ghost"
		class="flex flex-col items-center gap-1 transition-all"
		onclick={() => handleClick('/')}
		aria-label="home"
	>
		<Home size="20" />
		<span class="text-xs">ホーム</span>
	</Button>

	<!-- Profile -->
	<Button
		variant="ghost"
		class="flex flex-col items-center gap-1 transition-all"
		onclick={() => handleClick('/account')}
		aria-label="my page"
	>
		<User size="20" />
		<span class="text-xs">ﾏｲﾍﾟｰｼﾞ</span>

	</Button>

    <!-- {#if nowReading} -->
	<Button
		variant="ghost"
		class="flex flex-col items-center gap-1 transition-all"
		onclick={navigateToReading} 
		aria-label="my page"
	>
		<BookOpen size="20" />
		<span class="text-xs">読みかけ</span>

	</Button>
    <!-- {/if} -->

</div>
