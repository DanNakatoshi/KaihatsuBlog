import { supabase } from '$lib/supabaseClient';

export async function addBookmark(userId, articleId) {
    const { data, error } = await supabase
        .from('bookmarks')
        .insert([{ user_id: userId, article_id: articleId }]);

    if (error) {
        console.error('ブックマークの追加に失敗:', error.message);
        return false;
    }
    return true;
}

/**
 * 記事のブックマークを解除する
 * @param {string} userId - ユーザーID
 * @param {string} articleId - 記事ID
 * @returns {Promise<boolean>} - 成功したらtrue, 失敗したらfalse
 */
export async function removeBookmark(userId, articleId) {
    const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', articleId);

    if (error) {
        console.error('ブックマークの削除に失敗:', error.message);
        return false;
    }
    return true;
}

/**
 * ユーザーが記事をブックマークしているかチェックする
 * @param {string} userId - ユーザーID
 * @param {string} articleId - 記事ID
 * @returns {Promise<boolean>} - ブックマーク済みならtrue, そうでなければfalse
 */
export async function isBookmarked(userId, articleId) {
    const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .eq('article_id', articleId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('ブックマークの確認に失敗:', error.message);
    }
    return !!data;
}
