<!-- 
<script>
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
    // import { userMgr } from '$lib/store/userData.svelte';
	import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';
</script> -->

<script lang="ts">
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger> <!-- ✅ No extra <button> wrapping -->
		Open
	</AlertDialog.Trigger>
	<AlertDialog.Portal> <!-- ✅ Ensure correct placement -->
		<AlertDialog.Content class="p-4 bg-white shadow-lg rounded-lg w-96">
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete your account
					and remove your data from our servers.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer class="flex justify-end gap-2">
				<AlertDialog.Cancel class="btn btn-secondary">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action class="btn btn-primary">Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
