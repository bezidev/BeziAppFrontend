<script lang="ts">
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import Textfield from "@smui/textfield";
    import Icon from "@smui/textfield/icon";
    import HelperText from "@smui/textfield/helper-text";
    import Button, {Label} from "@smui/button";
    import {makeRequest} from "./constants";
    import * as constants from "./constants";
    import Snackbar, {Actions, Label as SnackbarLabel} from "@smui/snackbar";
    import IconButton from "@smui/icon-button";
    import Dialog from "@smui/dialog";
    import {Content, Title, Actions as DialogActions} from "@smui/dialog";
    import {navigate} from "svelte-navigator";
    import Tab from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
    let errorReporting = localStorage.getItem("error_reporting") === "true";

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    let apiFail = type === "lopolis_fail";

    let snackbarOK: Snackbar;
    let snackbarNotOK: Snackbar;

    let currentPassword = "";
    let beziPassword = "";
    let gimsisPassword = "";
    let lopolisPassword = "";
    let lopolisUsername = "";
    let spremeni_beziapp = true;

    let active = "";

    let beziappPasswordVisibility = false;
    let newBeziappPasswordVisibility = false;
    let gimsisPasswordVisibility = false;
    let lopolisPasswordVisibility = false;

    let nextWeek = localStorage.getItem("next_week") !== "false";

    async function changePassword(type: string) {
        let fd = new FormData();
        fd.append("pass_type", type);
        fd.append("current_password", currentPassword);
        fd.append("change_beziapp_password", spremeni_beziapp.toString());
        let s = type === "beziapp" ? beziPassword : (type === "gimsis" ? gimsisPassword : lopolisPassword);
        if (type === "lopolis") fd.append("username", lopolisUsername);
        if (s === "" || currentPassword === "") return;
        fd.append("new_password", s);
        let r = await makeRequest(`/account/password`, "POST", fd, false, false, false, true);
        if (r.status_code !== 200) {
            console.log(r.status_code);
            snackbarNotOK.open();
            return;
        }
        if (type === "beziapp" || (type === "gimsis" && spremeni_beziapp)) {
            localStorage.setItem("account_password", s);
        }

        fd = new FormData();
        fd.append("username", localStorage.getItem("account_username"));
        fd.append("password", localStorage.getItem("account_password"));
        r = await fetch(`${constants.baseurl}/account/login`, {body: fd, method: "POST"})
        let response = await r.json();
        if (r.status === 200) {
            localStorage.setItem("key", response["session"]);
            snackbarOK.open();
            return;
        }
        snackbarNotOK.open();
    }
</script>

<Dialog
        bind:open={apiFail}
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">Neuspešna prijava</Title>
    <Content id="simple-content">
        Sem ste bili preusmerjeni, saj smo nedavno preklopili na BežiApp račune.
        BežiApp račun ne dela enako, kakor prejšnja avtentikacija, zato morate posodobiti podatke oz. na novo vnesti podatke za vaš Lo.Polis račun.
        To morate storiti samo enkrat in nikoli več, deluje na vseh napravah.
        Prosimo vas, da sledite navodilom v razdelku "Nastavitve BežiApp računa" in vnesete uporabniško ime in geslo vašega Lo.Polis računa,
        če želite uporabljati storitev Lo.Polis.
    </Content>
    <DialogActions>
        <Button>
            <Label>OK</Label>
        </Button>
    </DialogActions>
</Dialog>

<Snackbar bind:this={snackbarOK}>
    <SnackbarLabel>Sprememba gesla je bila uspešno izvedena.</SnackbarLabel>
    <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
</Snackbar>

<Snackbar bind:this={snackbarNotOK}>
    <SnackbarLabel>Sprememba gesla ni bila uspešno izvedena. Še enkrat preverite vaše trenutno geslo, če mislite, da ste vse pravilno izpolnili, pišite sistemskemu administratorju.</SnackbarLabel>
    <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
</Snackbar>

<h1>BežiApp nastavitve</h1>

<FormField>
    <Switch bind:checked={neprimerniKomentarji} on:click={() => {
        setTimeout(() => {
            localStorage.setItem("komentarji", neprimerniKomentarji.toString());
            neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
        }, 50);
    }}/>

    <span slot="label">Vklopite komentarje razvijalcev. Ker to zna razburiti marsikoga (večina teh komentarjev je zelo družbeno kritičnih), vas ne prisilim, da imate to vključeno.</span>
</FormField>

<p/>

<FormField>
    <Switch bind:checked={errorReporting} on:click={() => {
        setTimeout(() => {
            localStorage.setItem("error_reporting", errorReporting.toString());
            errorReporting = localStorage.getItem("error_reporting") === "true";
        }, 50);
    }}/>

    <span slot="label">Pošiljanje napak. Ob zaznani napaki v aplikaciji pošljite to napako razvijalcem. Privzeto ne pošilja napak, saj lahko vsebujejo določene zaupne vrednosti.</span>
