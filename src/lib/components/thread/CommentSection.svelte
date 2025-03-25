<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/api/supabaseClient.js';
	import { userMgr } from '$lib/store/userData.svelte';

	// Chadcn
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	// Icon
	import { Loader2 } from 'lucide-svelte';

	import { toast } from 'svelte-sonner'; // add this to your imports

	// Components
	// import CommentItem from '$lib/components/thread/CommentItem.svelte';

	let { articleId } = $props();
	let comments = $state([]);
	let content = $state('');
	let parentId = $state(null);
	let replyContentMap = $state({});
	let isSubmitting = $state(false);

	async function fetchComments() {
		const { data, error } = await supabase
			.from('comment_thread')
			.select(`
            *,
            user_profile: user_id (
            display_name
            )
            `)
			.eq('article_id', articleId)
			.order('created_at', { ascending: true });

		if (!error) {
			comments = data;
		}
	}

	function threaded(comments) {
		const map = {};
		comments.forEach((c) => (map[c.id] = { ...c, replies: [] }));
		const roots = [];

		for (const c of comments) {
			if (c.parent_id) {
				map[c.parent_id]?.replies.push(map[c.id]);
			} else {
				roots.push(map[c.id]);
			}
		}
		return roots;
	}

	async function submitComment({ content: submittedContent, parentId }) {
		if (!userMgr?.user?.id || !submittedContent.trim()) {
			toast.warning('コメントが空です');
			return;
		}

		isSubmitting = true; // ⛔ Disable buttons

		const { error } = await supabase.from('comment_thread').insert({
			article_id: articleId,
			content: submittedContent,
			parent_id: parentId ?? null,
			user_id: userMgr.user.id
		});

		if (error) {
			console.error('❌ コメント投稿エラー:', error.message);
			toast.error('コメントの投稿に失敗しました');
			isSubmitting = false;
			return;
		}

		toast.success('コメントを投稿しました');

		if (parentId === null) {
			content = '';
		} else {
			replyContentMap[parentId] = '';
		}

		parentId = null;
		await fetchComments();
		isSubmitting = false; // ✅ Re-enable buttons
	}

	onMount(fetchComments);
</script>

<div>
	{#if parentId === null}
		<div class="text-gray-dark mb-2 ml-2 mt-6 font-bold">記事にコメント</div>
		<div class="mb-4">
			<Textarea placeholder="コメントを書く..." bind:value={content} />
			<div class="my-2 flex justify-end">
				<Button
					size="xs"
					onclick={() => submitComment({ content, parentId: null })}
					disabled={isSubmitting}
				>
					<span class="px-2 py-1">
						{#if isSubmitting}
							<Loader2 size={24} stroke-width={2} class="animate-spin" />
						{:else}
							投稿
						{/if}
					</span></Button
				>
			</div>
		</div>
	{/if}

	<!-- New comment -->

	{#each threaded(comments) as comment (comment.id)}
		<Card.Root class="mt-2">
			<Card.Content>
				<div class="comment">
					<div class="text-sm font-medium">{comment?.author_display_name || '(deleted)'}</div>
					<div>{comment?.content}</div>
					<div class="text-xs">{new Date(comment?.created_at).toLocaleDateString()}</div>

					<!-- Replies -->
					{#each comment.replies as reply (reply.id)}
						<div class="comment ml-4 mt-2 border-l border-gray-200 pl-4">
							<div class="text-sm font-medium">{reply?.author_display_name || '(deleted)'}</div>
							<div class="whitespace-pre-wrap">{reply.content}</div>
							<div class="text-xs text-gray-400">
								{new Date(reply.created_at).toLocaleDateString()}
							</div>
						</div>
					{/each}

					<!-- Reply button -->
					{#if parentId !== comment.id}
						<Button
							class="ml-2"
							variant="link"
							size="xs"
							onclick={() => {
								parentId = comment.id;
								replyContentMap[comment.id] ??= '';
							}}
						>
							返信
						</Button>
					{/if}

					<!-- Reply box -->
					{#if parentId === comment.id}
						<div class="mt-4">
							<Textarea placeholder="返信を書く..." bind:value={replyContentMap[comment.id]} />
							<div class="mt-3 flex justify-end gap-2">
								<Button
									size="md"
									variant="ghost"
									onclick={() => {
										parentId = null;
										replyContentMap[comment.id] = '';
									}}
								>
									<span class="p-1"> キャンセル </span>
								</Button>
								<Button
									size="md"
									disabled={isSubmitting}
									onclick={() =>
										submitComment({
											content: replyContentMap[comment.id],
											parentId: comment.id
										})}
								>
									<span class="p-1">
										{#if isSubmitting}
											<Loader2 size={20} stroke-width={2} class="animate-spin" />
										{:else}
											返信する
										{/if}
									</span>
								</Button>
							</div>
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
