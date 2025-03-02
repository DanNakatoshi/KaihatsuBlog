<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark, User } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let createdAt = $state(null);
	let formattedDate = $state(null);

	async function updateCreatedAt() {
		if (!userMgr?.user?.created_at) {
			await userMgr.fetchUser();
		}
		if (userMgr?.user?.created_at) {
			createdAt = new Date(userMgr.user.created_at);
			formattedDate = createdAt.toLocaleDateString('ja-JP', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});
		}
	}

	onMount(() => {
		updateCreatedAt();
	});
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-12 sm:col-span-6">
		<Card.Root class="mx-auto max-w-sm">
			<Card.Header>
				<Card.Title class="flex items-center space-x-2">
					<Bookmark class="h-6 w-6 text-primary" />
					<span class="text-lg font-bold">ブックマーク</span>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex justify-center">
					<div class="text-3xl font-bold">
						{userMgr?.bookmarks?.length || 0}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Member Since Card -->
	<div class="col-span-12 sm:col-span-6">
		<Card.Root class="mx-auto max-w-sm">
			<Card.Header>
				<Card.Title class="flex items-center space-x-2">
					<User class="h-6 w-6 text-primary" />
					<span class="text-lg font-bold">メンバーになった日</span>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex justify-center">
					<div class="text-3xl font-bold">
						{formattedDate ? formattedDate : '---'}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
