import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { serialize } from 'cookie';

export function createSupabaseClient(event) {
    const headers = new Headers();

    return createServerClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
        cookies: {
            get(name) {
                return event.cookies.get(name);
            },
            set(name, value, options) {
                headers.append('Set-Cookie', serialize(name, value, { ...options, path: '/' }));
            }
        },
    });
}
