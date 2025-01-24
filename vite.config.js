import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import { resolve } from 'path';

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
		sourcemap: true, // デバッグ用にソースマップを有効化
		outDir: resolve(__dirname, 'static'), // ビルド出力先を `static` に設定
		rollupOptions: {
			output: {
				// ファイル構造を調整
				entryFileNames: '_app/immutable/entry/[name].js',
				chunkFileNames: '_app/immutable/chunks/[name].js',
				assetFileNames: '_app/immutable/assets/[name][extname]'
			}
		}
	},
	publicDir: resolve(__dirname, 'static') // 静的ファイルのディレクトリ設定
});
