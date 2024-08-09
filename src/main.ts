import './app.css';
import App from './App.svelte';
import {handleRejection} from "./constants";

window.onunhandledrejection = async (e) => {
	let r = e.reason;
	await handleRejection(r);
	return true;
};

const app = new App({
	target: document.body,
});

export default app;