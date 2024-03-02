<script lang="ts">
    import {barvaPredmeta, handleRejection, makeRequest} from "./constants";
    import IconButton from "@smui/icon-button";
    import {onMount} from "svelte";
    import {navigate} from "svelte-navigator";
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import {Icon} from "@smui/button";
    import {Calendar} from "@fullcalendar/core";
    import dayGridPlugin from "@fullcalendar/daygrid";
    import slLocale from '@fullcalendar/core/locales/sl';
    import BottomSheet from "./Widgets/BottomSheet.svelte";

    let gradings;
    let open = [];
    let events = [];

    let openBottomBar = false;
    let eventClicked = undefined;

    let active = "Mesečni pogled";

    async function getGradings() {
        gradings = await makeRequest(`/gradings`)

        console.log(gradings);

        if (gradings.gradings === undefined) return;

        let selected = localStorage.getItem("colorGeneration") ?? "Dolgega imena predmeta";
        let paleta = JSON.parse(localStorage.getItem("palette") ?? "[]");

        events = [];
        for (let i = 0; i < gradings.gradings.length; i++) {
            let grading = gradings.gradings[i];
            let [day, month, year] = grading.datum.split('.');
            events.push({
                title: grading.predmet,
                start: `${year}-${month}-${day}`,
                backgroundColor: barvaPredmeta(selected, paleta, {ime: grading.predmet, kratko_ime: grading.predmet}),
                desc: grading.opis,
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
    <h2>Seznam vseh ocenjevanj</h2>
    <Accordion>
        {#each gradings.gradings as grading, i}
            <Panel bind:open={open[i]}>
                <Header>
                    {grading.predmet} - {grading.datum}
                    <IconButton slot="icon" toggle pressed={open[i]}>
                        <Icon class="material-icons" on>expand_less</Icon>
                        <Icon class="material-icons">expand_more</Icon>
                    </IconButton>
                </Header>
                <Content>
                    {grading.opis}
                </Content>
            </Panel>
        {/each}
    </Accordion>
{/if}
