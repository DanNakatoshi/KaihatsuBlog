// import { browser } from '$app/environment';
import { supabase } from '$lib/api/supabaseClient';
import { toast } from 'svelte-sonner';

function createUserData() {
	// if (!browser) return null;

	let user = $state(null);
	let session = $state(null);
	let bookmarks = $state([]);
	let userProfile = $state(null);
    
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

		await fetchUserProfile();
		await fetchBookmarks();

		// console.log('✅ User:', user);
	}

	async function fetchUserProfile() {
		if (!user) {
			userProfile = null;
			return;
		}

		try {
			const { data, error } = await supabase
				.from('user_profile')
				.select('*')
				.eq('user_id', user.id)
				.single(); // Fetch a single user profile

			if (error) {
				if (error.code === 'PGRST116') {
					console.warn('❌ User profile not found.');
				} else {
					console.error('❌ Error fetching user profile:', error.message);
				}
				userProfile = null;
				return;
			}

			userProfile = data;
			// console.log('✅ User profile fetched:', userProfile);
		} catch (error) {
			console.error('❌ Error fetching user profile:', error.message);
			userProfile = null;
		}
	}

	async function updateDisplayName(displayName) {
		if (!user) {
			console.warn('❌ User not logged in.');
			return;
		}

		try {
			const userId = user.id;

			const { data, error } = await supabase.from('user_profile').upsert(
				[{ user_id: userId, display_name: displayName }],
				{ onConflict: ['user_id'] } // ✅ Only update display_name, never touch user_id
			);

			if (error) throw error;

			toast.success('ユーザー名を更新しました！');
			await fetchUserProfile(); // Refresh user data
		} catch (error) {
			console.error('❌ Error updating display name:', error.message);
			toast.error('更新に失敗しました');
		}
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

		bookmarks = data.map((item) => item.post_id);
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
			bookmarks = bookmarks.filter((id) => id !== postId);
			toast.success('ブックマークを外しました');

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
			toast.success('ブックマークに追加しました');
		}
	}

	/*END BOOKMARK */

    async function signUpWithEmail(email, password) {
        try {
            // ✅ Check if email is already registered in Supabase Auth table
            const { data: exists, error: checkError } = await supabase
                .rpc('check_user_exists', { email_param: email });
    
            if (checkError) {
                if (checkError.message.includes("Could not find the function public.check_user_exists")) {
                    console.error('❌ システムエラー: `check_user_exists` 関数が見つかりません。');
                    toast.error('⚠️ メール確認エラー: システム設定に問題があります。管理者に連絡してください。');
                    return;
                }
    
                console.error('❌ ユーザー確認エラー:', checkError.message);
                toast.error(`❌ エラー: ${checkError.message}`);
                return;
            }
    
            if (exists) {
                toast.warning('⚠️ このメールアドレスはすでに登録されています。ログインしてください。');
                return;
            }
    
            // ✅ Proceed with sign-up if no existing user is found
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'https://asameshicode.com/auth/callback'
                }
            });
    
            if (error) {
                console.log(error);
                throw error;
            }
    
            toast.success('✅ 登録成功！メールを確認してください。');
            console.log('✅ Signup successful:', data);
    
            return data;
        } catch (error) {
            console.error('❌ Signup error:', error.message);
            toast.error(`❌ エラー: ${error.message}`);
        }
    }
    
    async function sendPasswordResetEmail(email) {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                emailRedirectTo: 'https://asameshicode.com/auth/reset-password'
            });
    
            if (error) {
                console.error('❌ パスワードリセットエラー:', error.message);
                toast.error(`❌ エラー: ${error.message}`);
                return;
            }
    
            toast.success('✅ パスワードリセットのメールを送信しました！');
            console.log('✅ Password reset email sent:', data);
        } catch (error) {
            console.error('❌ パスワードリセット処理中のエラー:', error.message);
            toast.error(`❌ エラー: ${error.message}`);
        }
    }
     
    async function resetPassword(newPassword) {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });
    
            if (error) {
                console.error('❌ パスワード変更エラー:', error.message);
                toast.error(`❌ エラー: ${error.message}`);
                return;
            }
    
            toast.success('✅ パスワードが正常に変更されました！');
            console.log('✅ Password updated:', data);
        } catch (error) {
            console.error('❌ パスワード変更処理中のエラー:', error.message);
            toast.error(`❌ エラー: ${error.message}`);
        }
    }
    
    async function loginWithEmail(email, password) {
        try {
            // ✅ Supabaseの認証APIを使用してログイン
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
    
            if (error) {
                console.error('❌ ログインエラー:', error.message);
                toast.error(`❌ エラー: ${error.message}`);
                return;
            }
    
            toast.success('✅ ログイン成功！');
            console.log('✅ Login successful:', data);
    
            return data;
        } catch (error) {
            console.error('❌ ログイン処理中のエラー:', error.message);
            toast.error(`❌ エラー: ${error.message}`);
        }
    }

    // Google Auth
	async function signInWithGoogle() {
		const previousUrl = window.location.href;
		localStorage.setItem('previousPage', previousUrl);

		// ✅ Ensure the redirect URL is correct
		const redirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/auth/callback`;
		console.log('VITE_PUBLIC_SITE_URL:', import.meta.env.VITE_PUBLIC_SITE_URL);

		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectUrl
			}
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

	supabase.auth.onAuthStateChange((event, sessionData) => {
		user = sessionData?.user || null;
		session = sessionData || null;

		if (event === 'SIGNED_IN') {
			toast.success('ログインしました');
		} else if (event === 'SIGNED_OUT') {
			toast.info('ログアウトしました');
		}
	});

	async function deleteAccount() {
		if (!user) {
			console.error('❌ No user is logged in.');
			return;
		}

		try {
			const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/delete-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
				},
				body: JSON.stringify({ userId: user.id })
			});

			if (!response.ok) {
				throw new Error(`Server error: ${await response.text()}`);
			}

			console.log('✅ User deleted successfully.');
			toast.info('アカウントの削除が完了しました');

			// await signOut();
			window.location.href = '/';
		} catch (error) {
			console.error('❌ Error deleting account:', error.message);
			toast.error('アカウントの削除でエラーが発生しました');
		}
	}

	// MobileMenu Functions
	function setNowReadingArticle(slug, seriesId) {
		if (!slug) return;

		const nowReadingData = {
			slug,
			seriesId: seriesId || null // Store `null` if seriesId is not provided
		};

		localStorage.setItem('nowReading', JSON.stringify(nowReadingData));
		console.log(`✅ Now reading set: ${JSON.stringify(nowReadingData)}`);
	}

	function getNowReadingArticle() {
		const data = localStorage.getItem('nowReading');
		return data ? JSON.parse(data) : null;
	}

	function clearNowReadingArticle() {
		localStorage.removeItem('nowReading');
		console.log('✅ Now reading cleared');
	}

	return {
		get user() {
			return user;
		},
		signInWithGoogle,
		signOut,
		fetchUser,
        // Email Auth
        signUpWithEmail,
        sendPasswordResetEmail,
        resetPassword,
        loginWithEmail,
		// Profile
		get userProfile() {
			return userProfile;
		},
		updateDisplayName,
		// BOOKMARK
		get bookmarks() {
			return bookmarks;
		},
		toggleBookmark,
		// ACCOUNT
		deleteAccount,
		setNowReadingArticle,
		getNowReadingArticle,
		clearNowReadingArticle
	};
}

// ✅ Create only on the client side
export const userMgr = createUserData();
