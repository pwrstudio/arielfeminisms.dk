import App from './App.svelte';

Sentry.init({
	dsn: 'https://509f6c6d22354adfa9be77cc88d33fd3@sentry.io/2600091'
})

const app = new App({
	target: document.body
});

export default app;