</FormField>

<p/>

<FormField>
    <Switch bind:checked={nextWeek} on:click={() => {
        setTimeout(() => {
            localStorage.setItem("next_week", nextWeek.toString());
            nextWeek = localStorage.getItem("next_week") !== "false";
        }, 50);
    }}/>

    <span slot="label">Vklopite preklop urnika na naslednji teden že med vikendom.</span>
</FormField>

<h2>Generacija barv na urniku</h2>
Generacija barv na urniku se je prestavila. Sedaj ima svojo podstran in svoj zavihek.

<p/>

<Button on:click={async () => {navigate("/palette")}} variant="raised">
    <Icon class="material-icons">palette</Icon>
    <Label>Barve</Label>
</Button>

<h1>Nastavitve BežiApp računa (zamenjava gesel in vpis Lo.Polis podatkov)</h1>
Pojdimo počasi skozi vse to.
Prepričajte se, da natančno preberete vsa navodila, drugače se lahko zgodi, da si uničite BežiApp račun, nakar lahko kontaktirate le razvijalca sistema, ki vam ga bo resetiral.
Spodaj izberite tisto temo, za katero ste prišli sem.
Na mobilnih napravah se verjetno ne vidi tako dobro, ampak spodaj imate več opcij, poskusite scrollati v desno, da se vam bodo pojavile še druge.

<p/>

<TabBar tabs={['Posodobitev GimSIS gesla', 'Posodobitev Lo.Polis podatkov', 'Zamenjava BežiApp gesla']} let:tab bind:active>
    <!-- Note: the `tab` property is required! -->
    <Tab {tab}>
        <Label>{tab}</Label>
    </Tab>
</TabBar>

<p/>

