<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';

	// Shadcn
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';

	// Svelte
	import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	// Store
	import { privacyDrawerManager } from '$lib/store/pageContorol.svelte';

	// User (Supabase)
	import { browser } from '$app/environment';
	import { supabase } from '$lib/api/supabaseClient';
	// import { userMgr } from '$lib/store/userData.svelte.js';

	// Props
	let { children, data } = $props();

	// State
	tagMgr.setTagsData(data.tags);
	seriesMgr.setSeriesData(data.series);
	articleMgr.setArticleData(data.posts);

	let isOptedIn = $state(false);
	let gtagReady = $state(false);
	let isNavigating = $state(false); // ページ遷移中の状態を管理

	// Google Analytics & Auth Initialization
	onMount(async () => {
		// ✅ Ensure this only runs in the browser
		if (!browser) return;

		// 🔄 ページ遷移が始まったら読み込み状態を有効にする
		beforeNavigate(() => {
			isNavigating = true;
		});

		// ✅ Google Analytics Setup
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			window.dataLayer.push(arguments);
		}
		window.gtag = gtag;

		// 🔧 Set default consent
		gtag('consent', 'default', {
			ad_storage: 'denied',
			analytics_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
			wait_for_update: 500
		});

		// ✅ Load Google Analytics script
		const script = document.createElement('script');
		script.async = true;
		script.src = 'https://www.googletagmanager.com/gtag/js?id=G-63G83HJJ0L';
		document.head.appendChild(script);

		// ✅ Set `gtagReady` to true after script loads
		script.onload = () => {
			gtag('js', new Date());
			gtag('config', 'G-63G83HJJ0L', {
				page_path: window.location.pathname
			});
			gtagReady = true;
		};

		// ✅ Check consent state
		const consentGranted = localStorage.getItem('consentGranted');
		if (consentGranted === 'true') {
			isOptedIn = true;
			privacyDrawerManager.setDrawerState(false);
			handleConsentGranted();
		} else if (consentGranted === 'false') {
			isOptedIn = false;
			privacyDrawerManager.setDrawerState(false);
			handleConsentDenied();
		} else {
			privacyDrawerManager.setDrawerState(true);
		}

		// ✅ Supabase Authentication Handling
		// if (userMgr) {
		// 	const { data } = await supabase.auth.getSession();

		// 	if (!data.session) {
		// 		console.warn('❌ No session found, forcing extraction from URL.');
		// 		await userMgr.extractSessionFromUrl();
		// 	} else {
		// 		console.log('✅ Session retrieved:', data.session);
		// 		await userMgr.fetchUser();
		// 	}
		// }

		console.log('✅ Supabase Session:', supabase.auth.getSession());
	});

	// 🔄 ページ遷移が完了したら読み込み状態を無効にする
	afterNavigate((navigation) => {
		isNavigating = false;

		if (gtagReady && isOptedIn) {
			window.gtag('config', 'G-63G83HJJ0L', {
				page_path: navigation.to?.pathname || window.location.pathname
			});
		}
	});

	// ✅ Consent Actions
	function handleConsentGranted() {
		if (gtagReady) {
			isOptedIn = true;
			privacyDrawerManager.setDrawerState(false);
			localStorage.setItem('consentGranted', 'true');
			window.gtag('consent', 'update', {
				ad_storage: 'granted',
				analytics_storage: 'granted',
				ad_user_data: 'granted',
				ad_personalization: 'granted'
			});
		}
	}

	function handleConsentDenied() {
		if (gtagReady) {
			isOptedIn = false;
			privacyDrawerManager.setDrawerState(false);
			localStorage.setItem('consentGranted', 'false');
			window.gtag('consent', 'update', {
				ad_storage: 'denied',
				analytics_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied'
			});
		}
	}
</script>

<!-- UI -->
<div class="mb-4 sm:container">
	<!-- 🔄 読み込み中のアイコン -->
	{#if isNavigating}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
			aria-live="polite"
			role="status"
		>
			<div class="flex flex-col items-center">
				<div
					class="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent"
				></div>
				<p class="mt-4 text-white">ページを読み込んでいます...</p>
			</div>
		</div>
	{/if}

	<!-- Header -->
	<Header />
	
	<!-- Main Content -->
	<div class="">
		{@render children(data)}
	</div>
</div>

<!-- Google Analytics Consent Drawer -->
<Drawer.Root
	bind:open={privacyDrawerManager.isDrawerOpen}
	dismissible={false}
	closeOnEscape={false}
>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Google Analytics の使用に同意しますか？</Drawer.Title>
			<Drawer.Description>
				Google Analytics を使用して、以下の情報を収集・分析します:
				<ul class="mt-2 list-inside list-disc text-left">
					<li>ウェブサイトの利用状況（ページビュー、滞在時間など）</li>
					<li>デバイス情報（ブラウザ、OSなど）</li>
					<li>IPアドレスに基づく地域情報（匿名化済み）</li>
					<li>広告のパフォーマンスデータ（クリック数、コンバージョンなど）</li>
				</ul>
				このデータは、サービスの改善およびコンテンツの最適化に使用されます。同意しない場合は、これらのデータは収集されません。
			</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Button onclick={handleConsentGranted}>はい、同意します</Button>
			<Button onclick={handleConsentDenied} variant="secondary">いいえ、同意しません</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<!-- CSS -->
<style>
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
