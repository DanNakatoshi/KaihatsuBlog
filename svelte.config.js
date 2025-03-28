import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options for the Node adapter
			out: 'build', // output directory
			precompress: false, // enable gzip precompression
			envPrefix: 'SVELTEKIT_' // environment variable prefix
		})
	}
};

export default config;
