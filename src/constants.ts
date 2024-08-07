import {navigate} from "svelte-routing";
import uniqolor from "uniqolor";
import type {TimetableHour} from "./ts/timetable";
import type {LoginResponse} from "./ts/login";
import type {ErrorRequest} from "./ts/error";

// Gets injected during build process
// @ts-ignore
export const production: boolean = isProduction;
export let baseurl: string = (!production ? "http://127.0.0.1:8000" : "/api");

export const gradeColors = {
    1: "#F44336",
    2: "#FF9800",
    3: "#FFC107",
    4: "#8BC34A",
    5: "#64DD17",
    //"NOC": "#808080",
};

export function timeConverter(UNIX_timestamp: number) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + '. ' + month + ' ' + year;
    return time;
}

export async function handleRejection(r: ErrorRequest) {
    console.log("Called handleRejection", r);

    if (!production) {
        return true;
    }

    console.log("Running in production environment");

    if (localStorage.getItem("error_reporting") !== "true") {
        return true;
    }

    console.log("Reporting an error to BežiApp developer team.");

    let password = localStorage.getItem("account_password");
    let fd = new FormData();
    fd.append("message", `${r.message}`);
    fd.append("source", r.fileName);
    fd.append("line", `${r.lineNumber}`);
    fd.append("col", `${r.columnNumber}`);
    fd.append("error", `${r.stack}`);
    // @ts-ignore
    fd.append("username", localStorage.getItem("account_username"));
    fd.append("password", `${password === null || password === undefined || password === ""}`);
    // @ts-ignore
    fd.append("session", localStorage.getItem("key"));

    await fetch(`${baseurl}/report/error`, {body: fd, method: "POST"})
}

export async function makeRequest(url: string, method: string = "GET", formData: FormData | string | null = new FormData(), forcefullyReturn: boolean = false, blob: boolean = false, json: boolean = false, status_code: boolean = false) {
    let headers: Record<string, string> = {};
    if (json) headers["Content-Type"] = "application/json";
    let response = await fetch(`${baseurl}${url}`, {
        method: method,
        body: (method === "POST" || method === "DELETE" || method === "PATCH" || method === "PUT") ? formData : null,
        headers: headers,
        credentials: production ? undefined : "include"
    })
    if ((response.status < 200 || response.status >= 300) && !forcefullyReturn) {
        if (localStorage.getItem("account_password") === null || localStorage.getItem("account_username") === null) {
            let j: ErrorRequest = {
                message: "account_password or account_username is for some reason null",
                fileName: `constants.ts/makeRequest() ${url} ${method} ${forcefullyReturn} ${blob} ${json} ${status_code}`,
                lineNumber: 64,
                columnNumber: 0,
                stack: "No stacktrace available for this manual request.",
            };
            await handleRejection(j);
            navigate("/login");
            return;
        }
        let fd = new FormData();
        // @ts-ignore
        fd.append("username", localStorage.getItem("account_username"));
        // @ts-ignore
        fd.append("password", localStorage.getItem("account_password"));
        let loginResponse = await fetch(`${baseurl}/account/login`, {
            body: fd,
            method: "POST",
            credentials: production ? undefined : "include"
        })
        let j: LoginResponse = await loginResponse.json();
        localStorage.setItem("key", j.session);
        localStorage.setItem("is_global_administrator", j.is_global_administrator.toString());
        localStorage.setItem("is_radio_administrator", j.is_radio_administrator.toString());
        localStorage.setItem("is_upload_moderator", j.is_upload_moderator.toString());
        localStorage.setItem("palette", JSON.stringify(j["palette"]));
        return await makeRequest(url, method, formData, true, blob, json, status_code);
    }
    if (blob) return await response.blob();
    if (status_code) return {...await response.json(), "status_code": response.status};
    return await response.json();
}

export const saveBlob = async (blob: Blob) => {
    let _url = window.URL.createObjectURL(blob);
    // @ts-ignore
    window.open(_url, "_blank").focus();
}

export function barvaPredmeta(selected, paleta, n: TimetableHour) {
    if (selected !== "Lastne barvne plošče") {
        return uniqolor(n.subject.name, {
            saturation: [50, 70],
            lightness: [20, 30],
        }).color;
    } else {
        //console.log("uporabljam lastno barvno ploščo");

        for (let i = 0; i < paleta.length; i++) {
            let predmet = paleta[i];
            //console.log(predmet.id.toLowerCase(), n.kratko_ime.toLowerCase())
            if (n.kratko_ime.toLowerCase().includes(predmet.id.toLowerCase())) {
                return predmet.color;
            }
        }

        for (let i = 0; i < paleta.length; i++) {
            let predmet = paleta[i];
            //console.log(predmet.id.toLowerCase(), n.ime.toLowerCase())
            if (n.ime.toLowerCase().includes(predmet.id.toLowerCase())) {
                return predmet.color;
            }
        }

        return uniqolor(n.ime, {saturation: [50, 70], lightness: [20, 30],}).color;
    }
}
