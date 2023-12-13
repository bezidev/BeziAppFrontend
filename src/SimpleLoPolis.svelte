<script lang="ts">
    import IconButton from "@smui/icon-button/src/index.js";
    import Button, {Label} from "@smui/button/src/index.js";
    import HelperText from "@smui/textfield/helper-text";
    import Textfield from "@smui/textfield";
    import Icon from "@smui/textfield/icon";
    import {makeRequest} from "./constants";
    import * as constants from "./constants";
    import Snackbar, {Actions} from "@smui/snackbar";
    import {Link, navigate} from "svelte-navigator";

    async function changePassword() {
        let currentPassword = localStorage.getItem("account_password");
        if (password === "" || currentPassword === "") return;
        let fd = new FormData();
        fd.append("pass_type", "lopolis");
        fd.append("current_password", currentPassword);
        fd.append("username", username);
        fd.append("new_password", password);
        let r = await makeRequest(`/account/password`, "POST", fd, false, false, false, true);
        if (r.status_code !== 200) {
            console.log(r.status_code);
            unsuccessfulPasswordChange.open();
            return;
        }

        fd = new FormData();
        fd.append("username", localStorage.getItem("account_username"));
        fd.append("password", localStorage.getItem("account_password"));
        fd.append("force_lopolis", "true");
        r = await fetch(`${constants.baseurl}/account/login`, {body: fd, method: "POST"})
        let response = await r.json();
        if (r.status === 200) {
            localStorage.setItem("key", response["session"]);
            navigate("/lopolis")
            return;
        }
        unsuccessfulLogin.open();
    }

    let unsuccessfulPasswordChange: Snackbar;
    let unsuccessfulLogin: Snackbar;

    let username = "";
    let passwordVisibility = false;
    let password = "";
</script>

<Snackbar bind:this={unsuccessfulPasswordChange}>
    <Label>Sprememba Lo.Polis prijavnih podatkov je bila neuspešna. Še enkrat preverite vaše prijavne podatke.</Label>
    <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
</Snackbar>

<Snackbar bind:this={unsuccessfulLogin}>
    <Label>Prijava neuspešna. Še enkrat preverite vaše Lo.Polis prijavne podatke.</Label>
    <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
</Snackbar>

<div class="center">
    <h1>Prijava v Lo.Polis</h1>
    <Textfield type="text" bind:value={username} label="Uporabniško ime" style="width: 80%;" helperLine$style="width: 80%;">
        <HelperText slot="helper" style="left: 12%; position: relative;">Lo.Polis uporabniško ime</HelperText>
        <Icon class="material-icons" slot="leadingIcon">person</Icon>
    </Textfield>
    <p />
    <Textfield on:keypress={(key) => {
        if (key.key === "Enter") {
            changePassword();
        }
    }} type={passwordVisibility ? "text" : "password"} bind:value={password} label="Lo.Polis geslo" style="width: 80%;" helperLine$style="width: 80%;">
        <IconButton slot="trailingIcon" on:click={() => passwordVisibility = !passwordVisibility}>
            {#if passwordVisibility}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
            {:else}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
            {/if}
        </IconButton>
        <HelperText slot="helper" style="left: 12%; position: relative;">Geslo za Lo.Polis, katerega ste nastavili ob prijavi v Lo.Polis.</HelperText>
        <Icon class="material-icons" slot="leadingIcon">key</Icon>
    </Textfield>
    <p />
    <Button on:click={async () => await changePassword()} variant="raised">
        <Label>PRIJAVA</Label>
    </Button>

    <p/>
    Ali pa uporabite <Link to="/settings">nastavitve BežiApp računa</Link>, če ste naprednejši uporabnik.
    <p/>
</div>