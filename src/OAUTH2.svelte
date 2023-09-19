<script lang="ts">
    import Button, {Label} from "@smui/button";
    import {makeRequest, timeConverter} from "./constants";
    import List, {Graphic, Item, Text} from "@smui/list";
    import CircularProgress from "@smui/circular-progress";

    const OAUTH2_SCOPES = {
        "gimsis.timetable": {
            name: "preveri vaš urnik",
            icon: "calendar_month",
        },
        "gimsis.absences": {
            name: "preveri vaše odsotnosti",
            icon: "sick",
        },
        "gimsis.gradings": {
            name: "preveri vaša ocenjevanja",
            icon: "event",
        },
        "gimsis.grades": {
            name: "preveri vaše ocene",
            icon: "grade",
        },
        "gimsis.teachers": {
            name: "preveri vaše učitelje",
            icon: "class",
        },
        "gimsis.user.read.usernameemail": {
            name: "bere vaš elektronski naslov in uporabniško ime za GimSIS/BežiApp račun",
            icon: "email",
        },
        "gimsis.user.read.namesurname": {
            name: "bere vaše ime in priimek",
            icon: "face",
        },
        "gimsis.user.read.sex": {
            name: "bere vaš spol",
            icon: "man",
        },
        "gimsis.user.read.role": {
            name: "bere vaš tip uporabniškega računa v GimSIS-u (učenec, starš ipd.)",
            icon: "boy",
        },
        "sharepoint.notifications.read": {
            name: "bere vaša obvestila",
            icon: "notifications",
        },
        "sharepoint.notifications.write": {
            name: "spreminja vaša obvestila (jih označi kot prebrane)",
            icon: "notifications edit"
        },
        "lopolis.meals.read": {
            name: "preveri vaše menije v Lo.Polisu",
            icon: "lunch_dining",
        },
        "lopolis.meals.write": {
            name: "spreminja vaše menije v Lo.Polisu",
            icon: "lunch_dining edit",
        },
        "lopolis.checkouts.read": {
            name: "preveri vaše odjave v Lo.Polisu",
            icon: "remove_shopping_cart",
        },
        "lopolis.checkouts.write": {
            name: "spreminja vaše odjave v Lo.Polisu",
            icon: "remove_shopping_cart edit",
        },
        "notes.read": {
            name: "bere vse zapiske",
            icon: "note",
        },
        "notes.delete": {
            name: "briše vaše zapiske",
            icon: "note delete",
        },
        "notes.write": {
            name: "ustvarja nove zapiske",
            icon: "note edit",
        },
        "radio.suggestion.read": {
            name: "preveri stanje predlogov na šolskem radiu",
            icon: "radio",
        },
        "radio.suggestion.write": {
            name: "ustvarja nove predloge za šolski radio",
            icon: "radio edit",
        },
        "radio.suggestion.delete": {
            name: "briše vaše predloge za šolski radio",
            icon: "radio delete",
        },
        "radio.suggestion.status.change": {
            name: "spreminja stanje predloga za šolski radio (samo administratorski računi)",
            icon: "radio warning",
        },
        "tarot.read": {
            name: "bere vse v tarok sistemu",
            icon: "recent_actors",
        },
        "tarot.game.write": {
            name: "ustvarja igre v tarok sistemu",
            icon: "recent_actors games edit",
        },
        "tarot.game.delete": {
            name: "briše igre v tarok sistemu",
            icon: "recent_actors games delete",
        },
        "tarot.contests.write": {
            name: "ustvarja nova tekmovanja in spreminja obstoječa v tarok sistemu",
            icon: "recent_actors edit",
        },
        "tarot.contests.delete": {
            name: "briše tekmovanja v tarok sistemu",
            icon: "recent_actors delete",
        },
        "notifications.write": {
            name: "ustvarja nova obvestila razvijalcev (samo administratorski računi)",
            icon: "notifications edit",
        },
        "notifications.delete": {
            name: "briše obvestila razvijalcev (samo administratorski računi)",
            icon: "notifications delete",
        },
        "poker.read": {
            name: "bere vse v poker sistemu",
            icon: "casino",
        },
        "poker.game.write": {
            name: "ustvarja igre v poker sistemu",
            icon: "casino games edit",
        },
        "poker.game.delete": {
            name: "briše igre v poker sistemu",
            icon: "casino games delete",
        },
        "poker.contests.write": {
            name: "ustvarja nova tekmovanja in spreminja obstoječa v poker sistemu",
            icon: "casino edit",
        },
        "poker.contests.delete": {
            name: "briše tekmovanja v poker sistemu",
            icon: "casino delete",
        },
    }

    export let id: string;

    const urlParams = new URLSearchParams(window.location.search);
    const scopeParams = urlParams.get('scope');
    const scope = scopeParams.split(",");
    async function getApp() {
        return await makeRequest(`/oauth2/apps/${id}`);
    }

    async function login() {
        let fd = new FormData();
        fd.append("app_id", id);
        fd.append("scope", JSON.stringify(scope));
        let r = await makeRequest(`/oauth2/auth`, "POST", fd);
        window.location.href = r.data;
    }
