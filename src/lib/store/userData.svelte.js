import { browser } from '$app/environment'; 
import { supabase } from '$lib/api/supabaseClient';
import { toast } from "svelte-sonner";

function createUserData() {
    if (!browser) return null; 

    let user = $state(null);
    let session = $state(null);
    let bookmarks = $state([]); 

    async function fetchUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.warn('❌ No active user session found.');
            user = null;
            session = null;
            return;
        }
        user = data.user;
        session = await supabase.auth.getSession();
        await fetchBookmarks(); 

        // console.log('✅ User:', user);
    }


    /* BOOKMARK */
    async function fetchBookmarks() {
        if (!user) return;

        const { data, error } = await supabase
            .from('bookmarks_post')
            .select('post_id')
            .eq('user_id', user.id);

        if (error) {
            console.error('❌ Error fetching bookmarks:', error.message);
            return;
        }

        bookmarks = data.map(item => item.post_id);
    }


    async function toggleBookmark(postId) {
        if (!user) {
            console.warn('❌ User not logged in.');
            return;
        }
    
        const isBookmarked = bookmarks.includes(postId);
    
        if (isBookmarked) {
            // ✅ Remove bookmark
            const { error } = await supabase
                .from('bookmarks_post')
                .delete()
                .match({ user_id: user.id, post_id: postId });
    
            if (error) {
                console.error('❌ Error removing bookmark:', error.message);
                return;
            }
    
            // ✅ Update local state
            bookmarks = bookmarks.filter(id => id !== postId);
            toast.success("ブックマークを外しました")

            console.log(`✅ Bookmark removed for post ID: ${postId}`);
        } else {
            // ✅ Add bookmark
            const { error } = await supabase
                .from('bookmarks_post')
                .insert([{ user_id: user.id, post_id: postId }]);
    
            if (error) {
                console.error('❌ Error adding bookmark:', error.message);
                toast.error('ブックマークの追加でエラーになりました');

                return;
            }
    
            // ✅ Update local state
            bookmarks = [...bookmarks, postId];
            console.log(`✅ Bookmark added for post ID: ${postId}`);
            toast.success("ブックマークに追加しました")
        }
    }
    

    /*END BOOKMARK */


    async function signInWithGoogle() {
        const previousUrl = window.location.href;
        localStorage.setItem('previousPage', previousUrl);
    
        // ✅ Ensure the redirect URL is correct
        const redirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/auth/callback`;
        console.log("VITE_PUBLIC_SITE_URL:", import.meta.env.VITE_PUBLIC_SITE_URL);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        });
    
        if (error) {
            console.error('❌ Login error:', error.message);
        }
    }
    

    async function signOut() {
        await supabase.auth.signOut();
        user = null;
        session = null;
        bookmarks = [];
    }

    // ✅ Automatically update user session when authentication state changes
    // supabase.auth.onAuthStateChange((event, sessionData) => {
    //     // console.log(`🔄 Auth event: ${event}`);
    //     user = sessionData?.user || null;
    //     session = sessionData || null;
    // });

    supabase.auth.onAuthStateChange((event, sessionData) => {
        user = sessionData?.user || null;
        session = sessionData || null;

        if (event === "SIGNED_IN") {
            toast.success("ログインしました");
        } else if (event === "SIGNED_OUT") {
            toast.info("ログアウトしました");
        }
    });


    async function deleteAccount() {
        if (!user) {
            console.error("❌ No user is logged in.");
            return;
        }
    
        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/delete-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({ userId: user.id }),
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${await response.text()}`);
            }
    
            console.log("✅ User deleted successfully.");
            toast.info("アカウントの削除が完了しました")

            // await signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("❌ Error deleting account:", error.message);
            toast.error("アカウントの削除でエラーが発生しました")

        }
    }
    
    
    
    return {
        get user() {
            return user;
        },
        signInWithGoogle,
        signOut,
        fetchUser,
        // BOOKMARK
        get bookmarks() {
            return bookmarks;
        },
        toggleBookmark,
        // ACCOUNT
        deleteAccount,
    };
}

// ✅ Create only on the client side
export const userMgr = browser ? createUserData() : null;
