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
        // ✅ Store the previous page before redirecting
        const previousUrl = window.location.href;
        localStorage.setItem('previousPage', previousUrl);

        // ✅ Redirect to Google login
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
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
    };
}

// ✅ Create only on the client side
export const userMgr = browser ? createUserData() : null;
