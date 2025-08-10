// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';
// import compression from 'vite-plugin-compression';

// export default defineConfig({
// 	plugins: [
// 		sveltekit(),

// 		compression({
// 			algorithm: 'gzip', // Use gzip compression
// 			ext: '.gz', // Generate .gz files
// 			deleteOriginFile: false // Keep original uncompressed files
// 		}),

// 		compression({
// 			algorithm: 'brotliCompress', // Use Brotli compression
// 			ext: '.br' // Generate .br files
// 		})
// 	],

// 	// css: {
// 	// 	preprocessorOptions: {
// 	// 		scss: { additionalData: `@import "src/styles/global.scss";` }
// 	// 	}
// 	// },

// 	build: {
// 		target: 'esnext', // Target modern browsers
// 		sourcemap: false, // ✅ Disable sourcemaps in production for better performance
// 		cssCodeSplit: true, // ✅ Optimize CSS (split & minify)
// 		minify: 'esbuild' // ✅ Use Vite's default, fast minification
// 	},

// 	server: {
// 		strictPort: true
// 	},

// 	preview: {
// 		allowedHosts: ['asameshicode.com'] 
// 	}
// });

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  plugins: [
    sveltekit(),
    !isVercel && compression({ algorithm: 'gzip', ext: '.gz', deleteOriginFile: false }),
    !isVercel && compression({ algorithm: 'brotliCompress', ext: '.br' })
  ].filter(Boolean),
  build: { target: 'esnext' }
});
