<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import { supabase } from '$lib/api/supabaseClient';
    import { Input } from '$lib/components/ui/input/index.js';
    import Button from '$lib/components/ui/button/button.svelte';
    import { Loader2, Eye, EyeOff } from 'lucide-svelte';

    let newPassword = '';
    let isSubmitting = false;
    let access_token = '';
    let refresh_token = '';
    let showPassword = false;

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        access_token = urlParams.get('access_token');
        refresh_token = urlParams.get('refresh_token');

        if (!access_token || !refresh_token) {
            toast.error('❌ 無効なリセットリンクです。もう一度試してください。');
            goto('/account');
            return;
        }

        // Set Supabase session for the user before allowing password reset
        const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });

        if (error) {
            toast.error(`❌ セッションの設定に失敗しました: ${error.message}`);
            goto('/account');
        }
    });

    async function handleResetPassword() {
        if (!newPassword || newPassword.length < 8) {
            toast.error('⚠️ 新しいパスワードを8文字以上にしてください。');
            return;
        }

        isSubmitting = true;

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        isSubmitting = false;

        if (error) {
            toast.error(`❌ エラー: ${error.message}`);
            return;
        }

        toast.success('✅ パスワードが変更されました！');
        goto('/account'); // Redirect to login/account page after reset
    }
</script>

<form class="mx-auto flex max-w-md flex-col gap-4 p-4">
    <h2 class="text-xl font-bold">新しいパスワードを入力</h2>
    <div class="relative max-w-xs">
        <Input
            type={showPassword ? "text" : "password"}
            bind:value={newPassword}
            placeholder="新しいパスワード"
            required
            autocomplete="new-password"
        />
        <button
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2"
            onclick={() => showPassword = !showPassword}
        >
            {#if showPassword}
                <EyeOff size={20} />
            {:else}
                <Eye size={20} />
            {/if}
        </button>
    </div>
    <Button onclick={handleResetPassword} disabled={isSubmitting}>
        {#if isSubmitting}
            <Loader2 size={20} stroke-width={2} class="animate-spin" />
        {:else}
            パスワードを変更する
        {/if}
    </Button>
</form>
