<script lang="ts">
    import {Icon} from "@smui/common";
    import {makeRequest} from "./constants";
    import Button, {Label} from "@smui/button";
    import TextField from "@smui/textfield";
    import Snackbar from "@smui/snackbar";

    let snackbarWithoutClose: Snackbar;
    let snackbarContent = "";

    let token = "";
    let newToken = "";
    let currentPassword = "";

    let locked = [true, true];
    let lockedTimer = [5, 5];

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

    async function unlockDoor(door_id: number) {
        if (!locked[door_id]) return;

        let fd = new FormData();
        fd.append("door_id", door_id);
        let r = await makeRequest(`/bikes/open/${door_id}`, "POST", fd);
        if (r.type === "invalid_door_id") {
            snackbarContent = "Poslali ste neveljaven zahtevek. To je krivda BežiApp razvijalca.";
            snackbarWithoutClose.open();
            return;
        }
        if (r.type === "door_open_failure") {
            snackbarContent = "Vrata se niso odprla zaradi težav z Ringo strežniki.";
            snackbarWithoutClose.open();
            return;
        }
        if (r.type === "ringo_api_failure") {
            snackbarContent = "Vrata se niso odprla zaradi težav z Ringo API zahtevkom. To je lahko krivda BežiApp razvijalca.";
            snackbarWithoutClose.open();
            return;
        }

        snackbarContent = "";
        lockedTimer[door_id] = 5;
        locked[door_id] = false;
        let interval = setInterval(() => {
            lockedTimer[door_id]--;
            if (lockedTimer[door_id] <= 0) {
                locked[door_id] = true;
                clearInterval(interval);
                return;
            }
        }, 1000)
    }

    //getToken();
</script>

Modul se vrne kmalu!

<!--<div class="center">
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
            await unlockDoor(0);
        }} disabled={!locked[0]} variant="raised" class="inline">
            <Icon class="material-icons">lock_open</Icon>
            <Label>Odpri vrata</Label>
        </Button>
    </div>
    {#if !locked[0]}
        <br>
        Vrata se zaklenejo čez <b>{lockedTimer[0]}</b> sekund{#if lockedTimer[0] === 1}o{/if}{#if lockedTimer[0] === 2}i{/if}{#if lockedTimer[0] === 3 || lockedTimer[0] === 4}e{/if}.
    {/if}
    <p/>
    <div class="sameline">
        <span class="inline">Odprta kolesarnica:</span>
        <div style="width: 10px;" class="inline" />
        <Button on:click={async () => {
            await unlockDoor(1);
        }} disabled={!locked[1]} variant="outlined" class="inline">
            <Icon class="material-icons">lock_open</Icon>
            <Label>Odpri vrata</Label>
        </Button>
    </div>
    {#if !locked[1]}
        <br>
        Vrata se zaklenejo čez <b>{lockedTimer[1]}</b> sekund{#if lockedTimer[1] === 1}o{/if}{#if lockedTimer[1] === 2}i{/if}{#if lockedTimer[1] === 3 || lockedTimer[1] === 4}e{/if}.
    {/if}
    <p/>
    ───────────────
    <p/>
    {#if (token === "DEFAULT_TOKEN" || token === "NO_TOKEN")}
        Uporabljate skupni ključ. Skupni ključ bo ostal skrit, saj BežiApp razvijalci ne želimo, da pride do zlorabe.
        BežiApp privzeto uporablja skupni ključ.
        <br>
        Vsi odklepi s skupnim ključem se beležijo, da preprečimo zlorabe. Dnevnika odklepov ne bom bral, ga bom pa posredoval
        vodstvu v primeru, da pride do tatvine z uporabo skupnega ključa. V primeru, da NE uporabljate skupnega ključa, se
        vaši odklepi NE beležijo v BežiApp sistemu, se pa še vedno beležijo v Ringo podatkovni bazi, na katero nimam vpliva.
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
-->
