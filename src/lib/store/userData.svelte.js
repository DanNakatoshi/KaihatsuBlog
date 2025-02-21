import { browser } from '$app/environment'; 
import { supabase } from '$lib/api/supabaseClient';

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
            console.log(`✅ Bookmark removed for post ID: ${postId}`);
        } else {
            // ✅ Add bookmark
            const { error } = await supabase
                .from('bookmarks_post')
                .insert([{ user_id: user.id, post_id: postId }]);
    
            if (error) {
                console.error('❌ Error adding bookmark:', error.message);
                return;
            }
    
            // ✅ Update local state
            bookmarks = [...bookmarks, postId];
            console.log(`✅ Bookmark added for post ID: ${postId}`);
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
    supabase.auth.onAuthStateChange((event, sessionData) => {
        console.log(`🔄 Auth event: ${event}`);
        user = sessionData?.user || null;
        session = sessionData || null;
    });


    async function deleteAccount() {
        if (!user) {
            console.error("❌ No user is logged in.");
            return;
        }
    
        try {
            const { error } = await supabase.rpc('delete_user_account');
            if (error) {
                throw new Error(`Function Error: ${error.message}`);
            }
    
            console.log("✅ User deleted successfully.");
            await signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("❌ Error deleting account:", error.message);
        }
    }

    // async function deleteAccount() {
    //     if (!user) {
    //         console.error("❌ No user is logged in.");
    //         return;
    //     }
    
    //     const userId = user.id;
    //     console.log(`🗑 Deleting user: ${userId}`);
    
    //     try {
    //         // ✅ Step 1: Delete all user-related data (bookmarks, comments, etc.)
    //         // await deleteUserData(userId);
    
    //         // ✅ Step 2: Delete user from Supabase Auth (requires admin access)
    //         const { error } = await supabase.auth.admin.deleteUser(userId);
    //         if (error) {
    //             throw new Error(`Supabase Auth Deletion Error: ${error.message}`);
    //         }
    
    //         console.log("✅ User deleted successfully.");
    
    //         // ✅ Step 3: Sign out user and reset state
    //         await signOut();
    
    //         // ✅ Step 4: Refresh UI
    //         window.location.href = "/";
    //     } catch (error) {
    //         console.error("❌ Error deleting account:", error.message);
    //     }
    // }

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
