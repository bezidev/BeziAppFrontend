<script lang="ts">
    import Textfield from "@smui/textfield";
    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/icon-button";
    import { navigate } from "svelte-navigator";
    import Snackbar, {Actions} from "@smui/snackbar";
    import * as constants from "./constants";
    import HelperText from "@smui/textfield/helper-text";

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    let username = urlParams.get("username");
    let password = "";
    let passwordVisibility = false;

    async function sendEmail() {
        let fd = new FormData();
        fd.append("username", email);

        try {
            await fetch(`${constants.baseurl}/account/reset_email`, {body: fd, method: "POST"})
            snackbarWithClose.open();
        } catch (e) {
            console.log(e)
            return;
        }
    }

    async function resetAccount() {
        let fd = new FormData();
        fd.append("username", username);
        fd.append("password", password);
        fd.append("reset_token", token);

        try {
            let r = await fetch(`${constants.baseurl}/account/reset_account`, {body: fd, method: "POST"});
            if (r.status === 400) {
                notification = "Niste izpolnili vseh polj!";
                snackbarWithClose.open();
                return;
            }
            if (r.status === 401) {
                notification = "Preverite, če ste vpisali pravilno uporabniško ime.";
                snackbarWithClose.open();
                return;
            }
            if (r.status === 403) {
                notification = "Uporabniški profil ne obstaja ALI neveljavna/potekla povezava";
                snackbarWithClose.open();
                return;
            }
            if (r.status === 409) {
                notification = "Neveljavno geslo ali uporabniško ime! Preverite, če ste vnesli tistega, ki ga uporabljate za GimSIS.";
                snackbarWithClose.open();
                return;
            }
            if (r.status === 500) {
                notification = "Težava pri šifriranju gesel. Poskusite ponovno ali pa kontaktirajte razvijalca.";
                snackbarWithClose.open();
                return;
            }
            navigate("/login");
        } catch (e) {
            console.log(e)
            notification = "Težava pri izvajanju zahtevka. Preverite internetno povezavo!";
            snackbarWithClose.open();
            return;
        }
    }

    let email = "";

    let notification = "";
    let snackbarWithClose: InstanceType<typeof Snackbar>;
</script>

{#if token === undefined || token === "" || token === null}
    <main>
        <Snackbar bind:this={snackbarWithClose}>
            <Label>Če tak uporabnik obstaja, mu je bilo sporočilo poslano. Če ni bilo poslano, poskusite znova čez 5 minut ali pa kontaktirajte glavnega razvijalca.</Label>
            <Actions>
                <IconButton class="material-icons" title="Dismiss">close</IconButton>
            </Actions>
        </Snackbar>
        <div class="center">
            <h1>Zahtevek za ponastavitev uporabniškega profila</h1>
            <Textfield type="text" bind:value={email} label="Uporabniško ime" style="width: 80%;" helperLine$style="width: 80%;">
                <HelperText slot="helper" style="left: 12%; position: relative;">GimSIS uporabniško ime</HelperText>
                <Icon class="material-icons" slot="leadingIcon">person</Icon>
            </Textfield>
            <p/>
            Zahtevek bo verjetno razrešil vse probleme s prijavo v GimSIS, a naj se to uporabi kot zadnja možnost, saj resetira vaše Lo.Polis podatke in vaš Ringo ključ. <br>
            Če ne prejmete elektronskega sporočila po kliku na naslednji gumb, kontaktirajte razvijalca na <a href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a>.
            <p />
            <Button on:click={async () => await sendEmail()} variant="raised">
                <Label>PONASTAVI</Label>
            </Button>
            <p/>
            <Button on:click={() => navigate("/login")} variant="outlined">
                <Label>PRIJAVA</Label>
            </Button>
        </div>
    </main>
{:else}
    <main>
        <Snackbar bind:this={snackbarWithClose}>
            <Label>{notification}</Label>
            <Actions>
                <IconButton class="material-icons" title="Dismiss">close</IconButton>
            </Actions>
        </Snackbar>
        <div class="center">
            <h1>Ponastavitev uporabniškega profila</h1>
            <Textfield type="text" bind:value={username} label="Uporabniško ime" style="width: 80%;" helperLine$style="width: 80%;">
                <HelperText slot="helper" style="left: 12%; position: relative;">GimSIS uporabniško ime</HelperText>
                <Icon class="material-icons" slot="leadingIcon">person</Icon>
            </Textfield>
            <p/>
            <Textfield type={passwordVisibility ? "text" : "password"} bind:value={password} label="Geslo" style="width: 80%;" helperLine$style="width: 80%;">
                <IconButton slot="trailingIcon" on:click={() => passwordVisibility = !passwordVisibility}>
                    {#if passwordVisibility}
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
                    {:else}
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
                    {/if}
                </IconButton>
                <HelperText slot="helper" style="left: 12%; position: relative;">GimSIS geslo</HelperText>
                <Icon class="material-icons" slot="leadingIcon">key</Icon>
            </Textfield>
            <p/>
            Do zdaj se z vašim uporabniškim profilom še nič ni zgodilo. Še vedno lahko prekinete postopek. <br>
            Zahtevek bo verjetno razrešil vse probleme s prijavo v GimSIS, a naj se to uporabi kot zadnja možnost, saj resetira vaše Lo.Polis podatke in vaš Ringo ključ. <br>
            Če ponastavitev ne deluje po kliku na naslednji gumb, kontaktirajte razvijalca na <a href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a>.
            <p />
            <Button on:click={async () => await resetAccount()} variant="raised">
                <Label>PONASTAVI</Label>
            </Button>
            <p/>
            <Button on:click={() => navigate("/login")} variant="outlined">
                <Label>PRIJAVA</Label>
            </Button>
        </div>
    </main>
{/if}