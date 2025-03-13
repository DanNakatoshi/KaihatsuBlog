<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import { userMgr } from '$lib/store/userData.svelte.js';
    import Button from '$lib/components/ui/button/button.svelte';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Loader2 } from 'lucide-svelte';

    let newPassword = '';
    let isSubmitting = false;
    let token = '';

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get('token');

        if (!token) {
            toast.error('❌ 無効なリセットリンクです。もう一度試してください。');
            // goto('/account');
        }
    });

    async function handleResetPassword() {
        if (!newPassword || newPassword.length < 8) {
            toast.error('⚠️ 新しいパスワードを8文字以上にしてください。');
            return;
        }

        isSubmitting = true;
        const { error } = await userMgr.resetPassword(newPassword, token);
        isSubmitting = false;

        if (error) {
            toast.error(`❌ エラー: ${error.message}`);
            return;
        }

        toast.success('✅ パスワードが変更されました！ログインしてください。');
        goto('/account');
    }
</script>

<form class="mx-auto flex max-w-md flex-col gap-4 p-4">
    <h2 class="text-xl font-bold">新しいパスワードを入力</h2>
    <Input
        type="password"
        bind:value={newPassword}
        placeholder="新しいパスワード"
        class="max-w-xs"
        required
        autocomplete="new-password"
    />
    <Button onclick={handleResetPassword} disabled={isSubmitting}>
        {#if isSubmitting}
            <Loader2 size={20} stroke-width={2} class="animate-spin" />
        {:else}
            パスワードを変更する
        {/if}
    </Button>
</form>
