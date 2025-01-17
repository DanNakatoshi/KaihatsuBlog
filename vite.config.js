import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		// Optionally configure CSS handling if needed
	}
	//   build: {
	// 	rollupOptions: {
	// 	  output: {
	// 		manualChunks(id) {
	// 		  if (id.includes('lib/styles')) {
	// 			return 'wp-styles';
	// 		  }
	// 		},
	// 	  },
	// 	},
	//   },
});
