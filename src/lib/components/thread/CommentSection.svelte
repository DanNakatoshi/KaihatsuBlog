<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/api/supabaseClient.js';
    import { userMgr } from '$lib/store/userData.svelte';
    import CommentItem from './CommentItem.svelte';
  
    let { articleId } = $props() ;
  
    let comments = $state([]);
    let content = $state('');
    let parentId = null;
  
    async function fetchComments() {
      const { data, error } = await supabase
        .from('comment_thread')
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
  
    async function postComment() {
      if (!userMgr.user_id || !content.trim()) return;
  
      const { error } = await supabase.from('comment_thread').insert({
        article_id: articleId,
        content,
        parent_id: parentId,
        user_id: userMgr.user_id,
        author_display_name: userMgr.display_name ?? null
      });
  
      if (!error) {
        content = '';
        parentId = null;
        await fetchComments();
      }
    }
  
    onMount(fetchComments);
  </script>
  
  <style>
    .comment { margin-top: 1rem; }
    .replies { margin-left: 1rem; border-left: 2px solid #ddd; padding-left: 1rem; }
  </style>
  
  <div>
    <h3 class="text-lg font-semibold mb-2">Comments</h3>
  
    <!-- New comment -->
    <div class="mb-4">
      <textarea bind:value={content} placeholder="Write a comment..." rows="3" class="w-full p-2 border rounded" />
      <button on:click={postComment} class="mt-2 px-3 py-1 bg-blue-600 text-white rounded">
        {parentId ? 'Reply' : 'Post'}
      </button>
      {#if parentId}
        <button on:click={() => (parentId = null)} class="ml-2 text-sm text-gray-500">Cancel reply</button>
      {/if}
    </div>
  
    <!-- Render threaded comments -->
    {#each threaded(comments) as comment (comment.id)}
      <CommentItem {comment} on:reply={(e) => (parentId = e.detail)} />
    {/each}
  </div>
  