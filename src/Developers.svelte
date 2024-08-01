<script lang="ts">
    import {handleRejection, makeRequest} from "./constants";
    import TextField from "@smui/textfield";
    import CharacterCounter from "@smui/textfield/character-counter";
    import Icon from "@smui/textfield/icon";
    import Button, {Label} from "@smui/button";
    import {onMount} from "svelte";
    import type {ErrorRequest} from "./ts/error";

    let apps = [];

    let name = "";
    let description = "";
    let redirect_url = "";

    async function myApps() {
        apps = await makeRequest(`/oauth2/apps`) ?? [];
    }

    onMount(async () => {
        try {
            //await myApps();
        } catch (e) {
            let j: ErrorRequest = {
                message: "Error while fetching my apps",
                fileName: `Developers.svelte/onMount()`,
                lineNumber: 0,
                columnNumber: 0,
                stack: e.toString(),
            };
            await handleRejection(j);
        }
    })
</script>

Modul se vrne kmalu!

<!--
<h1>BežiApp za razvijalce</h1>

BežiApp po novem podpira OAUTH2 protokol za prijavo. Če ste kdaj želeli narediti kako aplikacijo,
preko katere bi omogočili prijavo vsem dijakom Gimnazije Bežigrad, ne da bi se potrebovali ukvarjati z GimSIS-om, Microsoftom in podobnim,
je BežiApp avtentikacija prava za vas.

<p/>

Poleg tega BežiApp ponuja dostop do našega lepo urejenega API-ja, s katerim se lahko aplikacije res dobro integrirajo.

<h2>Prijava z BežiApp računom - "branding"</h2>

<img src="/signin.png" alt="Prijava z BežiApp računom" style="height: 80px; width: 300px;">

<h2>Nova aplikacija</h2>

<TextField bind:value={name} label="Ime aplikacije" style="width: 100%;" helperLine$style="width: 100%;" />
<p/>
<TextField bind:value={description} label="Opis aplikacije" style="width: 100%;" helperLine$style="width: 100%;" input$maxlength={200}>
    <CharacterCounter slot="helper">0 / 200</CharacterCounter>
</TextField>
<p/>
<TextField bind:value={redirect_url} label="URL za preusmeritev" style="width: 100%;" helperLine$style="width: 100%;"/>
<p/>
<Button on:click={async () => {
        let fd = new FormData();
        fd.append('name', name);
        fd.append("description", description);
        fd.append("redirect_url", redirect_url);
        await makeRequest(`/oauth2/apps`, "POST", fd)
        await myApps();
        name = "";
        description = "";
        redirect_url = "";
    }} variant="raised">
    <Icon class="material-icons">add</Icon>
    <Label>Dodaj aplikacijo</Label>
</Button>

<h2>Moje aplikacije</h2>

{#each apps as app}
    <h3>{app.name} {#if app.verified}✅{/if}</h3>
    <b>Enolični identifikator aplikacije: </b> {app.id}
    <p/>
    <TextField bind:value={app.name} label="Ime aplikacije" style="width: 100%;" helperLine$style="width: 100%;" />
    <p/>
    <TextField bind:value={app.description} label="Opis aplikacije" style="width: 100%;" helperLine$style="width: 100%;" input$maxlength={200}>
        <CharacterCounter slot="helper">0 / 200</CharacterCounter>
    </TextField>
    <p/>
    <TextField bind:value={app.redirect_url} label="URL za preusmeritev" style="width: 100%;" helperLine$style="width: 100%;"/>
    <p/>
    <Button on:click={async () => {
        let fd = new FormData();
        fd.append('name', app.name);
        fd.append("description", app.description);
        fd.append("redirect_url", app.redirect_url);
        await makeRequest(`/oauth2/apps/${app.id}`, "PATCH", fd)
        await myApps();
    }} variant="raised">
        <Icon class="material-icons">save</Icon>
        <Label>Shrani spremembe</Label>
    </Button>
    <Button on:click={async () => {
        await makeRequest(`/oauth2/apps/${app.id}`, "DELETE");
        await myApps();
    }} variant="raised">
        <Icon class="material-icons">delete</Icon>
        <Label>Izbriši aplikacijo</Label>
    </Button>

    <p/>

    {#if !app.verified}
        Pssst: Vašo aplikacijo lahko ročno preveri eden izmed administratorjev BežiApp sistema in jo označi kot varno/preverjeno s kljukico.
        To lahko administrator naredi samo za dobro poznane aplikacije, zato boste morali dokazati, da je vaša aplikacija relativno dobro poznana.
        Da preverite svojo aplikacijo, pišite administratorju na elektronski naslov <a href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a>,
        ki jo bo poskušal preveriti v čim krajšem času.
        <p/>
    {:else}
        Če boste karkoli spremenili, se vaši aplikaciji odvzame status preverjene aplikacije.
        Še enkrat boste morali čez preverbo vaše aplikacije, za kar morate pisati administratorju sistema
        na elektronski naslov <a href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a>.
    {/if}
    <hr>
    <p/>
{/each}
-->
