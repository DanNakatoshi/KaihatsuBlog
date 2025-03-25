<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/api/supabaseClient.js';
	import { userMgr } from '$lib/store/userData.svelte';
	import { loginModalManager } from '$lib/store/pageControl.svelte.js';

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
	let editingCommentId = $state(null);
	let editContentMap = $state({});
	let deleteConfirmId = $state(null);

	async function fetchComments() {
		const { data, error } = await supabase
			.from('view_comment_thread')
			.select('*')
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

		if (submittedContent.length > 500) {
			toast.warning('コメントは500文字以内で入力してください');
			isSubmitting = false;
			return;
		}

		isSubmitting = true; // ⛔ Disable buttons

		const { error } = await supabase.from('comment_thread').insert({
			article_id: articleId,
			content: submittedContent,
			parent_id: parentId ?? null,
			fk_user_id: userMgr.user.id
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

	async function updateComment(commentId, newContent) {
		if (!newContent.trim()) {
			toast.warning('編集内容が空です');
			return;
		}

		isSubmitting = true;

		if (newContent.length > 500) {
			toast.warning('コメントは500文字以内で入力してください');
			isSubmitting = false;
			return;
		}

		const { error } = await supabase
			.from('comment_thread')
			.update({ content: newContent, is_edited: true })
			.eq('id', commentId);

		if (error) {
			toast.error('コメントの更新に失敗しました');
			console.error(error);
			isSubmitting = false;
			return;
		}

		toast.success('コメントを更新しました');
		editingCommentId = null;
		await fetchComments();
		isSubmitting = false;
	}

	async function deleteComment(commentId) {
		// const confirmDelete = confirm('本当にコメントを削除しますか？');
		// if (!confirmDelete) return;

		isSubmitting = true;

		const { error } = await supabase.from('comment_thread').delete().eq('id', commentId);

		if (error) {
			toast.error('コメントの削除に失敗しました');
			console.error(error);
			isSubmitting = false;
			return;
		}

		toast.success('コメントを削除しました');
		await fetchComments();
		isSubmitting = false;
	}

	onMount(fetchComments);
</script>

<div>
	{#if parentId === null}
		<div class="text-gray-dark mb-2 ml-2 mt-6 font-bold">記事にコメント</div>
		<div class="mb-4">
			<div>
				{userMgr?.userProfile?.display_name || 'ゲスト'}
			</div>
			<Textarea
				placeholder="コメントを書く..."
				bind:value={content}
				maxlength="500"
				onfocus={(e) => {
					if (!userMgr?.user) {
						e.target.blur(); // prevent typing
						loginModalManager.open();
					}
				}}
			/>
			{@render commentCounter(content)}
			{@render commentPolicy()}

			<div class="my-2 flex justify-end">
				<Button
					size="xs"
					onclick={() => submitComment({ content, parentId: null })}
					disabled={isSubmitting || content.length === 0}
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
					{@render editComment(comment)}

					<!-- Replies -->
					{#each comment.replies as reply (reply.id)}
						<div class="comment ml-4 mt-2 border-l border-gray-200 pl-4">
							{@render editComment(reply)}
						</div>
					{/each}

					<!-- Reply button -->
					{#if parentId !== comment.id && editingCommentId !== comment.id}
						<Button
							class="ml-2"
							variant="link"
							size="xs"
							onclick={() => {
								if (!userMgr?.user) {
									loginModalManager.open();
									return;
								}
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
							<Textarea
								placeholder="返信を書く..."
								bind:value={replyContentMap[comment.id]}
								maxlength="500"
							/>
							{@render commentCounter(replyContentMap[comment.id])}
							{@render commentPolicy()}

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

{#snippet editComment(comment)}
	{#if editingCommentId === comment.id}
		<Textarea bind:value={editContentMap[comment.id]} maxlength="500" />
		{@render commentCounter(editContentMap[comment.id])}
		{@render commentPolicy()}
		<div class="mt-2 flex justify-end gap-2">
			<Button
				size="xs"
				variant="ghost"
				onclick={() => {
					editingCommentId = null;
					deleteConfirmId = null;
				}}
			>
				<span class="px-2 py-1"> キャンセル </span>
			</Button>

			{#if deleteConfirmId === comment.id}
				<Button
					size="xs"
					variant="destructive"
					onclick={() => deleteComment(comment.id)}
					disabled={isSubmitting}
				>
					<span class="px-2 py-1">本当に削除しますか？</span>
				</Button>
			{:else}
				<Button size="xs" variant="destructive" onclick={() => (deleteConfirmId = comment.id)}>
					<span class="px-2 py-1">削除</span>
				</Button>
			{/if}

			<Button
				size="xs"
				onclick={() => updateComment(comment.id, editContentMap[comment.id])}
				disabled={isSubmitting}
			>
				<span class="px-2 py-1"> 保存 </span>
			</Button>
		</div>
	{:else}
		<div class="text-sm font-medium">{comment?.display_name || 'ゲスト'}</div>
		<div>
			{comment?.content}
			<span class="text-gray text-xs">{comment?.is_edited ? '(編集済み)' : ''}</span>
		</div>
		<div class="text-gray text-xs">{new Date(comment?.created_at).toLocaleDateString()}</div>
		{#if comment.is_owner && parentId !== comment.id}
			<Button
				size="xs"
				variant="link"
				onclick={() => {
					editingCommentId = comment.id;
					editContentMap[comment.id] = comment.content;
				}}
			>
				<span class="px-2 py-1"> 編集 </span>
			</Button>
		{/if}
	{/if}
{/snippet}

{#snippet commentPolicy()}
	<div class="flex flex-wrap justify-center text-xs">
		誹謗中傷や公序良俗に反するコメントは削除される場合があり、悪質な場合はアカウントの停止などの措置を取ることがあります。
	</div>
{/snippet}

{#snippet commentCounter(content)}
	<div class="text-right text-xs text-gray-500">{content?.length}/500</div>
{/snippet}
