<script>
    import { onMount } from 'svelte';
    import { userMgr } from '$lib/store/userData.svelte.js';

    onMount(async () => {
        console.log("🔄 Processing login...");

        if (!userMgr) {
            console.error("❌ `userMgr` is not available. Ensure it's initialized on the client.");
            return;
        }

        await userMgr.extractSessionFromUrl();

        console.log("✅ Login successful! Redirecting...");
        window.location.replace('/');
    });
</script>

<p>Processing login...</p>
