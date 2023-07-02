import './app.css';
import './smui-dark.css';
import App from './App.svelte';
import Cookies from "js-cookie";
import {baseurl, production} from "./constants";

window.onunhandledrejection = async (e) => {
	console.log("Zaznana težava", e);

	if (!production) {
		return true;
	}
	if (localStorage.getItem("error_reporting") !== "true") {
		return true;
	}

	let r = e.reason;

	console.log("Reporting an error to BežiApp developer team.");

	let password = localStorage.getItem("account_password");
	let fd = new FormData();
	fd.append("message", `${r.message}`);
	fd.append("source", r.fileName);
	fd.append("line", `${r.lineNumber}`);
	fd.append("col", `${r.columnNumber}`);
	fd.append("error", `${r.stack}`);
	fd.append("username", localStorage.getItem("account_username"));
	fd.append("password", `${password === null || password === undefined || password === ""}`);
	fd.append("session", Cookies.get("key"));

	await fetch(`${baseurl}/report/error`, {body: fd, method: "POST"})

	return true;
};

const app = new App({
	target: document.body,
});

export default app;