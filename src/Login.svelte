<script lang="ts">
    import Textfield from "@smui/textfield";
    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/icon-button";
    import { navigate } from "svelte-navigator";
    import Snackbar, {Actions} from "@smui/snackbar";
    import * as constants from "./constants";
    import Notification from "./Widgets/Notification.svelte";
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import HelperText from "@smui/textfield/helper-text";
    import {makeRequest} from "./constants";
    import insane from "insane";
    import {marked} from "marked";

    // <b style="color: rgba(0, 77, 50, 1);">Beži</b><span style="color: rgba(0, 128, 83, 1);">App</span>
    let passwordVisibility = false;

    let notifications = [];
    async function getNotifications() {
        notifications = await makeRequest("/developers/notifications");
    }

    async function login() {
        let fd = new FormData();
        fd.append("username", email);
        fd.append("password", password);

        localStorage.setItem(`${loginType}_username`, email);
        localStorage.setItem(`${loginType}_password`, password);

        try {
            let r = await fetch(`${constants.baseurl}/${loginType}/login`, {body: fd, method: "POST"})
            let response = await r.json();
            if (r.status === 200) {
                localStorage.setItem("key", response["session"]);
                localStorage.setItem("palette", JSON.stringify(response["palette"]));
                if (response["palette"] !== undefined && response["palette"] !== null && response["palette"].length !== 0) {
                    localStorage.setItem("colorGeneration", "Lastne barvne plošče");
                }
                navigate("/")
            } else {
                snackbarWithClose.open();
            }
        } catch (e) {
            console.log(e)
            snackbarWithClose.open();
        }
    }

    let email = "";
    let password = "";

    export let loginType = "account";

    let width = window.innerWidth;
    addEventListener("resize", (event) => {
        width = window.innerWidth
        console.log(width);
    });

    let snackbarWithClose: InstanceType<typeof Snackbar>;

    getNotifications();
</script>

<main>
    <Snackbar bind:this={snackbarWithClose}>
        <Label>Prijava neuspešna. Še enkrat preverite vaše geslo.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
    <div class="center">
            <h1>Prijava v {#if loginType === "gimsis"}BežiApp (GimSIS){:else}{#if loginType === "account"}BežiApp{:else}Lo.Polis{/if}{/if}</h1>
            <Textfield type="text" bind:value={email} label="Uporabniško ime" style="width: 80%;" helperLine$style="width: 80%;">
                <HelperText slot="helper" style="left: 12%; position: relative;">GimSIS uporabniško ime</HelperText>
                <Icon class="material-icons" slot="leadingIcon">person</Icon>
            </Textfield>
            <p />
            <Textfield on:keypress={(key) => {
                if (key.key === "Enter") {
                    login();
                }
            }} type={passwordVisibility ? "text" : "password"} bind:value={password} label="Geslo" style="width: 80%;" helperLine$style="width: 80%;">
                <IconButton slot="trailingIcon" on:click={() => passwordVisibility = !passwordVisibility}>
                    {#if passwordVisibility}
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
                    {:else}
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
                    {/if}
                </IconButton>
                <HelperText slot="helper" style="left: 12%; position: relative;">GimSIS geslo, razen če ste si spremenili geslo BežiApp računa</HelperText>
                <Icon class="material-icons" slot="leadingIcon">key</Icon>
            </Textfield>
            <p />
            Če ste si spremenili GimSIS geslo, pred tem pa ste se že prijavili v BežiApp, se v BežiApp še vedno prijavljate s starim GimSIS geslom.
            Če prijava ne deluje, kontaktirajte razvijalca na <a href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a>.
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>PRIJAVA</Label>
            </Button>

            {#if loginType === "account"}
                <p/>
                Ob kliku na gumb Prijava, se vam bo avtomatično ustvaril BežiApp račun, ki olajša prijavo v BežiApp sistem in omogoči dodatne funkcije.
                S klikom na gumb se prav tako strinjate s <a href="/tos.html">pogoji uporabe storitve BežiApp</a>.<br>
                BežiApp uporablja minimalno in neinvazivno analitiko ter statistiko z uporabo <a href="https://stats.severkar.eu">Plausible analitike</a>.
            {/if}
            {#if loginType === "gimsis"}
                <p/>
                <Notification/>
            {/if}
            <p/>
            <LayoutGrid>
                {#each notifications as notification}
                    {#if notification.notification_type === "gimsis_closed" || notification.notification_type === "login"}
                        <Cell span={12 / Math.floor(95 / Math.max(width / 700, 1))}>
                            <div style="padding: 10px; background-color: darkorange; border-radius: 10px;">
                                <h2>{notification.name}</h2>
                                {@html insane(marked(notification.description))}
                            </div>
                        </Cell>
                    {/if}
                {/each}
            </LayoutGrid>
        <p/>
    </div>
</main>
