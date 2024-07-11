<script lang="ts">
    import {barvaPredmeta, gradeColors, handleRejection, makeRequest} from "./constants";
    import IconButton from "@smui/icon-button";
    import {onMount} from "svelte";
    import {navigate} from "svelte-routing";
    import Accordion, { Panel, Header } from '@smui-extra/accordion';
    import {Icon} from "@smui/button";
    import {Calendar} from "@fullcalendar/core";
    import dayGridPlugin from "@fullcalendar/daygrid";
    import slLocale from '@fullcalendar/core/locales/sl';
    import BottomSheet from "./Widgets/BottomSheet.svelte";
    import type {GradingsResponse} from "./ts/gradings";
    import Card, { Content } from '@smui/card';
    import LayoutGrid, { Cell } from "@smui/layout-grid";
    import {formatDate} from "date-fns";

    let gradings: GradingsResponse;
    let open = [];
    let events = [];

    let openBottomBar = false;
    let eventClicked = undefined;

    let active = "Mesečni pogled";

    async function getGradings() {
        gradings = await makeRequest(`/gradings`)

        console.log(gradings);

        let allGradings = [...gradings.past, ...gradings.future];

        let selected = localStorage.getItem("colorGeneration") ?? "Dolgega imena predmeta";
        let paleta = JSON.parse(localStorage.getItem("palette") ?? "[]");

        events = [];
        for (let i = 0; i < allGradings.length; i++) {
            let grading = allGradings[i];
            //let [year, month, day] = grading.Date.split('-');
            events.push({
                title: grading.Course,
                start: grading.Date,
                backgroundColor: barvaPredmeta(selected, paleta, {subject: {name: grading.Course}}),
                desc: grading.GradingName,
            })
        }

        console.log(events);

        let calendarEl = document.getElementById('calendar');

        let calendar = new Calendar(calendarEl, {
            locales: [ slLocale ],
            locale: 'sl',
            plugins: [dayGridPlugin],
            timeZone: 'UTC',
            initialView: 'dayGridMonth',
            events: events,
            editable: false,
            selectable: false,
            expandRows: true,
            aspectRatio: 0.8,
            eventClick: (e) => {
                eventClicked = e.event._def;
                openBottomBar = true;
            },
        });

        calendar.render();
    }

    onMount(async () => {
        try {
            await getGradings();
        } catch (e) {
            console.log(e);
            let j = {
                message: "Error while fetching gradings",
                fileName: `Gradings.svelte/onMount()`,
                lineNumber: 0,
                columnNumber: 0,
                stack: e.toString(),
            };
            await handleRejection(j);
            navigate("/login")
        }
    })
</script>

<div id="calendar" style="max-width: 500px;"></div>
{#if eventClicked !== undefined}
    <BottomSheet open={openBottomBar} callback={(value) => {
        openBottomBar = value;
        if (!value) eventClicked = undefined;
    }}>
        <main class="body fill">
            <h1>{eventClicked.title}</h1>
            {eventClicked.extendedProps.desc}
        </main>
    </BottomSheet>
{/if}

<p/>

{#if gradings}
    <h2>Seznam prihodnjih ocenjevanj</h2>
    <div style="width: 100%;">
        <LayoutGrid>
            {#each gradings.future as grading, i}
                <Cell span={4}>
                    <Card variant="outlined" padded>
                        <span class="sameline">
                            <span class="inline"><b>{grading.Course}</b> – {grading.Date}</span>
                        </span>
                        <br>
                        {grading.GradingName}
                    </Card>
                </Cell>
            {/each}
        </LayoutGrid>
    </div>

    <h2>Seznam preteklih ocenjevanj</h2>
    <div style="width: 100%;">
        <LayoutGrid>
            {#each gradings.past as grading, i}
                <Cell span={4}>
                    <Card variant="outlined" padded>
                        <span class="sameline">
                            <span class="inline"><b>{grading.Course}</b> – {formatDate(Date.parse(grading.Date), "d. M. yyyy")}</span>
                            {#if grading.Grade !== -1}<span class="inline" style="float: right; color: {gradeColors[grading.Grade]}; font-size: 25px; font-weight: bold;">{grading.Grade}</span>{/if}
                        </span>
                        <br>
                        {grading.GradingName}
                    </Card>
                </Cell>
            {/each}
        </LayoutGrid>
    </div>
{/if}
