<script lang="ts">
    import {Icon} from "@smui/common";
    import {makeRequest} from "./constants";
    import Button, {Label} from "@smui/button";
    import TextField from "@smui/textfield";
    import Snackbar from "@smui/snackbar";
    import {marked} from "marked";

    let snackbarWithoutClose: Snackbar;
    let snackbarContent = "";

    let token = "";
    let newToken = "";
    let currentPassword = "";

    async function getToken() {
        let t = await makeRequest(`/bikes/token`);
        if (t === undefined) return;
        token = t.token;
    }

    async function setToken(default_token: boolean) {
        let fd = new FormData();
        fd.append("ringo_url", default_token ? "DEFAULT_TOKEN" : newToken);
        if (!default_token) fd.append("current_password", currentPassword);
        let r = await makeRequest(`/bikes/token`, "PATCH", fd);
        if (r.type === "invalid_data") {
            snackbarContent = "Niste izpolnili obeh polj. Obe polji sta potrebni.";
            snackbarWithoutClose.open();
            return;
        }
        if (r.type === "invalid_url") {
            snackbarContent = "Vaš Ringo URL se ne začne z https://www.ringodoor.com/. Prosimo, popravite URL naslov.";
            snackbarWithoutClose.open();
            return;
        }
        if (r.type === "no_such_user") {
            snackbarContent = "Nismo uspeli najti vašega uporabniškega profila v podatkovni bazi. Nekaj je šlo izjemno narobe.";
            snackbarWithoutClose.open();
            return;
        }
        if (r.type === "password_verification_fail") {
            snackbarContent = "Vpisano geslo se ne ujema s trenutnim.";
            snackbarWithoutClose.open();
            return;
        }
        snackbarContent = "Ringo URL je bil uspešno spremenjen.";
        snackbarWithoutClose.open();
        await getToken();
    }

    getToken();
</script>

<div style="padding: 10px; background-color: darkorange; border-radius: 10px;">
    <h2>Modul še ni aktiven</h2>
    Modul trenutno še ni aktiven, še čakam na namestitev in testiranje. Vmes si lahko nastavite Ringo URL na svoj BežiApp profil.
    <p/>
</div>

<p/>

<div class="center">
    <Icon class="material-icons" slot="leadingIcon" style="font-size: 7em;">directions_bike</Icon>
    <h2>Odklepanje kolesarnice</h2>
    <p/>
    {#if token === "NO_TOKEN"}
        Trenutno še nimate nastavljenega ključa vrat. Lahko nastavite svoj ključ, lahko pa uporabite skupni ključ BežiApp razvijalca.

        <br>

        Prednost tega, da si nastavite svoj ključ je, da če mi razveljavijo ključ, bo vaš še vedno delal.

        <br>

        Če kolesarnico obiskujete le nekajkrat na leto ali pa se bojite, da bi vodstvo vohunilo za vami, lahko uporabite tudi skupni ključ.

        <br>

        Če želite, da to obvestilo izgine, si na dnu strani lahko nastavite ključ ali pa izberete skupni ključ.

        <hr>
    {/if}
    <p/>
    <div class="sameline">
        <span class="inline">Pokrita kolesarnica:</span>
        <div style="width: 10px;" class="inline" />
        <Button on:click={async () => {
            await makeRequest(`/bikes/open/0`, "POST");
        }} variant="raised" class="inline">
            <Icon class="material-icons">lock_open</Icon>
            <Label>Odpri vrata</Label>
        </Button>
    </div>
    <p/>
    <div class="sameline">
        <span class="inline">Odprta kolesarnica:</span>
        <div style="width: 10px;" class="inline" />
        <Button on:click={async () => {
            await makeRequest(`/bikes/open/1`, "POST");
        }} variant="outlined" class="inline">
            <Icon class="material-icons">lock_open</Icon>
            <Label>Odpri vrata</Label>
        </Button>
    </div>
    <p/>
    {#if (token === "DEFAULT_TOKEN" || token === "NO_TOKEN")}
        Uporabljate skupni ključ. Skupni ključ bo ostal skrit, saj BežiApp razvijalci ne želimo, da pride do zlorabe.
        BežiApp privzeto uporablja skupni ključ.
        <p/>
    {/if}
    {#if (token !== "DEFAULT_TOKEN" && token !== "NO_TOKEN" && token !== "")}
        V primeru, da odklepanje iz tega modula ne deluje, odprite povezavo <a href="{token}">do vašega ključa</a>.
        <p/>
    {/if}
    <h3>Nastavite si ključ</h3>
    Spodaj vpišite povezavo (Ringo ključ), ki vam je bila poslana na elektronsko pošto.
    <br>
    Če nimate ključa, kliknite na "Uporabi skupni ključ" (ničesar ne potrebujete vpisati).
    <br>
    Vsi ključi so šifrirani z dvosmernim šifrirnim standardom AES.
    <p/>
    <TextField bind:value={newToken} label="URL povezava (Ringo ključ)" style="width: 80vw;" helperLine$style="width: 100%;" type="url" />
    <p/>
    <TextField bind:value={currentPassword} label="BežiApp (GimSIS) geslo" style="width: 80vw;" helperLine$style="width: 100%;" type="password" />
    <p/>
    <Button on:click={async () => {
        await setToken(false);
    }} variant="raised" class="inline">
        <Icon class="material-icons">save</Icon>
        <Label>Shrani ključ</Label>
    </Button>
    <Button on:click={async () => {
        await setToken(true);
    }} variant="outlined" class="inline">
        <Icon class="material-icons">share</Icon>
        <Label>Uporabi skupni ključ</Label>
    </Button>
</div>

<Snackbar bind:this={snackbarWithoutClose}>
    <Label>{snackbarContent}</Label>
</Snackbar>