</script>

<style>
    h1, h2 {
        text-align: center;
    }
</style>

{#await getApp()}
    <div style="display: flex; justify-content: center">
        <CircularProgress style="height: 100px; width: 100px;" indeterminate />
    </div>
    <div style="display: flex; justify-content: center">
        BežiApp nalaga OAUTH2 aplikacijo. Prosimo bodite potrpežljivi.
    </div>
{:then app}
    <h1>BežiApp</h1>
    {#if app !== null}
        <h2>Prijava v <span style="color: grey">{app.name}</span> {#if app.verified}✅{/if}</h2>

        BežiApp vas bo poskušal prijaviti v aplikacijo tretjega ponudnika. Ob tem se vaša gesla <b>NE BODO</b> posredovala izven BežiApp sistema.
        <p/>
        Pomembno je vedeti, da je uradna instanca BežiApp sistema na voljo samo na naslovu <a href="https://beziapp.si">beziapp.si</a>.
        <b>Če ne prepoznate te aplikacije ali se domena ne ujema,
            NE NADALJUJTE IN <a href="mailto:mitja.severkar@gimb.org">PRIJAVITE INCIDENT RAZVIJALCEM BEŽIAPP SISTEMA</a>.</b>
        <!--Razumno preverite, če aplikacija res potrebuje toliko dovoljenj za normalno delovanje.
        Navadno je normalno, da aplikacija zahteva elektronsko pošto, uporabniško ime in ime ter priimek.
        Pomembno je vedeti, da vas uradna BežiApp aplikacija na tej strani ne bo nikoli spraševala za vaše uporabniško ime in geslo,
        če ste se kdaj prej že prijavili vanjo.-->

        <p/>

        <hr>

        <p/>

        <b>Opis aplikacije: </b> {app.description}
        <br>
        <b>Aplikacija je bila ustvarjena: </b> {timeConverter(app.created_on)}
        <br>
        <b>Aplikacija je bila zadnjič spremenjena: </b> {timeConverter(app.modified_on)}

        <p/>
        <hr>
        <p/>

        <h3>Zahtevana dovoljenja:</h3>
        <p/>
        Aplikacija lahko v primeru, da ji odobrite dostop do računa
        <List class="demo-list">
            {#each scope as s}
                <Item>
                    <Graphic class="material-icons" style="width: 80px;">{OAUTH2_SCOPES[s].icon}</Graphic>
                    <Text>{OAUTH2_SCOPES[s].name}</Text>
                </Item>
            {/each}
        </List>

        <p />
        <Button on:click={async () => await login()} variant="raised">
            <Label>PRIJAVA</Label>
        </Button>
    {:else}
        Težave s pridobitvijo OAUTH2 specifikacije aplikacije.
        OAUTH2 specifikacija je ničelna.
        Prosimo <a href="mailto:mitja.severkar@gimb.org">kontaktirajte</a> razvijalce BežiApp sistema.
    {/if}
    <p/>
{:catch e}
    <h1>Prijava z BežiApp računom</h1>
    <div style="text-align: center;">
        OAUTH2 specifikacija se ni uspela naložiti.
        <br>
        To se lahko zgodi v primeru težave v BežiApp sistemu ali ko razvijalec spremeni oz. izbriše aplikacijo v BežiApp portalu za razvijalce.
        <br>
        Vsekakor je priporočljivo da se v takem primeru <a href="mailto:mitja.severkar@gimb.org">kontaktira razvijalce BežiApp sistema</a>.
        <p/>
        Težava je naslednja:
        <br>
        <code>{e}</code>
    </div>
{/await}
