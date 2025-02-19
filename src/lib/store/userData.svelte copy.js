// Supabase
import { supabase } from '$lib/api/supabaseClient';

function createUserData() {
	let user = $state(null);
	let session = $state(null);

	async function fetchUser() {
		const { data, error } = await supabase.auth.getSession();

		if (error || !data.session) {
			console.warn('No active session found.');
			user = null;
			session = null;
			return;
		}

		user = data.session.user;
		session = data.session;
		console.log('User:', user);
		console.log('Session:', session);
	}
	// async function fetchUser() {
	// 	let { data, error } = await supabase.auth.getSession();
		
	// 	if (error || !data.session) {
	// 		console.warn('❌ No active session found. Retrying...');
			
	// 		// Retry session retrieval after 500ms
	// 		await new Promise(resolve => setTimeout(resolve, 500));
	// 		({ data, error } = await supabase.auth.getSession());
	
	// 		if (!data.session) {
	// 			console.warn('❌ Still no session found.');
	// 			user = null;
	// 			session = null;
	// 			return;
	// 		}
	// 	}
	
	// 	user = data.session.user;
	// 	session = data.session;
	// 	console.log('✅ User:', user);
	// 	console.log('✅ Session:', session);
	// }
	

	// Googleログイン
	async function signInWithGoogle() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback` // 👈 Make sure this is correct
			}
		});

		if (error) {
			console.error('Login error:', error.message);
			return;
		}

		// ✅ Force session refresh after login
		setTimeout(async () => {
			const { data, error: refreshError } = await supabase.auth.refreshSession();
			if (refreshError) console.error('Session refresh failed:', refreshError.message);
			else console.log('🔄 Session refreshed:', data);
		}, 2000);
	}


	// async function signInWithGoogle() {
	// 	const { error } = await supabase.auth.signInWithOAuth({
	// 		provider: 'google',
	// 		options: {
	// 			redirectTo: `${window.location.origin}/auth/callback`,
	// 			scopes: 'email profile',
	// 			queryParams: {
	// 				access_type: 'offline', // Ensures refresh token is granted
	// 				prompt: 'consent' // Forces Google to return the code_verifier
	// 			}
	// 		}
	// 	});
	
	// 	if (error) console.error('❌ Login error:', error.message);
	// }
	


	// ログアウト
	async function signOut() {
		await supabase.auth.signOut();
		user = null;
		session = null;
	}

	// ✅ Extract session from URL after login
	async function extractSessionFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const access_token = urlParams.get("access_token");
		const refresh_token = urlParams.get("refresh_token");
		const code = urlParams.get("code");  // Extract the `code` parameter

		if (code) {
			console.log("🔄 Exchanging auth code for session...");
			const { data, error } = await supabase.auth.exchangeCodeForSession(code);
			if (error) {
				console.error("❌ Failed to exchange code for session:", error.message);
				return;
			}
			console.log("✅ Session obtained:", data.session);
		}
		
		console.log("✅ Extracted tokens:", { access_token, refresh_token, code });

		// If access_token and refresh_token are available, set the session
		if (access_token && refresh_token) {
			supabase.auth.setSession({ access_token, refresh_token })
				.then(({ data, error }) => {
					if (error) {
						console.error("❌ Session extraction error:", error.message);
					} else {
						console.log("✅ Session successfully set:", data.session);
					}
				});
		}

		// Cleanup URL to remove sensitive tokens from browser history
		window.history.replaceState({}, document.title, window.location.pathname);
	}

	// async function extractSessionFromUrl() {
	// 	const url = new URL(window.location.href);
	// 	const access_token = url.hash.match(/access_token=([^&]*)/)?.[1];
	// 	const refresh_token = url.hash.match(/refresh_token=([^&]*)/)?.[1];

	// 	if (!access_token || !refresh_token) {
	// 		console.warn('❌ No tokens found in URL.');
	// 		return;
	// 	}

	// 	console.log('✅ Extracted tokens:', { access_token, refresh_token });

	// 	const { data, error } = await supabase.auth.setSession({
	// 		access_token,
	// 		refresh_token
	// 	});

	// 	if (error) {
	// 		console.error('❌ Session extraction error:', error.message);
	// 		return;
	// 	}

	// 	console.log('✅ Session successfully set:', data.session);

	// 	// Cleanup URL
	// 	window.history.replaceState({}, document.title, window.location.pathname);
	// }

	// async function extractSessionFromUrl() {
	// 	const url = new URL(window.location.href);
	// 	const code = url.searchParams.get('code');

	// 	if (!code) {
	// 		console.warn('❌ No auth code found in URL.');
	// 		return;
	// 	}

	// 	console.log('🔄 Exchanging auth code for session...');

	// 	const { data, error } = await supabase.auth.exchangeCodeForSession(code);

	// 	if (error) {
	// 		console.error('❌ Failed to exchange code for session:', error);
	// 		return;
	// 	}

	// 	console.log('✅ Session obtained:', data.session);

	// 	// Now fetch user data
	// 	await fetchUser();
	// }

	// ✅ Listen for auth state changes (only in browser)
	if (typeof window !== 'undefined') {
		supabase.auth.onAuthStateChange((event, newSession) => {
			console.log(`Auth event: ${event}`, newSession);
			user = newSession ? newSession.user : null;
			session = newSession ?? null;
		});
	}

	// 初回実行時にユーザー情報を取得
	fetchUser();

	// BOOKMARK

	let bookmarks = $state([]);

	async function fetchBookmarks() {
		const { data, error } = await supabase
			.from('bookmarks_post')
			.select('post_id')
			.eq('user_id', user.id); // 自分のブックマークのみ取得
		if (!error) {
			bookmarks = data.map((b) => b.post_id); // `post_id` の配列を作成
		}
	}

	async function toggleBookmark(postId) {
		if (!user) {
			console.error('User not logged in');
			return;
		}

		// すでにブックマークされている場合は削除
		if (bookmarks.includes(postId)) {
			const { error } = await supabase
				.from('bookmarks_article')
				.delete()
				.eq('user_id', user.id)
				.eq('article_id', postId);

			if (!error) {
				bookmarks = bookmarks.filter((id) => id !== postId); // 配列から削除
			}
		} else {
			// 新規ブックマーク追加
			const { error } = await supabase.from('bookmarks_article').insert({
				article_id: postId,
				user_id: user.id
			});

			if (!error) {
				bookmarks = [...bookmarks, postId];
			}
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
		// BOOKMARK
		get bookmarks() {
			return bookmarks;
		},
		fetchBookmarks,
		toggleBookmark
	};
}

export const userMgr = createUserData();
