<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { userMgr } from '$lib/store/userData.svelte.js';
    let isOpen = $state(false);

    function closeModal() {
        isOpen = false
    }

    function openModal() {
        isOpen = true    
    }
</script>

<div>
	<!-- <Button variant="destructive">アカウントを削除</Button> -->


    <Button variant="destructive" onclick={openModal}>アカウントを削除</Button>

    <Dialog.Root bind:open={isOpen}>
        <Dialog.Content>
            アカウントを削除するとブックマークの記録やコメントなどアカウントに関連するデータを含めてすべてのデータが削除され取り戻すことが不可能になります。
            それでも、アカウントの削除をしますか？
            <div class="flex justify-center gap-3">
                <Button  onclick={closeModal}>キャンセル</Button>
                <Button variant="destructive" onclick={() => userMgr.deleteAccount()}>アカウントを削除</Button>
            </div>
            <!-- <Dialog.Header>
                <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                <Dialog.Description>
                    This action cannot be undone. This will permanently delete your account and remove your data
                    from our servers.
                </Dialog.Description>
            </Dialog.Header> -->
        </Dialog.Content>
    </Dialog.Root>
</div>





