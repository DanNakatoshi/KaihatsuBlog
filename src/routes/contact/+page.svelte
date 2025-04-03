<script>
	import { userMgr } from '$lib/store/userData.svelte.js';
	import { loginModalManager } from '$lib/store/pageControl.svelte.js';
	// Chadcn
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
    import * as Select from "$lib/components/ui/select/index.js";


	let position = $state('bottom');
	let isShowForm = $state(false);

	let isReplyNeeded = $state(false);

	let formName = $state('');
	let formEmail = $state('');
	let formTitle = $state('');
	let formMessage = $state('');
    let formCategory = state('');
    
	$effect(() => {
		if (userMgr.user) {
			formName = userMgr?.userProfile?.display_name ?? '';
			formEmail = userMgr?.user?.email ?? '';
		}
	});

	const formCatList = [
    { value: "バグ報告", label: "バグ報告" },
    { value: "記事のリクエスト", label: "記事のリクエスト" },
    { value: "改善フィードバック", label: "改善フィードバック" },
    { value: "コラボ・お仕事のご相談", label: "コラボ・お仕事のご相談" },
    { value: "その他", label: "その他" }
  ];
    
  const triggerContent = $derived(
    formCatList.find((f) => f.value === value)?.label ?? "Select a fruit"
  );

	function handleSubmit() {
		console.log({
			name: formName,
			email: formEmail,
            category: formCategory,
			title: formTitle,
			message: formMessage,
			wantsReply: isReplyNeeded
		});
		// You can add Supabase insert or API call here!
	}
	// Logged in user use this
	// userMgr.user.email
	// userMgr.user.user_metadata
</script>

<!-- <div>
    Contact
</div> -->
<!-- {JSON.stringify(userMgr.userProfile.display_name)} -->
{#if !userMgr.user}
	<div class="flex flex-col items-center">
		<p>ログインして連絡した内容をサイトで簡単にトラッキングしよう。</p>
		<div>
			<Button onclick={() => loginModalManager.open()} class="">ログイン</Button>
			<Button variant="outline" onclick={() => (isShowForm = true)}>ゲストのまま連絡する</Button>
		</div>
		<p class="mt-4 text-sm text-gray-500">
			もしくはSNS経由でもご連絡いただけます：
			<a href="https://twitter.com/your_account" class="link">X / Twitter</a> /
		</p>
	</div>
{/if}

<!-- {JSON.stringify(userMgr.user)} -->

{#if isShowForm || userMgr.user}
	<div class="mx-auto mt-8 max-w-lg space-y-4">
		<h2 class="text-lg font-semibold">お問い合わせフォーム</h2>
		<Input type="text" placeholder="お名前" class="w-full" bind:value={formName} />
		<Input type="email" placeholder="メールアドレス" class="w-full" bind:value={formEmail} />
        {@render dropdownMenu()}
		<Input type="text" placeholder="タイトル" class="w-full" bind:value={formTitle} />
		<Textarea placeholder="詳細" class="w-full" bind:value={formMessage} />
		<div class="flex items-center space-x-2">
			<Checkbox id="isreply" bind:isReplyNeeded />
			<Label for="isreply" class="text-sm font-medium leading-none">
				返信を希望する場合はチェックをしてください。
			</Label>
		</div>
		<Button onclick={handleSubmit}>送信する</Button>
	</div>
{/if}


{#snippet dropdownMenu()}
<Select.Root type="single" name="favoriteFruit" bind:formCategory>
    <Select.Trigger class="w-[180px]">
      {triggerContent}
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.GroupHeading>Fruits</Select.GroupHeading>
        {#each fruits as fruit (fruit.value)}
          <Select.Item value={fruit.value} label={fruit.label} />
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
{/snippet}