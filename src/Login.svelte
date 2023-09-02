<script lang="ts">
    import Paper from "@smui/paper";
    import Textfield from "@smui/textfield";
    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/icon-button";
    import { navigate } from "svelte-navigator";
    import Snackbar, {Actions} from "@smui/snackbar";
    import * as constants from "./constants";
    import Notification from "./Widgets/Notification.svelte";
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import HelperText from "@smui/textfield/helper-text";
    import {makeRequest} from "./constants";
    import insane from "insane";
    import {marked} from "marked";

    // <b style="color: rgba(0, 77, 50, 1);">Beži</b><span style="color: rgba(0, 128, 83, 1);">App</span>

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
                navigate("/")
            } else {
                snackbarWithClose.open();
            }
        } catch (e) {
            console.log(e)
            snackbarWithClose.open();
        }
    }

    let url = localStorage.getItem("baseurl")

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

<style>
    .center {
        text-align: center;
    }
</style>

<main>
    <Snackbar bind:this={snackbarWithClose}>
        <Label>Prijava neuspešna.</Label>
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
            }} type="password" bind:value={password} label="Geslo" style="width: 80%;" helperLine$style="width: 80%;">
                <HelperText slot="helper" style="left: 12%; position: relative;">GimSIS geslo, razen če ste si spremenili geslo BežiApp računa</HelperText>
                <Icon class="material-icons" slot="leadingIcon">key</Icon>
            </Textfield>
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>PRIJAVA</Label>
            </Button>

            {#if loginType === "account"}
                <p/>
                Ob kliku na gumb Prijava, se vam bo avtomatično ustvaril BežiApp račun, ki olajša prijavo v BežiApp sistem in omogoči dodatne funkcije.
                S klikom na gumb se prav tako strinjate s <a href="/tos.html">pogoji uporabe storitve BežiApp</a>.
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
    {#if loginType === "gimsis"}
        <!--<div style="bottom: 15px; position: fixed; left: 15px; right: 15px;">-->
        <!--</div>-->
    {/if}
</main>
