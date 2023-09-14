<style>
    .coolTable {
        border-spacing: 5px;
        text-align: center;
        width: 100%;
    }

    a:link {
        text-decoration: none;
    }
</style>

<script lang="ts">
    import {
        startOfWeek,
        endOfWeek
    } from "date-fns";
    import IconButton from "@smui/icon-button";
    import {handleRejection, makeRequest, timeConverter} from "../constants";
    import isMobile from "is-mobile";
    import MeetingCard from "../MeetingCard.svelte";
    import Button, {Icon, Label} from "@smui/button";
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import {onMount} from "svelte";
    import insane from "insane";
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import CircularProgress from '@smui/circular-progress';
    import Error from "./Error.svelte";
    import {marked} from "marked";

    export let date: Date = new Date();
    let currentDate = new Date(date);
    let nextWeek = localStorage.getItem("next_week") !== "false";
    if ((currentDate.getDay() === 6 || currentDate.getDay() === 0) && nextWeek) {
        currentDate.setDate(currentDate.getDate() + 7);
    }

    let start: Date = startOfWeek(currentDate, {weekStartsOn: 1})

    let notifications = [];

    const mobile: boolean = isMobile();

    let ok: number | boolean = -1;

    let developerNotifications = [];
    async function getDeveloperNotifications() {
        developerNotifications = await makeRequest("/developers/notifications");
    }

    function remakeCalendar() {
        start = startOfWeek(currentDate, {weekStartsOn: 1})
        fmtStart = fmtDate(start);
    }

    function fmtDate(date: Date): string {
        let dd = date.getDate().toString()
        if (dd.length == 1) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm.length == 1 && (date.getMonth() + 1).toString().length == 1) {
            mm = `0${(date.getMonth() + 1)}`
        } else if ((date.getMonth() + 1).toString().length != 1) {
            mm = (date.getMonth() + 1).toString();
        }
        return `${dd} ${mm} ${date.getFullYear()}`
    }

    let fmtStart: string = fmtDate(start);

    export let classId: number;
    export let subjectId: number;
    export let teacherId: number;

    let warn;

    async function getTimetable() {
        console.log(fmtStart)
        console.log(classId, teacherId, subjectId)

        let r = await makeRequest(`/timetable?date=${fmtStart}`, "GET", null, false, false, false, true)
        if (r.status_code !== 200) {
            let j = {
                message: `Timetable request failed ${r.status_code} ${r}`,
                fileName: `Timetable.svelte/getTimetable()`,
                lineNumber: 83,
                columnNumber: 0,
                stack: r,
            };
            await handleRejection(j);
            return false;
        }
        mon = r["classes"][0];
        tue = r["classes"][1];
        wed = r["classes"][2];
        thu = r["classes"][3];
        fri = r["classes"][4];
        dates = r["days"];
        warn = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false
        }
        for (let i in r["classes"]) {
            for (let n in r["classes"][i]) {
                if (r["classes"][i][n].opozori === true) {
                    warn[i] = true
                    break;
                }
            }
        }
        return true;
    }

    async function getNotifications() {
        notifications = await makeRequest(`/notifications?only_new=true`)
    }

    let width = window.innerWidth;
    addEventListener("resize", (event) => {
        width = window.innerWidth
        console.log(width);
    });

    getNotifications();
    getDeveloperNotifications();
    getTimetable().then((o) => ok = o);

    const hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let dates: string[] = ["", "", "", "", "", ""]
    let mon = [];
    let tue = [];
    let wed = [];
    let thu = [];
    let fri = [];

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
</script>

