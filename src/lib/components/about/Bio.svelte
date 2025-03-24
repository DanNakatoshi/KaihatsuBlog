<script>
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<Card.Root>
	<Card.Content>
		<div class="grid grid-cols-12 gap-2">
			<div class="col-span-12 flex flex-col items-center pb-1 sm:col-span-3">
				<h2 class="pb-2 font-bold">Dan ( ダン ) </h2>
                <div class="h-24 w-24 sm:h-auto sm:w-auto rounded-full overflow-hidden">
					<img
						src="https://avatars.githubusercontent.com/u/60120881?s=400&u=71d5c5f09a272176db450cfaa96d6a2333c46b3a&v=4"
						alt="Avatar"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
			<div class="col-span-12 sm:col-span-9 text-sm">
					管理人のDanです。25歳の時に渡米し、ニューヨーク、ハワイ、シアトル、フィラデルフィアでそれぞれ1年ずつ暮らしました。現在はNYC近郊で、嫁と2匹のチワワと一緒に暮らしています。
					このブログでは、主にウェブ開発やアメリカでの生活について発信しています。また、このサイトはオープンソースのSvelteを使って構築しました。興味があればぜひチェックしてみてください。
				<div class="mt-1">
					<a
						href="https://github.com/DanNakatoshi?tab=repositories"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							size="xs"
							class="rounded-md bg-gray-800 p-1 text-xs text-white hover:bg-gray-900 focus:ring-4 focus:ring-gray-400"
						>
							GitHub
						</Button>
					</a>でオープンソースのプロジェクトを紹介しています。
					<a
						href="https://www.youtube.com/channel/UCiVt4Mcnog4KBEOALesuu1g"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button
							size="xs"
							class="rounded-md bg-red-600 p-1 text-xs text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300"
						>
							YouTube
						</Button>
					</a>で動画を見てくれると支えになります。
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>


