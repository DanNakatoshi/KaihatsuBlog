// import adapter from '@sveltejs/adapter-node';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		adapter: adapter({
// 			// default options for the Node adapter
// 			out: 'build', // output directory
// 			precompress: false, // enable gzip precompression
// 			envPrefix: 'SVELTEKIT_' // environment variable prefix
// 		})
// 	}
// };

// export default config;


import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // For standard Serverless Functions on Vercel:
    adapter: adapter({ runtime: 'nodejs20.x' })
    // If you want Edge Functions instead, use:
    // adapter: adapter({ runtime: 'edge' })
  }
};

export default config;