{#if active !== ""}
    Za spremembo gesla morate vpisati vaše trenutno geslo BežiApp računa (geslo BežiApp računa ni nujno isto kot geslo GimSIS računa - uporabite tisto geslo, s katerim se prijavljate v BežiApp).

    {#if active === "Posodobitev GimSIS gesla"}
        <p/>

        Ker si posodabljate geslo GimSIS računa, ste verjetno tukaj, ker ste si zamenjali GimSIS geslo.
        <b>Torej sem vpišite staro geslo, katerega ste prej uporabljali za prijavo v GimSIS. Če vpišete novo geslo, ne bo delovalo.</b>
    {/if}

    <p/>

    <Textfield type={beziappPasswordVisibility ? "text" : "password"} bind:value={currentPassword} label="Geslo BežiApp računa" style="width: 100%;" helperLine$style="width: 100%;" required>
        <IconButton slot="trailingIcon" on:click={() => beziappPasswordVisibility = !beziappPasswordVisibility}>
            {#if beziappPasswordVisibility}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
            {:else}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
            {/if}
        </IconButton>
        <HelperText slot="helper">GimSIS geslo, razen če ste si spremenili geslo BežiApp računa</HelperText>
        <Icon class="material-icons" slot="leadingIcon">key</Icon>
    </Textfield>
{/if}

{#if active === "Posodobitev GimSIS gesla"}
    <h4>Sprememba oz. posodobitev GimSIS gesla</h4>

    Če ste si spremenili GimSIS geslo morate o tem obvestiti BežiApp račun, da lahko še naprej nemoteno delujejo vse GimSIS storitve BežiApp-a.

    <p/>

    Gesla za GimSIS račun <b>NE</b> spreminjate tukaj. S tem obrazcem samo sporočite BežiApp sistemu vaše novo geslo GimSIS računa.

    Geslo GimSIS računa si lahko spremenite samo v <a href="https://zgimsis.gimb.org/Page_Gim/Uporabnik/Profil.aspx">GimSIS-u</a>.

    <p/>

    <Textfield type={gimsisPasswordVisibility ? "text" : "password"} bind:value={gimsisPassword} label="Geslo GimSIS računa" style="width: 100%;" helperLine$style="width: 100%;">
        <IconButton slot="trailingIcon" on:click={() => gimsisPasswordVisibility = !gimsisPasswordVisibility}>
            {#if gimsisPasswordVisibility}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
            {:else}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
            {/if}
        </IconButton>
        <HelperText slot="helper">Novo GimSIS geslo</HelperText>
        <Icon class="material-icons" slot="leadingIcon">key</Icon>
    </Textfield>

    <p/>

    Preden kliknete na spremeni geslo, še enkrat preverite, če ste pravilno vpisali obe gesli. Zato sta na voljo ikoni oči, ki razkrijeta vpisani gesli.

    <h3>BežiApp v tem primeru NE preverja novega gesla, tako da če se zatipkate, boste v istem položaju kot prej.</h3>

    <p/>

    <FormField>
        <Switch bind:checked={spremeni_beziapp} />
        <span slot="label">Spremeni tudi BežiApp geslo (z istim geslom kot ga uporabljate za GimSIS, se boste lahko prijavili tudi v BežiApp).</span>
    </FormField>

    <p/>

    <Button variant="raised" on:click={async () => {await changePassword("gimsis")}}>
        <Icon class="material-icons">key</Icon>
        <Label>Spremeni geslo</Label>
    </Button>
{/if}

{#if active === "Posodobitev Lo.Polis podatkov"}
    <h4>Prvi vnos ali sprememba Lo.Polis prijavnih podatkov</h4>

    Če želite dostopati do storitve Lo.Polis ali pa ste si spremenili Lo.Polis geslo, morate o tem obvestiti BežiApp račun, da lahko še naprej nemoteno delujejo vse Lo.Polis storitve BežiApp-a.

    <p/>

    Gesla za Lo.Polis račun <b>NE</b> spreminjate tukaj. S tem obrazcem samo sporočite BežiApp sistemu vaše novo geslo Lo.Polis računa.

    Geslo Lo.Polis računa si lahko spremenite samo v <a href="https://www.lopolis.si/Account/ForgotPassword">Lo.Polis-u</a>.

    <p/>

    <Textfield type="text" bind:value={lopolisUsername} label="Uporabniško ime Lo.Polis računa" style="width: 100%;" helperLine$style="width: 100%;">
        <HelperText slot="helper">Lo.Polis uporabniško ime</HelperText>
        <Icon class="material-icons" slot="leadingIcon">person</Icon>
    </Textfield>

    <Textfield type={lopolisPasswordVisibility ? "text" : "password"} bind:value={lopolisPassword} label="Geslo Lo.Polis računa" style="width: 100%;" helperLine$style="width: 100%;">
        <IconButton slot="trailingIcon" on:click={() => lopolisPasswordVisibility = !lopolisPasswordVisibility}>
            {#if lopolisPasswordVisibility}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
            {:else}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
            {/if}
        </IconButton>
        <HelperText slot="helper">Novo Lo.Polis geslo</HelperText>
        <Icon class="material-icons" slot="leadingIcon">key</Icon>
    </Textfield>

    <p/>

    Preden kliknete na spremeni prijavne podatke, še enkrat preverite, če ste pravilno vpisali obe gesli in uporabniško ime. Zato sta na voljo ikoni oči, ki razkrijeta vpisani gesli.

    <h3>BežiApp v tem primeru NE preverja novega gesla, tako da če se zatipkate, boste v istem položaju kot prej.</h3>

    <p/>

    <Button variant="raised" on:click={async () => {await changePassword("lopolis")}}>
        <Icon class="material-icons">key</Icon>
        <Label>Spremeni prijavne podatke</Label>
    </Button>
{/if}

{#if active === "Zamenjava BežiApp gesla"}
    <h4>Sprememba BežiApp gesla</h4>

    <h3>TEGA NE DELAJTE, RAZEN ČE STE SI NATANČNO PREBRALI, KAJ DELATE.</h3>

    S tem geslom se prijavljate v BežiApp račun, ki deluje popolnoma neodvisno od GimSIS-a in Lo.Polisa.
    Če katera izmed teh storitev ne deluje, lahko še vedno dostopate do BežiApp-a in uporabljate vse ostale ponujene storitve.

    <p/>

    <Textfield type={newBeziappPasswordVisibility ? "text" : "password"} bind:value={beziPassword} label="Geslo BežiApp računa" style="width: 100%;" helperLine$style="width: 100%;">
        <IconButton slot="trailingIcon" on:click={() => newBeziappPasswordVisibility = !newBeziappPasswordVisibility}>
            {#if newBeziappPasswordVisibility}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff"/></svg>
            {:else}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff"/></svg>
            {/if}
        </IconButton>
        <HelperText slot="helper">Novo BežiApp geslo</HelperText>
        <Icon class="material-icons" slot="leadingIcon">key</Icon>
    </Textfield>

    <p/>

    Preden kliknete na spremeni geslo, še enkrat preverite, če ste pravilno vpisali obe gesli. Zato sta na voljo ikoni oči, ki razkrijeta vpisani gesli.

    <p/>

    <Button variant="raised" on:click={async () => {await changePassword("beziapp")}}>
        <Icon class="material-icons">key</Icon>
        <Label>Spremeni geslo</Label>
    </Button>
{/if}

