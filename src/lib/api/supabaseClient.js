import { createClient } from '@supabase/supabase-js';

// ✅ Load from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // ✅ Save session in localStorage
        autoRefreshToken: true, // ✅ Automatically refresh token
        detectSessionInUrl: true, // ✅ Handle OAuth redirects
    }
});
