<script>
	// Chadcn
	import { Separator } from '$lib/components/ui/separator';

	// ICONS
	import { Menu, X } from 'lucide-svelte';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	// Theme color switcher
	import { toggleMode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button';
	import { ICON_SIZES } from '$lib/config.js';
	import { goto } from '$app/navigation';

	// Svelte
	import { onMount } from 'svelte';

	// Google Auth
	import { userMgr } from '$lib/store/userData.svelte.js';

	// components
	// import GoogleSigninBtn from '$lib/components/ui/custom-google-login/GoogleSigninBtn.svelte';
	// import UserLoginModal from '$lib/components/ui/custom-auth/UserLoginModal.svelte';
	import { loginModalManager } from '$lib/store/pageControl.svelte.js';

	// let user = $state(userMgr?.user || null);
	let isMenuOpen = $state(false);

	function closeMenu() {
		isMenuOpen = false;
	}

	let currentTheme = $state('light'); // Default theme before hydration

	function toggleTheme() {
		const isDark = document.documentElement.classList.contains('dark');
		if (isDark) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
			currentTheme = 'light';
		} else {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
			currentTheme = 'dark';
		}
	}

	onMount(() => {
		const storedTheme = localStorage.getItem('theme') || 'light';
		currentTheme = storedTheme;
		document.documentElement.classList.toggle('dark', storedTheme === 'dark');
	});
</script>

<!-- Menu Overlay -->
{#if isMenuOpen}
	<button
		class="fixed inset-0 z-10 bg-black bg-opacity-50"
		onclick={closeMenu}
		aria-label="close menu"
	></button>
{/if}

<header>
	<div class="flex items-center justify-between p-2">
		<Button size="sm" onclick={() => (isMenuOpen = true)} aria-label="Menu">
			<Menu size={ICON_SIZES.SMALL} />
		</Button>
		<Button variant="ghost" onclick={() => goto('/')} aria-label="Home">
			<span class="font-extrabold">あさめしコード</span>
		</Button>

		<div class="flex items-center gap-2">
			<Button onclick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
			</Button>
		</div>
	</div>
</header>

<div
	class={`primary fixed left-0 top-0 z-20 h-full w-64 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
	style="background-color: hsl(var(--secondary));"
>
	<div class="relative p-4">
		<Button
			variant="ghost"
			size="sm"
			class="absolute right-2 top-2 rounded-full"
			aria-label="close menu"
			onclick={closeMenu}><X size="12" strokeWidth={6} /></Button
		>
		<div class="mt-8 flex flex-col items-start gap-3">
			<Button
				class="w-full max-w-full"
				onclick={() => {
					goto('/');
					closeMenu();
				}}>ホーム</Button
			>
			<Button
				class="w-full max-w-full"
				onclick={() => {
					goto('/about');
					closeMenu();
				}}>サイト紹介</Button
			>
			<Button
				class="w-full max-w-full"
				onclick={() => {
					goto('/siteupdates');
					closeMenu();
				}}>サイト更新情報</Button
			>

			<Button
				class="w-full max-w-full"
				onclick={() => {
					goto('/contact');
					closeMenu();
				}}>コンタクト</Button
			>
			<Separator />

			<!-- ✅ Google Auth (Only if userMgr exists) -->
			{#if userMgr?.user}
				<div class="flex w-full flex-col items-center justify-center gap-2">
					<Button
						class="w-full max-w-full"
						onclick={() => {
							goto('/account');
							closeMenu();
						}}>プロフィール</Button
					>

					<Button
						variant="outline"
						onclick={() => {
							userMgr.signOut();
							closeMenu();
						}}
						class="w-full max-w-full"
					>
						<span>ログアウト</span>
					</Button>
				</div>
			{:else}
				<div class="flex w-full items-center justify-center">
					<!-- <GoogleSigninBtn /> -->
					<Button onclick={() => loginModalManager.open()} class="w-full">ログイン</Button>

					<!-- <UserLoginModal/> -->
				</div>
			{/if}

			<Separator />

			<Button
				variant="link"
				class="text-xs"
				onclick={() => {
					goto('/privacypolicy');
					closeMenu();
				}}
			>
				プライバシーポリシー
			</Button>
		</div>
	</div>
</div>
