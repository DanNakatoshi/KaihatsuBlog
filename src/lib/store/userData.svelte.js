import { browser } from '$app/environment';
import { supabase } from '$lib/api/supabaseClient';

function createUserData() {
    if (!browser) return null; // ✅ Prevents execution on the server

    let user = $state(null);
    let session = $state(null);

    async function fetchUser() {
        console.log("🔄 Checking for an active session...");
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
            console.warn('❌ No active session found. Checking URL for auth code...');
            await extractSessionFromUrl(); // ✅ Only extract session if necessary
            return;
        }

        user = data.session.user;
        session = data.session;
        console.log('✅ User:', user);
        console.log('✅ Session:', session);

        localStorage.setItem("supabase_user", JSON.stringify(user));
        localStorage.setItem("supabase_session", JSON.stringify(session));
    }

    async function signInWithGoogle() {
        const codeVerifier = generateCodeVerifier();
        sessionStorage.setItem("supabase_code_verifier", codeVerifier); // Store it before redirect
    
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: "email profile openid",
            },
        });
    
        if (error) {
            console.error("❌ Login error:", error.message);
            return;
        }
    
        if (data?.url) {
            console.log("🔄 Redirecting to:", data.url);
            window.location.href = data.url;
        }
    }
    
    // Helper function to generate a secure random string (for PKCE)
    function generateCodeVerifier() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode.apply(null, array))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
    

    async function extractSessionFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get("code");
    
        if (!authCode) {
            console.warn("⚠️ No `code` found in URL. Skipping session extraction.");
            return;
        }
    
        const codeVerifier = sessionStorage.getItem("supabase_code_verifier"); // Retrieve stored code_verifier
    
        if (!codeVerifier) {
            console.error("❌ No `code_verifier` found in sessionStorage.");
            return;
        }
    
        console.log("🔄 Exchanging auth code for session with PKCE...");
        const { data, error } = await supabase.auth.exchangeCodeForSession(authCode, codeVerifier);
    
        if (error) {
            console.error("❌ Failed to exchange code for session:", error.message);
            return;
        }
    
        console.log("✅ Session obtained:", data.session);
        await fetchUser();
    
        // ✅ Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    

    async function signOut() {
        await supabase.auth.signOut();
        user = null;
        session = null;
        localStorage.removeItem("supabase_user");
        localStorage.removeItem("supabase_session");
    }

    if (browser) {
        const storedUser = localStorage.getItem("supabase_user");
        const storedSession = localStorage.getItem("supabase_session");

        if (storedUser && storedSession) {
            user = JSON.parse(storedUser);
            session = JSON.parse(storedSession);
            console.log("✅ Restored user from localStorage:", user);
        } else {
            fetchUser(); // ✅ 初回ロード時にセッションを確認
        }
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

export const userMgr = browser ? createUserData() : undefined;
