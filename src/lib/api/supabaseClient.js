import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';

// ✅ 環境変数から Supabase の URL とキーを取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ クライアントサイドのストレージを使用
const customStorageAdapter = {
    getItem: (key) => browser ? localStorage.getItem(key) : null,
    setItem: (key, value) => browser && localStorage.setItem(key, value),
    removeItem: (key) => browser && localStorage.removeItem(key),
};

// ✅ Supabase クライアントの作成（PKCE を有効化）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,  // ✅ セッションを維持
        autoRefreshToken: true,  // ✅ 自動でトークンを更新
        detectSessionInUrl: true,  // ✅ OAuth のリダイレクト URL を処理
        flowType: "pkce", 
        storage: customStorageAdapter,  // ✅ ローカルストレージを使用
    }
});
