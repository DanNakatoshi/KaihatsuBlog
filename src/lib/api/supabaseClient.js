import { supabase } from '$lib/api/supabaseClient';

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`, // ✅ Redirects after login
        },
    });

    if (error) {
        console.error('❌ Login error:', error.message);
        return;
    }

    if (data?.url) {
        window.location.href = data.url; // ✅ Redirect user
    }
}

async function signOut() {
    await supabase.auth.signOut();
    window.location.reload(); // Refresh to clear session
}

export { signInWithGoogle, signOut };
