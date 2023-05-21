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
    import {makeRequest} from "../constants";
    import isMobile from "is-mobile";
    import MeetingCard from "../MeetingCard.svelte";
    import {Icon} from "@smui/button";
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import Banner, { Label } from '@smui/banner';
    import Button from '@smui/button';

    export let date: Date = new Date();
    let currentDate = new Date(date);

    let start: Date = startOfWeek(currentDate, {weekStartsOn: 1})
    let end: Date = endOfWeek(currentDate, {weekStartsOn: 1})

    const mobile: boolean = isMobile();

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

        let r = await makeRequest(`/timetable?date=${fmtStart}`)
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
    }

    const hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let dates: string[] = ["", "", "", "", "", ""]
    let mon: Meeting[] = [];
    let tue: Meeting[] = [];
    let wed: Meeting[] = [];
    let thu: Meeting[] = [];
    let fri: Meeting[] = [];
</script>

{#if localStorage.getItem(`gimsis_username`).toLowerCase() === "test"}
    Čestitke! Ugotovili ste našo malo skrivnost. Ker ima Google očitno posebne potrebe in zahteva moje prijavne podatke za GimSIS, ker morajo "potestirati" aplikacijo, sem ustvaril ta fejk profil. Z njim se <b>NE</b> morete prijaviti v GimSIS, lahko pa v BežiApp. Ta profil onemogoča večino stvari, ampak jih dopusti ravno dovolj, da ta aplikacija izgleda, kot da je bogo narejena (<i>kašelj</i> pol nedelujoča <i>kašelj</i>), ampak še vedno gre čez Googlovo maltretiranje prijave. Tukaj ne boste našli ničesar, večina storitev je za ta račun onemogočenih, po tistih, ki pa delajo, pa ne morete delati ničesar drugega, kot si ogledovati stvari (ne morete ustvarjati novih).
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

{#await getTimetable()}
{:then _}
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
{/await}