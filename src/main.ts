import './app.css';
import './smui-dark.css';
import App from './App.svelte';
import Cookies from "js-cookie";
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