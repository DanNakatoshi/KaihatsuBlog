<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { Bookmark, User, CalendarDays, SquarePen } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Button from '../button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	// import { Label } from '$lib/components/ui/label/index.js';

	// let createdAt = $state(null);
	let formattedDate = $state(null);
    let displayNameInput = $state(userMgr.userProfile?.display_name || "");
    let isEditing = $state(false);
    let isDisabled = $derived(displayNameInput.length < 3 || displayNameInput.length > 20);


    async function updateCreatedAt() {
        if (!userMgr?.user?.created_at) await userMgr.fetchUser();
        if (userMgr?.user?.created_at) {
            const date = new Date(userMgr.user.created_at);
            formattedDate = date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
    }

    function toggleEdit() {
        isEditing = !isEditing;
        displayNameInput = userMgr.userProfile?.display_name || "";
    }

	async function handleSubmit(e: Event) {
        e.preventDefault();
        await userMgr.updateDisplayName(displayNameInput);
        isEditing = false;
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
                    <User class="h-6 w-6 text-primary" />
                    <span class="text-lg font-bold">ユーザー名</span>
					<Button size="icon" variant="outline" onclick={toggleEdit} ><SquarePen size={12} /></Button>
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="flex justify-center text-3xl font-bold">
                    <!-- {#if userMgr.user}
                        {#if !userMgr.userProfile}
                            <p>プロフィールを完成させましょう！</p>
                        {/if}

                        {#if isEditing}
                            <form class="flex w-full max-w-sm items-center space-x-2" onsubmit={handleSubmit}>
                                <Input type="text" id="user_id" placeholder="ゲスト" bind:value={displayNameInput} />
                                <Button type="submit" disabled={isDisabled }>確定</Button>
                            </form>
                        {:else}
                            <span>{userMgr.userProfile?.display_name || "ゲスト"}</span>
                        {/if}
                    {/if} -->
					{#if userMgr.user}
                        {#if isEditing}
						<div class="flex flex-col ">

                            <form class="flex w-full max-w-sm items-center space-x-2" onsubmit={handleSubmit}>
                                <Input 
                                    type="text" 
                                    id="user_id" 
                                    placeholder="ゲスト" 
                                    bind:value={displayNameInput}
                                    class={displayNameInput.length > 20 || displayNameInput.trim().length < 3 ? 'border-red-500' : ''}
                                />
                                <Button type="submit" disabled={isDisabled}>確定</Button>
                            </form>

                            {#if displayNameInput.length > 20}
                                <p class="text-red-500 text-sm">名前は20文字以内で入力してください。</p>
                            {/if}
                            {#if displayNameInput.trim().length < 3}
                                <p class="text-red-500 text-sm">名前は3文字以上で入力してください。</p>
                            {/if}
						</div>

                        {:else}
                            <span>{userMgr.userProfile?.display_name || "ゲスト"}</span>
                        {/if}
                    {/if}
                </div>
            </Card.Content>
			
        </Card.Root>
    </div>

	<div class="col-span-12 sm:col-span-6">
		<Card.Root class="mx-auto max-w-sm">
			<Card.Header>
				<Card.Title class="flex items-center space-x-2">
					<Bookmark class="h-6 w-6 text-primary" />
					<span class="text-lg font-bold">メールアドレス</span>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex justify-center">
					<div class="text-3xl font-bold">
						{userMgr.user.email}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

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
					<CalendarDays class="h-6 w-6 text-primary" />
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
