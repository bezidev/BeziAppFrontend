import {dialog, fs} from "@tauri-apps/api";
import Cookies from "js-cookie";
import {navigate} from "svelte-navigator";

export const production: boolean = isProduction;
export let baseurl: string = (!production ? "http://127.0.0.1:8000" : "/api");

export const gradeColors = [
    "#F44336",
    "#FF9800",
    "#FFC107",
    "#8BC34A",
    "#64DD17"
];

export function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['januar','februar','marec','april','maj','junij','julij','avgust','september','oktober','november','december'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '. ' + month + ' ' + year;
    return time;
}

const blobToBinary = async blob => {
    const buffer = await blob.arrayBuffer();

    return new Uint8Array(buffer);
};

export async function makeRequest(url: string, method: string = "GET", formData: FormData | string = new FormData(), forcefullyReturn: boolean = false, blob: boolean = false, json: boolean = false, status_code: boolean = false) {
    let headers = {"Authorization": Cookies.get("key")}
    if (json) headers["Content-Type"] = "application/json";
    let response = await fetch(`${baseurl}${url}`, {method: method, body: (method === "POST" || method === "DELETE" || method === "PATCH" || method === "PUT") ? formData : null, headers: headers})
    if ((response.status < 200 || response.status >= 300) && !forcefullyReturn) {
        if (localStorage.getItem("account_password") === null || localStorage.getItem("account_username") === null) {
            navigate("/login");
            return;
        }
        let fd = new FormData();
        fd.append("username", localStorage.getItem("account_username"));
        fd.append("password", localStorage.getItem("account_password"));
        let loginResponse = await fetch(`${baseurl}/account/login`, {body: fd, method: "POST"})
        Cookies.set("key", (await loginResponse.json())["session"], {sameSite: "strict"});
        let r = await makeRequest(url, method, formData, true, blob, json);
        return r
    }
    if (blob) return await response.blob();
    if (status_code) return {...await response.json(), "status_code": response.status};
    return await response.json();
}

export const saveBlob = async blob => {
    let _url = window.URL.createObjectURL(blob);
    window.open(_url, "_blank").focus();
}
