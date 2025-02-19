<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/api/supabaseClient';
	import { userMgr } from '$lib/store/userData.svelte.js';

	// onMount(async () => {
	// 	if (!data.session) {
	// 		console.warn('❌ No session found, forcing extraction from URL.');
	// 		await userMgr.extractSessionFromUrl(userMgr.session);
	// 		console.log();
	// 	} else {
	// 		console.log('✅ Session retrieved:', data.session);
	// 		await userMgr.fetchUser();
	// 	}
	// });

   onMount(()=>{
    userMgr.extractSessionFromUrl();
   })

</script>

<p>Processing login...</p>
