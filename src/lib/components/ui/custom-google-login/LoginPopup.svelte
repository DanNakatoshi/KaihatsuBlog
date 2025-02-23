<script >
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';
    import { Bookmark } from 'lucide-svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger><Bookmark/></Dialog.Trigger>
	<Dialog.Content>
        Googleでサインインしてブックマーク機能やコメント機能を使ってみましょう!
        <div class="flex justify-center">
            <GoogleSigninBtn/>
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
