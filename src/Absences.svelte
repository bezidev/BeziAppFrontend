<script lang="ts">
    import {handleRejection, makeRequest} from "./constants";
    import IconButton from "@smui/icon-button";
    import {onMount} from "svelte";
    import {navigate} from "svelte-routing";
    import Accordion, {Panel, Header, Content} from '@smui-extra/accordion';
    import Button, {Icon, Label} from "@smui/button";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {Datepicker} from "svelte-calendar";
    import dayjs from "dayjs";
    import type {ErrorRequest} from "./ts/error";
    import type {AbsencesResponse} from "./ts/absences";
    import {format, getDay, getISODay, parse} from "date-fns";
    import {marked} from "marked";
    import LayoutGrid, {Cell} from "@smui/layout-grid";
    import Card from "@smui/card";

    let absences: AbsencesResponse = {items: [], summary: {pending_hours: 0, excused_hours: 0, unexcused_hours: 0, unmanaged_absences: 0}};
    let open = {};

    const days = {
        1: "ponedeljek",
        2: "torek",
        3: "sreda",
        4: "četrtek",
        5: "petek",
        6: "sobota",
        7: "nedelja",
    }

    async function getAbsences() {
        absences = await makeRequest(`/absences`)
    }

    onMount(async () => {
        await getAbsences();
    })
</script>

<h2 style="text-align: center;">Izostanki</h2>
Skupaj opravičenih ur: {absences.summary.excused_hours}<br>
Skupaj neopravičenih ur: {absences.summary.unexcused_hours}<br>

<LayoutGrid>
    {#each absences.items as date}
        <Cell span={4}>
            <Card variant="outlined" style="overflow: hidden; height: 100%;" padded>
                <div class="sameline" style="text-wrap: wrap; width: 100%;">
                    <span class="inline uppercase-first-letter" style="font-size: 20px; width: 95%; text-wrap: wrap;">
                        Odsotnosti z dne <b>{days[getISODay(date.date)]}, {format(parse(date.date, "yyyy-mm-dd", new Date()), `dd. mm. yyyy`)}</b>
                    </span>
                    <div class="big-break"/>
                    <span class="sameline" style="text-wrap: wrap">Število opravičenih ur: <b>{date.excused_count}</b></span><br>
                    <span class="sameline" style="text-wrap: wrap">Število neopravičenih ur: <b>{date.not_excused_count}</b></span><br>
                    {#if date.excuse_description !== null}
                        <p/>
                        Razlog:
                        <br>
                        <span style="text-wrap: wrap;">{date.excuse_description}</span>
                    {/if}
                    <p/>
                    {#each date.hours as hour}
                        <div style="display: flex; flex-wrap: wrap; align-items: center;">
                        {#if hour.state === "excused"}
                            <Icon class="material-icons" style="color: lightgreen;">check</Icon>
                        {:else if hour.state === "unexcused"}
                            <Icon class="material-icons" style="color: red;">close</Icon>
                        {:else if hour.state === "pending" || hour.state === "unmanaged"}
                            <Icon class="material-icons" style="color: yellow;">schedule</Icon>
                        {/if}

                        <div style="width: 10px;"></div>

                        {hour.class_name} ({hour.class_short_name})
                        </div>
                    {/each}
                </div>
                <br>
            </Card>
        </Cell>
    {/each}
</LayoutGrid>
