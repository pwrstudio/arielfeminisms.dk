import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import babel from '@rollup/plugin-babel';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
			// extract component CSS out into a separate file
			emitCss: true,
			preprocess: sveltePreprocess()
		}),
		
		// Extract component CSS into a separate file
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		production &&
		babel({
			extensions: ['.js', '.mjs', '.html', '.svelte'],
			babelHelpers: 'runtime',
			exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
			presets: [
				[
					'@babel/preset-env',
					{
						// targets: '> 0.25%, not dead',
						targets: {
							chrome: '70',
							edge: '16',
							firefox: '60',
							safari: '10',
							ios: '10'
						},
						useBuiltIns: 'usage',
						corejs: 3
					}
				]
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				[
					'@babel/plugin-transform-runtime',
					{
						useESModules: true
					}
				]
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				import('child_process').then(cp => cp.spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				}));
			}
		}
	};
}
