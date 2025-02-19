<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userMgr } from '$lib/store/userData.svelte.js';

	onMount(async () => {
		// ✅ Ensure session is updated
		await userMgr?.fetchUser();

		// ✅ Retrieve previous page from localStorage
		const previousPage = localStorage.getItem('previousPage');
		// console.log("🔄 Redirecting back to:", previousPage); // Debugging

		// ✅ Clean up (optional)
		localStorage.removeItem('previousPage');

		// ✅ Redirect back or go home (`/`)
		goto(previousPage || '/');
	});
</script>

<p>Processing login...</p>
