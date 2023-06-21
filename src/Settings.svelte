<script lang="ts">
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import Textfield from "@smui/textfield";
    import Icon from "@smui/textfield/icon";
    import HelperText from "@smui/textfield/helper-text";
    import Button, {Label} from "@smui/button";
    import {makeRequest} from "./constants";
    import * as constants from "./constants";
    import Cookies from "js-cookie";
    import {navigate} from "svelte-navigator";
    import Snackbar, {Actions} from "@smui/snackbar";
    import IconButton from "@smui/icon-button";
    import Dialog from "@smui/dialog";
    import {Content, Title, Actions as DialogActions} from "@smui/dialog";

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    let apiFail = type === "lopolis_fail";

    let snackbarOK: InstanceType<typeof Snackbar>;
    let snackbarNotOK: InstanceType<typeof Snackbar>;

    let currentPassword = "";
    let beziPassword = "";
    let gimsisPassword = "";
    let lopolisPassword = "";
    let lopolisUsername = "";

    async function changePassword(type: string) {
        let fd = new FormData();
        fd.append("pass_type", type);
        fd.append("current_password", currentPassword);
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
        if (type === "beziapp") {
            localStorage.setItem("account_password", s);
        }

        fd = new FormData();
        fd.append("username", localStorage.getItem("account_username"));
        fd.append("password", localStorage.getItem("account_password"));
        r = await fetch(`${constants.baseurl}/account/login`, {body: fd, method: "POST"})
        let response = await r.json();
        if (r.status === 200) {
            Cookies.set("key", response["session"], {sameSite: "strict", expires: 365});
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
    <Content id="simple-content">Sem ste bili preusmerjeni, saj smo nedavno preklopili na BežiApp račune. BežiApp račun ne dela enako, kakor prejšnja avtentikacija, zato morate posodobiti podatke za vaš Lo.Polis račun. Prosimo vas, da spodaj vnesete uporabniško ime in geslo vašega Lo.Polis računa, če želite uporabljati storitev Lo.Polis.</Content>
    <DialogActions>
        <Button>
            <Label>OK</Label>
        </Button>
    </DialogActions>
</Dialog>

<Snackbar bind:this={snackbarOK}>
    <Label>Sprememba gesla je bila uspešno izvedena.</Label>
    <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
</Snackbar>

<Snackbar bind:this={snackbarNotOK}>
    <Label>Sprememba gesla ni bila uspešno izvedena. Še enkrat preverite vaše trenutno geslo, če mislite, da ste vse pravilno izpolnili, pišite sistemskemu administratorju.</Label>
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

<h1>Nastavitve BežiApp računa</h1>

Za spreminjanje vseh gesel morate vpisati vaše trenutno geslo BežiApp računa (geslo BežiApp računa ni nujno isto kot geslo GimSIS računa - uporabite tisto geslo, s katerim se prijavljate v BežiApp).

Vsa gesla (GimSIS in Lo.Polis) razen BežiApp gesla so šifrirana z AES algoritmom za šifriranje. Dešifrirate jih lahko samo, če poznate geslo BežiApp računa.

BežiApp geslo je šifrirano z bcrypt enosmernim algoritmom - gesla se ne da dešifrirati.

<p/>

Spodnje geslo je <b>POTREBNO</b> izpolniti, ne glede na to, katero izmed gesel želite spremeniti.

<p/>

<Textfield type="password" bind:value={currentPassword} label="Geslo BežiApp računa" style="width: 100%;" helperLine$style="width: 100%;" required>
    <HelperText slot="helper">GimSIS geslo, razen če ste si spremenili geslo BežiApp računa</HelperText>
    <Icon class="material-icons" slot="leadingIcon">key</Icon>
</Textfield>

<h2>GimSIS geslo</h2>
Če ste si spremenili GimSIS geslo morate o tem obvestiti BežiApp račun, da lahko še naprej nemoteno delujejo vse GimSIS storitve BežiApp-a.

S tem, ko spremenite GimSIS geslo, se <b>NE</b> spremeni geslo BežiApp računa, razen če tudi tega posebej spremenite.

<p/>

Gesla za GimSIS račun <b>NE</b> spreminjate tukaj. S tem obrazcem samo sporočite BežiApp sistemu vaše novo geslo GimSIS računa.

Geslo GimSIS računa si lahko spremenite samo v <a href="https://zgimsis.gimb.org/Page_Gim/Uporabnik/Profil.aspx">GimSIS-u</a>.

<p/>

<Textfield type="password" bind:value={gimsisPassword} label="Geslo GimSIS računa" style="width: 100%;" helperLine$style="width: 100%;">
    <HelperText slot="helper">Novo GimSIS geslo</HelperText>
    <Icon class="material-icons" slot="leadingIcon">key</Icon>
</Textfield>

<p/>

<Button variant="raised" on:click={async () => {await changePassword("gimsis")}}>
    <Icon class="material-icons">key</Icon>
    <Label>Spremeni geslo</Label>
</Button>

<h2>Lo.Polis prijavni podatki</h2>
Če želite dostopati do storitve Lo.Polis ali pa ste si spremenili Lo.Polis geslo, morate o tem obvestiti BežiApp račun, da lahko še naprej nemoteno delujejo vse Lo.Polis storitve BežiApp-a.

S tem, ko spremenite ali dodate Lo.Polis geslo, se <b>NE</b> spremeni geslo BežiApp računa, razen če tudi tega posebej spremenite.

<p/>

Gesla za Lo.Polis račun <b>NE</b> spreminjate tukaj. S tem obrazcem samo sporočite BežiApp sistemu vaše novo geslo Lo.Polis računa.

Geslo Lo.Polis računa si lahko spremenite samo v <a href="https://www.lopolis.si/Account/ForgotPassword">Lo.Polis-u</a>.

<p/>

<Textfield type="text" bind:value={lopolisUsername} label="Uporabniško ime Lo.Polis računa" style="width: 100%;" helperLine$style="width: 100%;">
    <HelperText slot="helper">Lo.Polis uporabniško ime</HelperText>
    <Icon class="material-icons" slot="leadingIcon">person</Icon>
</Textfield>

<Textfield type="password" bind:value={lopolisPassword} label="Geslo Lo.Polis računa" style="width: 100%;" helperLine$style="width: 100%;">
    <HelperText slot="helper">Novo Lo.Polis geslo</HelperText>
    <Icon class="material-icons" slot="leadingIcon">key</Icon>
</Textfield>

<p/>

<Button variant="raised" on:click={async () => {await changePassword("lopolis")}}>
    <Icon class="material-icons">key</Icon>
    <Label>Spremeni geslo</Label>
</Button>

<h2>BežiApp geslo</h2>
S tem geslom se prijavljate v BežiApp račun, ki deluje popolnoma neodvisno od GimSIS-a in Lo.Polisa.
Če katera izmed teh storitev ne deluje, lahko še vedno dostopate do BežiApp-a in uporabljate vse ostale ponujene storitve.

<p/>

<Textfield type="password" bind:value={beziPassword} label="Geslo BežiApp računa" style="width: 100%;" helperLine$style="width: 100%;">
    <HelperText slot="helper">Novo BežiApp geslo</HelperText>
    <Icon class="material-icons" slot="leadingIcon">key</Icon>
</Textfield>

<p/>

<Button variant="raised" on:click={async () => {await changePassword("beziapp")}}>
    <Icon class="material-icons">key</Icon>
    <Label>Spremeni geslo</Label>
</Button>