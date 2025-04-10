<script>
	import '../app.css';
	import Header from '$lib/wireframe/Header.svelte';
	import { tagMgr, seriesMgr, articleMgr } from '$lib/store/articleData.svelte.js';
	import { categorizeCategories } from '$lib/store/articleData.svelte.js';

	// Shadcn
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';

	// Svelte
	import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// Store
	import { privacyDrawerManager } from '$lib/store/pageControl.svelte';
	import { supabase } from '$lib/api/supabaseClient';
	import { userMgr } from '$lib/store/userData.svelte.js';

	// Components
	import LoadingIcon from '$lib/components/ui/custom-spin-icon/LoadingIcon.svelte';
	import MobileMenu from '$lib/wireframe/MobileMenu.svelte';
	import UserLoginModal from '$lib/components/ui/custom-auth/UserLoginModal.svelte';

	let { children, data } = $props();

	// Set initial data for tags, series, and articles
	// tagMgr.setTagsData(data.tags);
	seriesMgr.setSeriesData(data.series);
	articleMgr.setArticleData(data.posts);

	let isOptedIn = $state(false);
	let gtagReady = false;
	let loadingToastId = null;

	let isOnArticlesPage = $state(false);

	onMount(async () => {
		// Fetch user session (only if not already loaded)
		const { data, error } = await supabase.auth.getSession();
		if (data.session) {
			await userMgr.fetchUser();
		}

		// Check previous user consent
		const consentGranted = localStorage.getItem('consentGranted');

		if (consentGranted === 'true') {
			isOptedIn = true;
			privacyDrawerManager.setDrawerState(false);
			loadGoogleAnalytics();
		} else if (consentGranted === 'false') {
			isOptedIn = false;
			privacyDrawerManager.setDrawerState(false);
		} else {
			// First-time visitors see the consent drawer
			privacyDrawerManager.setDrawerState(true);
		}
	});

	// Load GA dynamically after user consent
	function loadGoogleAnalytics() {
		if (gtagReady || typeof window === 'undefined') return; // Prevent duplicate loading

		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		window.gtag = gtag;

		gtag('consent', 'default', {
			ad_storage: 'denied',
			analytics_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied',
			wait_for_update: 500
		});

		const script = document.createElement('script');
		script.defer = true;
		script.src = 'https://www.googletagmanager.com/gtag/js?id=G-63G83HJJ0L';
		document.head.appendChild(script);

		script.onload = () => {
			gtag('js', new Date());
			gtag('config', 'G-63G83HJJ0L', {
				page_path: window.location.pathname,
				cookie_domain: 'auto', // ✅ ファーストパーティ Cookie にする
				cookie_flags: 'Secure; SameSite=None', 
				allow_google_signals: false, // ✅ Google Signals の無効化
				anonymize_ip: true // ✅ IPアドレスの匿名化
			});
			gtagReady = true;
		};
	}

	// Handle Consent Granted
	function handleConsentGranted() {
		if (!isOptedIn) {
			isOptedIn = true;
			localStorage.setItem('consentGranted', 'true');
			privacyDrawerManager.setDrawerState(false);
			loadGoogleAnalytics();
		}

		if (gtagReady && window.gtag) {
			window.gtag('consent', 'update', {
				ad_storage: 'granted',
				analytics_storage: 'granted',
				ad_user_data: 'granted',
				ad_personalization: 'granted'
			});
		}
	}

	// Handle Consent Denied
	function handleConsentDenied() {
		isOptedIn = false;
		localStorage.setItem('consentGranted', 'false');
		privacyDrawerManager.setDrawerState(false);

		if (gtagReady && window.gtag) {
			window.gtag('consent', 'update', {
				ad_storage: 'denied',
				analytics_storage: 'denied',
				ad_user_data: 'denied',
				ad_personalization: 'denied'
			});
		}
	}

	$effect(() => {
		isOnArticlesPage = $page.url.pathname.startsWith('/articles/');
	});

	beforeNavigate(() => {
		loadingToastId = toast('ページを読み込んでいます...', {
			duration: Infinity,
			icon: LoadingIcon
		});

	});

	// Track navigation only if user has consented
	afterNavigate((navigation) => {
		if (loadingToastId !== null && typeof loadingToastId !== 'undefined') {
			toast.dismiss(loadingToastId);
			// console.log('Toast dismissed successfully');
			loadingToastId = null;
		} else {
			// console.warn('Invalid toast ID, dismissing all toasts instead.');
			toast.dismiss();
		}

		if (gtagReady && isOptedIn && window.gtag) {
			window.gtag('config', 'G-63G83HJJ0L', {
				page_path: navigation.to?.pathname || window.location.pathname
			});
		}
	});
</script>

<!-- Layout -->
<div class="mb-4 sm:container ">
	<Header />
	<div class="pb-16">{@render children(data)}</div>
	{#if !isOnArticlesPage}
	<MobileMenu />
	{/if}
</div>

<!-- Toaster for mobile (hidden on md and larger) -->
<Toaster position="bottom-left" style="bottom: 4rem;" />

<UserLoginModal/>
<!-- Privacy Consent Drawer -->
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
					<li>ページビュー、滞在時間などのサイト利用状況</li>
					<li>デバイス情報（ブラウザ、OS）</li>
					<li>匿名化された IP アドレスに基づく地域情報</li>
				</ul>
				このデータは、サイトの改善やコンテンツ最適化のために使用されます。 同意しない場合、これらのデータは収集されません。
			</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Button onclick={handleConsentGranted}>はい、同意します</Button>
			<Button onclick={handleConsentDenied} variant="secondary">いいえ、同意しません</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
