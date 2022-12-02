<script lang="ts">
    import {makeRequest} from "./constants";
    import IconButton from "@smui/icon-button";
    import {onMount} from "svelte";
    import {navigate} from "svelte-navigator";
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Select, { Option } from '@smui/select';
    import Button, {Icon, Label} from "@smui/button";
    import insane from "insane";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import { Datepicker } from "svelte-calendar";
    import dayjs from "dayjs";

    let niObdelano = true;
    let opraviceno = true;
    let neopraviceno = true;
    let neSteje = true;

    let absences;
    let open = {};

    const REQUIRED_FORMAT = 'DD.MM.YYYY';

    const datePickerTheme = {
        "calendar": {
            "width": "300px",
            "maxWidth": "100vw",
            "legend": {
                "height": "45px"
            },
            "shadow": "0px 10px 26px rgba(0, 0, 0, 0.25)",
            "colors": {
                "text": {
                    "primary": "#eee",
                    "highlight": "#fff"
                },
                "background": {
                    "primary": "#333",
                    "highlight": "#5829d6",
                    "hover": "#222"
                },
                "border": "#222"
            },
            "font": {
                "regular": "1.5em",
                "large": "37em"
            },
            "grid": {
                "disabledOpacity": ".5",
                "outsiderOpacity": ".7"
            }
        }
    };

    async function getAbsences() {
        absences = await makeRequest(`/absences?from_date=${date1}&to_date=${date2}&ni_obdelano=${niObdelano}&opraviceno=${opraviceno}&neopraviceno=${neopraviceno}&ne_steje=${neSteje}`)
        for (let i in absences.absences) {
            open[i] = [];
        }
    }

    $: {
        console.log($store1, $store2);
        if ($store1 !== undefined) date1 = dayjs($store1.selected).format(REQUIRED_FORMAT);
        if ($store2 !== undefined) date2 = dayjs($store2.selected).format(REQUIRED_FORMAT);
    }

    let store1;
    let store2;

    let date1 = "";
    let date2 = "";

    onMount(async () => {
        const TIME = dayjs();

        date1 = TIME.format(REQUIRED_FORMAT);
        date2 = TIME.add(1, 'M').format(REQUIRED_FORMAT);

        try {
            setTimeout(getAbsences, 200);
        } catch (e) {
            console.log(e)
            navigate("/login")
        }
    })
</script>
<style>
    .absence-date-select-grid {
        display: flex;
    }
    .absence-date-picker-button {
        margin: 0 0 0 1em;
    }
</style>
<div class="absence-date-select-grid">
    <h3>Izberite začetni datum: </h3>
    <Datepicker bind:store={store1} let:key let:send let:receive theme={datePickerTheme} style="min-height: auto">
        <button in:receive|local={{ key }} out:send|local={{ key }} class="absence-date-picker-button mdc-button">
            {#if $store1?.hasChosen}
                {date1}
            {:else}
                Izberite datum
            {/if}
        </button>
    </Datepicker>
</div>
<div class="absence-date-select-grid">
    <h3>Izberite končni datum: </h3>
    <Datepicker bind:store={store2} let:key let:send let:receive theme={datePickerTheme} style="min-height: auto">
        <button in:receive|local={{ key }} out:send|local={{ key }} class="absence-date-picker-button mdc-button mdc-button--raised mdc-ripple-upgraded">
            {#if $store2?.hasChosen}
                {date2}
            {:else}
                Izberite datum
            {/if}
        </button>
    </Datepicker>
</div>
<FormField>
    <Switch bind:checked={niObdelano} />
    <span slot="label">Ni obdelano</span>
</FormField><br>
<FormField>
    <Switch bind:checked={opraviceno} />
    <span slot="label">Opravičeno</span>
</FormField><br>
<FormField>
    <Switch bind:checked={neopraviceno} />
    <span slot="label">Ne opravičeno</span>
</FormField><br>
<FormField>
    <Switch bind:checked={neSteje} />
    <span slot="label">Ne šteje</span>
</FormField><p/>
<Button on:click={async () => await getAbsences()}>
    <Icon class="material-icons">refresh</Icon>
    <Label>Ponovno naložite</Label>
</Button>
{#if absences}
    <Accordion>
        {#each Object.entries(absences.absences) as [k, v]}
            <h2>{k}</h2>
            {#each v as absence, i}
                <Panel bind:open={open[k][i]}>
                    <Header>
                        {absence.predmet} - {absence.ura} - {absence.status}
                        <IconButton slot="icon" toggle pressed={open[k][i]}>
                            <Icon class="material-icons" on>expand_less</Icon>
                            <Icon class="material-icons">expand_more</Icon>
                        </IconButton>
                    </Header>
                    <Content>
                        {absence.opomba}
                    </Content>
                </Panel>
            {/each}
        {/each}
    </Accordion>
{/if}
