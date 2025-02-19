import { browser } from '$app/environment'; // ✅ Only runs in the browser
import { supabase } from '$lib/api/supabaseClient';

function createUserData() {
    if (!browser) return null; // ✅ Prevents execution on the server

    let user = $state(null);
    let session = $state(null);

    async function fetchUser() {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            console.warn('❌ No active session found.');
            user = null;
            session = null;
            return;
        }

        user = data.session.user;
        session = data.session;
        console.log('✅ User:', user);
        console.log('✅ Session:', session);
    }

    async function signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: 'email profile openid',
            },
        });

        if (error) {
            console.error('❌ Login error:', error.message);
            return;
        }

        if (data?.url) {
            console.log("🔄 Redirecting to:", data.url);
            window.location.href = data.url;
        }
    }

    async function extractSessionFromUrl() {
        console.log("🔄 Attempting to exchange auth code for session...");
        
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
            console.error("❌ No auth code found in URL.");
            return;
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("❌ Failed to exchange code for session:", error.message);
            return;
        }

        console.log("✅ Session obtained:", data.session);
        await fetchUser();

        window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function signOut() {
        await supabase.auth.signOut();
        user = null;
        session = null;
    }

    return {
        get user() {
            return user;
        },
        signInWithGoogle,
        signOut,
        fetchUser,
        extractSessionFromUrl,
    };
}

// ✅ Only create userMgr on the client side
export const userMgr = browser ? createUserData() : null;
