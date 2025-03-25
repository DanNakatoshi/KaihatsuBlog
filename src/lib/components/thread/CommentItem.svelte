<script>
	import { createEventDispatcher } from 'svelte';
	import CommentItem from '$lib/components/thread/CommentItem.svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { comment, parentId } = $props();
	let content = $state('');

	comment.replies = comment.replies ?? [];

	const dispatch = createEventDispatcher();

	function resetContent() {
		content = '';
	}
</script>

{#if comment}
	<Card.Root class="mt-2">
		<Card.Content>
            <!-- <div>コメント</div> -->
            <div class="comment ">
                <div class="text-sm font-medium">{'(deleted)'}</div>
                <div class="">{comment?.content}</div>
                <div class="text-xs ">{new Date(comment?.created_at).toLocaleDateString()}</div>
        
        
                <!-- Replies -->
                {#each comment.replies as reply (reply.id)}
                    <div class="comment ml-4 mt-2 border-l border-gray-200 pl-4">
                        <div class="text-sm font-medium">{reply?.author_display_name || '(deleted)'}</div>
                        <div class="whitespace-pre-wrap ">{reply.content}</div>
                        <div class="text-xs text-gray">{new Date(reply.created_at).toLocaleDateString()}</div>
                    </div>
                {/each}
                {#if !comment.parent_id}
                    <Button class="ml-2" variant="link" size="xs" onclick={() => dispatch('reply', comment.id)}>返信</Button>
                {/if}
        
                {#if parentId === comment.id}
                    <div class="mt-2">
                        <Textarea placeholder="返信を書く..." bind:value={content} />
        
                        <div class="mt-1 flex justify-end gap-2">
                            <Button size="md" variant="outline" onclick={() => dispatch('reply', null)}>
                                <span class="p-1">
                                    キャンセル
                                </span>
                            </Button>
        
                            <Button size="md"
                            
                                onclick={() =>
                                    dispatch('submit', { parentId: comment.id, content, reset: resetContent })}
                            >
                            <span class="p-1">
                                返信する
                            </span>
                            </Button>
                        </div>
                    </div>
                {/if}
            </div>
		</Card.Content>

	</Card.Root>

{/if}

<style>
	.comment {
		margin-top: 1rem;
	}
	.replies {
		margin-left: 1rem;
		border-left: 2px solid #ddd;
		padding-left: 1rem;
	}
</style>
