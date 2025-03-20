<script>
    import { userMgr } from '$lib/store/userData.svelte.js';
    
	let googleSignInImage = $state('/google/signin_light.svg');

</script>


<button onclick={() => userMgr.signInWithGoogle()} class="google-signin">
    <img src={googleSignInImage} alt="Sign in with Google" loading="lazy"/>
</button>