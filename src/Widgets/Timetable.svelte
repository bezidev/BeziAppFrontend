<style>
    a:link {
        text-decoration: none;
    }

    .time {
        font-weight: normal;
        font-size: 0.93em;
    }
</style>

<script lang="ts">
    import {startOfWeek, addDays, parse, format} from "date-fns";
    import IconButton from "@smui/icon-button";
    import {handleRejection, makeRequest, timeConverter} from "../constants";
    import isMobile from "is-mobile";
    import MeetingCard from "../MeetingCard.svelte";
    import Button, {Icon, Label} from "@smui/button";
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import Accordion, {Panel, Header, Content} from '@smui-extra/accordion';
    import insane from "insane";
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import CircularProgress from '@smui/circular-progress';
    import Error from "./Error.svelte";
    import {marked} from "marked";
    import {Link} from "svelte-routing";
    import {enableNewTimetable, timetableDay} from "../stores";
    import DayTimetable from "../DayTimetable.svelte";
    import Switch from "@smui/switch";
    import FormField from "@smui/form-field";
    import {onMount} from "svelte";
    import type {ErrorRequest} from "../ts/error";

    export let date: Date = new Date();
    let currentDate = new Date(date);
    let nextWeek = localStorage.getItem("next_week") !== "false";
    if ((currentDate.getDay() === 6 || currentDate.getDay() === 0) && nextWeek) {
        console.log("eee", currentDate.getDate(), currentDate.getDay())
        currentDate.setDate(currentDate.getDate() + (currentDate.getDay() === 0 ? 1 : 2));
    }
    let d = ["", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek"];
    timetableDay.set(d[currentDate.getDay()]);
    console.log(currentDate);


    let noviUrnik = localStorage.getItem("noviUrnik") === "true";
    let start: Date = startOfWeek(currentDate, {weekStartsOn: 1})

    timetableDay.subscribe((value) => {
        let m = {"Ponedeljek": 0, "Torek": 1, "Sreda": 2, "Četrtek": 3, "Petek": 4};
        currentDate = addDays(start, m[value]);
    })

    let notifications = [];

    const mobile: boolean = isMobile();

    let ok: number | boolean = -1;

    let developerNotifications = [];

    async function getDeveloperNotifications() {
        //developerNotifications = await makeRequest("/developers/notifications");
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
        return `${dd}.${mm}.${date.getFullYear()}`
    }

    let fmtStart: string = fmtDate(start);

    export let classId: number;
    export let subjectId: number;
    export let teacherId: number;

    async function getTimetable() {
        console.log(fmtStart)
        console.log(classId, teacherId, subjectId)

        let r = await makeRequest(`/timetable?date=${fmtStart}`, "GET", null, false, false, false, true)
        if (r.status_code !== 200) {
            let j: ErrorRequest = {
                message: `Timetable request failed ${r.status_code} ${r}`,
                fileName: `Timetable.svelte/getTimetable()`,
                lineNumber: 83,
                columnNumber: 0,
                stack: r,
            };
            await handleRejection(j);
            return false;
        }

        dates = r.dates;
        timetable = r.days;

        let minN = r.min_hours;
        let maxN = r.max_hours;
        hours = [];
        for (let i = minN; i <= maxN; i++) {
            hours.push(i);
        }

        return true;
    }

    async function getNotifications() {
        //notifications = await makeRequest(`/notifications?only_new=true`)
    }

    let width = window.innerWidth;
    addEventListener("resize", (event) => {
        width = window.innerWidth
        console.log(width);
    });

    onMount(async () => {
        ok = await getTimetable();
        getNotifications();
        getDeveloperNotifications();
    })

    let hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let dates: string[] = ["", "", "", "", "", ""]
    let timetable = [[], [], [], [], []];

    const ure = [
        "7.10–7.55",
        "8.00–8.45",
        "8.50–9.35",
        "9.40–10.25",
        // glavni odmor
        "10.55–11.40",
        "11.45–12.30",
        "12.35–13.20",
        "13.25–14.10",
        "14.15–15.00",
        "15.05–15.50",
        "15.55–16.40",
    ]

    const mobile_ure = [
        "7.10",
        "8.00",
        "8.50",
        "9.40",
        // glavni odmor
        "10.55",
        "11.45",
        "12.35",
        "13.25",
        "14.15",
        "15.05",
        "15.55",
    ]

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
</script>

{#if localStorage.getItem(`account_username`).toLowerCase() === "test" && neprimerniKomentarji}
    Čestitke! Ugotovili ste našo malo skrivnost. Ker ima Google očitno posebne potrebe in zahteva moje prijavne podatke
    za eAsistent, ker morajo "potestirati" aplikacijo, sem ustvaril ta fejk profil. Z njim se <b>NE</b> morete prijaviti v
    eAsistent, lahko pa v BežiApp. Ta profil onemogoča večino stvari, ampak jih dopusti ravno dovolj, da ta aplikacija
    izgleda, kot da je bogo narejena (<i>kašelj</i> pol nedelujoča <i>kašelj</i>), ampak še vedno gre čez Googlovo
    maltretiranje prijave. Tukaj ne boste našli ničesar, večina storitev je za ta račun onemogočenih, po tistih, ki pa
    delajo, pa ne morete delati ničesar drugega, kot si ogledovati stvari (ne morete ustvarjati novih).
    <p/>
{/if}

<IconButton class="material-icons" on:click={() => {
    currentDate.setDate(currentDate.getDate() - 7);
    remakeCalendar();
    getTimetable();
}}>arrow_back
</IconButton>
<IconButton class="material-icons" on:click={() => {
    currentDate.setDate(currentDate.getDate() + 7);
    remakeCalendar();
    getTimetable();
}}>arrow_forward
</IconButton>

{#if ok === true}
    {#if mobile && noviUrnik}
        {#if currentDate.getDay() === 1}
            <DayTimetable date={[dates[0], dates[1]]} today={timetable[0]} tomorrow={timetable[1]} day="PON" hours={hours} />
        {/if}
        {#if currentDate.getDay() === 2}
            <DayTimetable date={[dates[1], dates[2]]} today={timetable[1]} tomorrow={timetable[2]} day="TOR" hours={hours} />
        {/if}
        {#if currentDate.getDay() === 3}
            <DayTimetable date={[dates[2], dates[3]]} today={timetable[2]} tomorrow={timetable[3]} day="SRE" hours={hours} />
        {/if}
        {#if currentDate.getDay() === 4}
            <DayTimetable date={[dates[3], dates[4]]} today={timetable[3].Hours} tomorrow={timetable[4].Hours} day="CET" hours={hours} />
        {/if}
        {#if currentDate.getDay() === 5}
            <DayTimetable date={[dates[4], ""]} today={timetable[4].Hours} tomorrow={[]} day="PET" hours={hours} />
        {/if}
    {:else}
        <table class="coolTable">
            <tr>
                <th style="width: {mobile ? 40 : 80}px;">URA</th>
                <th>{mobile ? "PON" : "PONEDELJEK"}, {format(parse(dates[0], "yyyy-mm-dd", new Date()), `dd. mm.${mobile ? '' : ' yyyy'}`)}</th>
                <th>{mobile ? "TOR" : "TOREK"}, {format(parse(dates[1], "yyyy-mm-dd", new Date()), `dd. mm.${mobile ? '' : ' yyyy'}`)}</th>
                <th>{mobile ? "SRE" : "SREDA"}, {format(parse(dates[2], "yyyy-mm-dd", new Date()), `dd. mm.${mobile ? '' : ' yyyy'}`)}</th>
                <th>{mobile ? "ČET" : "ČETRTEK"}, {format(parse(dates[3], "yyyy-mm-dd", new Date()), `dd. mm.${mobile ? '' : ' yyyy'}`)}</th>
                <th>{mobile ? "PET" : "PETEK"}, {format(parse(dates[4], "yyyy-mm-dd", new Date()), `dd. mm.${mobile ? '' : ' yyyy'}`)}</th>
            </tr>
            {#each hours as i}
                <tr>
                    <th style="width: 40px;">
                        {i}.
                        <br>
                        {#if mobile}<span class="time">{mobile_ure[i]}</span>{:else}<span
                                class="time">{ure[i]}</span>{/if}
                    </th>
                    <td style="padding: {mobile ? 3 : 5}px;">
                        {#if timetable[0].Hours[i]}
                            <MeetingCard n={timetable[0].Hours[i]}/>
                        {/if}
                    </td>
                    <td style="padding: {mobile ? 3 : 5}px;">
                        {#if timetable[1].Hours[i]}
                            <MeetingCard n={timetable[1].Hours[i]}/>
                        {/if}
                    </td>
                    <td style="padding: {mobile ? 3 : 5}px;">
                        {#if timetable[2].Hours[i]}
                            <MeetingCard n={timetable[2].Hours[i]}/>
                        {/if}
                    </td>
                    <td style="padding: {mobile ? 3 : 5}px;">
                        {#if timetable[3].Hours[i]}
                            <MeetingCard n={timetable[3].Hours[i]}/>
                        {/if}
                    </td>
                    <td style="padding: {mobile ? 3 : 5}px;">
                        {#if timetable[4].Hours[i]}
                            <MeetingCard n={timetable[4].Hours[i]}/>
                        {/if}
                    </td>
                </tr>
            {/each}
        </table>
    {/if}
{:else if ok === false}
    <div style="padding: 20px; background-color: darkorange; border-radius: 10px;">
        <h2>Težave s prijavo v eAsistent</h2>
        Očitno ima BežiApp težave s prijavo v eAsistent.
        Hitra dejstva, da ne prezakompliciram stvari:
        <ul>
            <li>To lahko v redkih primerih pomeni, da BežiApp ne deluje.</li>
            <li>Bolj pogosto pa je to, da ste si spremenili eAsistent geslo in o tem niste obvestili BežiAppa (prve
                šolske ure si pri informatiki zamenjate gesla).
            </li>
            <li>V takem primeru je za nadaljnjo uporabo eAsistent storitev BežiApp-a potrebna sprememba eAsistent gesla
                v <Link to="/settings">nastavitvah (čisto na dnu strani)</Link>.
            </li>
            <li>Če ste si ravnokar zamenjali geslo v nastavitvah, pa vam še vedno daje to napako, preverite vneseno
                geslo še enkrat.
            </li>
            <li>Če ste prepričani, da ste vnesli pravilno geslo, kontaktirajte razvijalca na <a
                    href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a></li>
        </ul>
        <br>
    </div>
    <Error error="Neuspešna prijava v eAsistent. Če ste si spremenili geslo za eAsistent, ga morate spremeniti tudi v BežiAppu v zavihku Nastavitve. V nasprotnem primeru kontaktirajte strežniškega administratorja."/>
{:else}
    <div style="display: flex; justify-content: center">
        <CircularProgress style="height: 100px; width: 100px;" indeterminate/>
    </div>
    <div style="display: flex; justify-content: center">
        {#if neprimerniKomentarji}
            jAvAsCrIpT je toooooook počasen.
        {/if}
    </div>
{/if}

<p/>

{#if mobile}
    <FormField>
        <Switch bind:checked={noviUrnik} on:click={() => {
            setTimeout(() => {
                localStorage.setItem("noviUrnik", noviUrnik.toString());
                noviUrnik = localStorage.getItem("noviUrnik") === "true";
                enableNewTimetable.set(noviUrnik);
                //window.location.reload();
            }, 50);
        }}/>

        <span slot="label">Vključite poenostavljeno verzijo urnika</span>
    </FormField>
{/if}

<div style="height: 70px;"/>

<h2>Obvestila</h2>

{#if neprimerniKomentarji}
    BežiApp <s>krade</s> si izposoja obvestila iz intraneta Gimnazije Bežigrad, zato da ne potrebujete uporabljati
    obupnega intraneta.
{/if}

<p/>

<div class="accordion-container">
    <Accordion>
        {#each notifications.reverse() as notification}
            <Panel>
                <Header>{notification.name}</Header>
                <Content>
                    <h3>{notification.name}</h3>

                    {@html insane(notification.description)}

                    <hr>

                    {#if notification.has_attachments}
                        <b>Obvestilo ima <a
                                href="https://gimnazijabezigrad.sharepoint.com/Lists/ObvAkt/DispForm.aspx?ID={notification.id}">priponke</a>.</b>
                        {#if neprimerniKomentarji}
                            BežiApp ne more prikazovati priponk zaradi Microsoftove nesposobnosti (niso naredili API-ja
                            za priponke), zato vas bo klik na povezavo preusmeril na pripadajočo spletno stran na
                            intranetu.
                        {/if}
                    {/if}

                    <p/>

                    Obvestilo poteče dne <b>{timeConverter(notification.expires_on)}</b>
                    Obvestilo je ustvaril <b>{notification.created_by}</b> dne
                    <b>{timeConverter(notification.created_on)}</b>.
                    Obvestilo je nazadnje spremenil <b>{notification.modified_by}</b> dne
                    <b>{timeConverter(notification.modified_on)}</b>.

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

                    BežiApp vam ne bo prikazoval več tega obvestila, če ga označite kot prebranega, razen v primeru, da
                    se obvestilo na intranetu posodobi.
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