{#if localStorage.getItem(`account_username`).toLowerCase() === "test" && neprimerniKomentarji}
    Čestitke! Ugotovili ste našo malo skrivnost. Ker ima Google očitno posebne potrebe in zahteva moje prijavne podatke za GimSIS, ker morajo "potestirati" aplikacijo, sem ustvaril ta fejk profil. Z njim se <b>NE</b> morete prijaviti v GimSIS, lahko pa v BežiApp. Ta profil onemogoča večino stvari, ampak jih dopusti ravno dovolj, da ta aplikacija izgleda, kot da je bogo narejena (<i>kašelj</i> pol nedelujoča <i>kašelj</i>), ampak še vedno gre čez Googlovo maltretiranje prijave. Tukaj ne boste našli ničesar, večina storitev je za ta račun onemogočenih, po tistih, ki pa delajo, pa ne morete delati ničesar drugega, kot si ogledovati stvari (ne morete ustvarjati novih).
    <p/>
{/if}

<IconButton class="material-icons" on:click={() => {
    currentDate.setDate(currentDate.getDate() - 7);
    remakeCalendar();
    getTimetable();
}}>arrow_back</IconButton>
<IconButton class="material-icons" on:click={() => {
    currentDate.setDate(currentDate.getDate() + 7);
    remakeCalendar();
    getTimetable();
}}>arrow_forward</IconButton>

{#if ok === true}
    <table class="coolTable">
        <tr>
            <th>URA</th>
            <th>{mobile ? "PON" : "PONEDELJEK"} {dates[0]} {#if warn[0] === true}<br><Wrapper><Icon class="material-icons">warning</Icon><Tooltip>BežiApp ni uspel preveriti vseh nadomeščanj z visoko stopnjo zanesljivosti. Prosimo, če ročno preverite nadomeščanja za ta dan.</Tooltip></Wrapper>{/if}</th>
            <th>{mobile ? "TOR" : "TOREK"} {dates[1]} {#if warn[1] === true}<br><Wrapper><Icon class="material-icons">warning</Icon><Tooltip>BežiApp ni uspel preveriti vseh nadomeščanj z visoko stopnjo zanesljivosti. Prosimo, če ročno preverite nadomeščanja za ta dan.</Tooltip></Wrapper>{/if}</th>
            <th>{mobile ? "SRE" : "SREDA"} {dates[2]} {#if warn[2] === true}<br><Wrapper><Icon class="material-icons">warning</Icon><Tooltip>BežiApp ni uspel preveriti vseh nadomeščanj z visoko stopnjo zanesljivosti. Prosimo, če ročno preverite nadomeščanja za ta dan.</Tooltip></Wrapper>{/if}</th>
            <th>{mobile ? "ČET" : "ČETRTEK"} {dates[3]} {#if warn[3] === true}<br><Wrapper><Icon class="material-icons">warning</Icon><Tooltip>BežiApp ni uspel preveriti vseh nadomeščanj z visoko stopnjo zanesljivosti. Prosimo, če ročno preverite nadomeščanja za ta dan.</Tooltip></Wrapper>{/if}</th>
            <th>{mobile ? "PET" : "PETEK"} {dates[4]} {#if warn[4] === true}<br><Wrapper><Icon class="material-icons">warning</Icon><Tooltip>BežiApp ni uspel preveriti vseh nadomeščanj z visoko stopnjo zanesljivosti. Prosimo, če ročno preverite nadomeščanja za ta dan.</Tooltip></Wrapper>{/if}</th>
        </tr>
        {#each hours as m, i}
        <tr>
            <th>{i}.</th>
            <td>
                <div class="sameline">
                    {#each Array(mon[i]) as m}
                        {#if m}
                            <MeetingCard n={m} />
                        {/if}
                    {/each}
                </div>
            </td>
            <td>
                <div class="sameline">
                    {#each Array(tue[i]) as m}
                        {#if m}
                            <MeetingCard n={m} />
                        {/if}
                    {/each}
                </div>
            </td>
            <td>
                <div class="sameline">
                    {#each Array(wed[i]) as m}
                        {#if m}
                            <MeetingCard n={m} />
                        {/if}
                    {/each}
                </div>
            </td>
            <td>
                <div class="sameline">
                    {#each Array(thu[i]) as m}
                        {#if m}
                            <MeetingCard n={m} />
                        {/if}
                    {/each}
                </div>
            </td>
            <td>
                <div class="sameline">
                    {#each Array(fri[i]) as m}
                        {#if m}
                            <MeetingCard n={m} />
                        {/if}
                    {/each}
                </div>
            </td>
        </tr>
        {/each}
    </table>
{:else if ok === false}
    <Error error="Neuspešna prijava v GimSIS. Če ste si spremenili geslo za GimSIS, ga morate spremeniti tudi v BežiAppu v zavihku Nastavitve. V nasprotnem primeru kontaktirajte strežniškega administratorja."/>
{:else}
    <div style="display: flex; justify-content: center">
        <CircularProgress style="height: 100px; width: 100px;" indeterminate />
    </div>
    <div style="display: flex; justify-content: center">
        {#if neprimerniKomentarji}
            jAvAsCrIpT je toooooook počasen.
        {/if}
    </div>
{/if}

<div style="height: 70px;"/>

<h2>Obvestila</h2>

{#if neprimerniKomentarji}
    BežiApp <s>krade</s> si izposoja obvestila iz intraneta Gimnazije Bežigrad, zato da ne potrebujete uporabljati obupnega intraneta.
{/if}

<p/>

<div class="accordion-container">
    <Accordion>
        {#each notifications as notification}
            <Panel>
                <Header>{notification.name}</Header>
                <Content>
                    {@html insane(notification.description)}

                    <hr>

                    {#if notification.has_attachments}
                        <b>Obvestilo ima <a href="https://gimnazijabezigrad.sharepoint.com/Lists/ObvAkt/DispForm.aspx?ID={notification.id}">priponke</a>.</b>
                        {#if neprimerniKomentarji}
                            BežiApp ne more prikazovati priponk zaradi Microsoftove nesposobnosti (niso naredili API-ja za priponke), zato vas bo klik na povezavo preusmeril na pripadajočo spletno stran na intranetu.
                        {/if}
                    {/if}

                    <p/>

                    Obvestilo poteče dne <b>{timeConverter(notification.expires_on)}</b>
                    Obvestilo je ustvaril <b>{notification.created_by}</b> dne <b>{timeConverter(notification.created_on)}</b>.
                    Obvestilo je nazadnje spremenil <b>{notification.modified_by}</b> dne <b>{timeConverter(notification.modified_on)}</b>.

                    <p/>

                    <Button on:click={async () => {
                        let fd = new FormData();
                        await makeRequest(`/notifications/${notification.id}`, "POST", fd);
                        await getNotifications();
                    }} variant="raised">
                        <Icon class="material-icons">visibility</Icon>
                        <Label>Označi kot prebrano</Label>
                    </Button>

                    <p/>

                    BežiApp vam ne bo prikazoval več tega obvestila, če ga označite kot prebranega, razen v primeru, da se obvestilo na intranetu posodobi.
                </Content>
            </Panel>
        {/each}
    </Accordion>
</div>

<p/>

<LayoutGrid>
    {#each developerNotifications as notification}
        {#if notification.notification_type === "gimsis_closed" || notification.notification_type === "general"}
            <Cell span={12 / Math.floor(95 / Math.max(width / 700, 1))}>
                <div style="padding: 10px; background-color: darkorange; border-radius: 10px;">
                    <h2>{notification.name}</h2>
                    {@html insane(marked(notification.description))}
                </div>
            </Cell>
        {/if}
    {/each}
</LayoutGrid>