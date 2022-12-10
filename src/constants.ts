import {dialog, fs} from "@tauri-apps/api";
import Cookies from "js-cookie";
import {navigate} from "svelte-navigator";

export const production: boolean = isProduction;
export let baseurl: string = isTauriApp ? localStorage.getItem("baseurl") : (!production ? "http://127.0.0.1:8000" : "/api");
export const isTauri: boolean = isTauriApp;
console.log(baseurl, isTauri);

const blobToBinary = async blob => {
    const buffer = await blob.arrayBuffer();

    return new Uint8Array(buffer);
};

export async function makeRequest(url: string, method: string = "GET", formData: FormData | string = new FormData(), forcefullyReturn: boolean = false, blob: boolean = false, json: boolean = false) {
    let response = await fetch(`${baseurl}${url}`, {method: method, body: (method === "POST" || method === "DELETE") ? formData : null, headers: {"Authorization": Cookies.get("key"), 'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded'}})
    if ((response.status < 200 || response.status >= 300) && !forcefullyReturn) {
        if (localStorage.getItem("gimsis_password") === null || localStorage.getItem("gimsis_username") === null) {
            navigate("/login");
            return;
        }
        let fd = new FormData();
        fd.append("username", localStorage.getItem("gimsis_username"));
        fd.append("password", localStorage.getItem("gimsis_password"));
        let loginResponse = await fetch(`${baseurl}/gimsis/login`, {body: fd, method: "POST"})
        Cookies.set("key", (await loginResponse.json())["session"], {sameSite: "strict"});
        if (url.includes("lopolis") && localStorage.getItem("lopolis_password") !== null && localStorage.getItem("lopolis_username") !== null) {
            // We try to log in Lo.Polis
            let fd = new FormData();
            fd.append("username", localStorage.getItem("lopolis_username"));
            fd.append("password", localStorage.getItem("lopolis_password"));
            await fetch(`${baseurl}/lopolis/login`, {body: fd, method: "POST", headers: {"Authorization": Cookies.get("key")}})
        }
        return await makeRequest(url, method, formData, true, blob, json)
    }
    if (blob) return await response.blob();
    return await response.json();
}

export const saveBlob = async blob => {
    if (isTauri) {
        dialog.save()
            .then(async (path)=>{
                await fs.writeBinaryFile({
                    path: path,
                    contents: await blobToBinary(blob),
                })
            })
    } else {
        let _url = window.URL.createObjectURL(blob);
        window.open(_url, "_blank").focus();
    }
}
