<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<!-- <Button>Click me</Button> -->

<div class="">
    <Tabs.Root value="article" class="w-[400px]">
        <Tabs.List>
            <Tabs.Trigger value="article">記事</Tabs.Trigger>
            <Tabs.Trigger value="series">シリーズ</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="article">Make changes to your account here.</Tabs.Content>
        <Tabs.Content value="series">Change your password here.</Tabs.Content>
    </Tabs.Root>
</div>

