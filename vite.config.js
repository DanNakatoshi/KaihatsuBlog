
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		sveltekit(),
		compression({
			algorithm: 'gzip', // Gzip 圧縮の設定
			ext: '.gz', // 作成される圧縮ファイルの拡張子
			deleteOriginFile: false // 元のファイルを削除せず保持する
		}),
		compression({
			algorithm: 'brotliCompress', // Brotli 圧縮の設定
			ext: '.br' // 作成される圧縮ファイルの拡張子
		})
	],
	css: {
		// 必要に応じて CSS の設定を追加
	},
	build: {
		target: 'esnext', // モダンブラウザ向けの出力設定
		sourcemap: true // デバッグ用にソースマップを有効化
	}
});
