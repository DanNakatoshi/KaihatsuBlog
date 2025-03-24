<script>  
    import { createEventDispatcher } from 'svelte';

     let { comment } = $props();

    const dispatch = createEventDispatcher();
    
  </script>
  
  <div class="comment">
    <div class="text-sm font-medium">{comment.author_display_name || '(deleted)'}</div>
    <div class="text-gray-800">{comment.content}</div>
    <div class="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</div>
    <button class="text-xs text-blue-600" onclick={() => dispatch('reply', comment.id)}>Reply</button>
  
    {#if comment.replies.length}
      <div class="replies">
        {#each comment.replies as reply}
          <CommentItem comment={reply} on:reply={(e) => dispatch('reply', e.detail)} />
        {/each}
      </div>
    {/if}
  </div>
  