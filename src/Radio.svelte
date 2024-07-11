<script lang="ts">
    import Tab, { Icon, Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from "@smui/button";
    import {handleRejection, makeRequest, timeConverter} from "./constants";
    import {onMount} from "svelte";
    import SegmentedButton, { Segment } from '@smui/segmented-button';
    import DataTable, {Body, Cell, Head, Row} from "@smui/data-table";
    import insane from "insane";
    import {marked} from "marked";
    import {navigate} from "svelte-routing";
    import IconButton from "@smui/icon-button";
    import Dialog, {Actions, Content, Title} from "@smui/dialog";
    import Autocomplete from "@smui-extra/autocomplete";
    import CharacterCounter from "@smui/textfield/character-counter";
    import Textfield from "@smui/textfield";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";

    const choices = ['WAITING FOR REVIEW', 'APPROVED', 'DENIED', 'PLAYED'];
    const tabs = [
        {
            icon: 'pending',
            label: 'Predlogi na čakanju',
        },
        {
            icon: 'thumb_up_alt',
            label: 'Odobreni predlogi',
        },
        {
            icon: 'thumb_down_alt',
            label: 'Zavrnjeni predlogi',
        },
        {
            icon: 'play_circle_filled',
            label: 'Predvajane pesmi',
        },
        {
            icon: 'video_library',
            label: 'Vsi predlogi',
        },
    ];
    let active = tabs[0];

    let suggestions = [];
    let denied_id = "";
    let open = false;
    let denied_description = "";
    let is_admin = false;
    let block_new_radio_suggestions = false;
    let allow_voting = false;

    async function getSuggestions() {
        let s = await makeRequest(`/radio/suggestions`);
        block_new_radio_suggestions = s["block_new_radio_suggestions"];
        allow_voting = s["allow_voting"];
        is_admin = s["is_admin"];
        // sortiramo od najstarejše do najnovejše, da bomo šli po predvidljivem vrstnem redu
        s["suggestions"].sort((a, b) => {
            const [aVal, bVal] = [a["submitted_on"], b["submitted_on"]]['slice']();
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal);
            }
            return Number(aVal) - Number(bVal);
        });
        suggestions = s["suggestions"];
    }

    async function deleteSuggestion(id: string) {
        let fd = new FormData();
        fd.append('id', id);
        await makeRequest(`/radio/suggestions`, "DELETE", fd);
        await getSuggestions();
    }

    async function changeRadioConfig(id: string) {
        let fd = new FormData();
        fd.append('id', id);
        await makeRequest(`/radio/admin/config`, "PATCH", fd);
        await getSuggestions();
    }

    async function vote(id: string, ud: string) {
        let fd = new FormData();
        fd.append("id", id);
        fd.append("t", ud);
        await makeRequest(`/radio/suggestions/upvote_downvote`, "PATCH", fd);
        await getSuggestions();
    }

    async function updateStatus(id: string, newStatus: string) {
        let fd = new FormData();
        fd.append('id', id);
        fd.append('s', newStatus);
        if (newStatus === "DENIED") fd.append("declined_description", denied_description);
        else fd.append("declined_description", " ");
        await makeRequest(`/radio/suggestions`, "PATCH", fd)
        await getSuggestions();
    }

    async function deny(id: string) {
        if (denied_description === "") return;
        await updateStatus(id, "DENIED");
    }

    onMount(async () => {
        try {
            await getSuggestions();
        } catch (e) {
            let j = {
                message: "Error while fetching suggestions",
                fileName: `Radio.svelte/onMount()`,
                lineNumber: 0,
                columnNumber: 0,
                stack: e.toString(),
            };
            await handleRejection(j);
        }
    })
</script>

{#if is_admin}
    <h3>Administratorska plošča šolskega radia</h3>
    To ploščo lahko vidite samo, če ste administratorji sistema. V tem primeru imate vse pravice znotraj sistema šolskega radia.

    <p/>

    <FormField>
        <Switch bind:checked={block_new_radio_suggestions} on:click={async () => await changeRadioConfig("block_new_radio_suggestions")} />
        <span slot="label">Blokiraj nove predloge.</span>
    </FormField>

    <br>

    <FormField>
        <Switch bind:checked={allow_voting} on:click={async () => await changeRadioConfig("allow_voting")} />
        <span slot="label">Dovolite glasovanje za pesmi. Stranski efekt tega je, da se bodo vsem prikazale vse pesmi (seveda anonimno).</span>
    </FormField>

    <h3>Pregled</h3>
{/if}

<Button on:click={getSuggestions} variant="raised">
    <Icon class="material-icons">refresh</Icon>
    <Label>Osveži predloge</Label>
</Button>

<Button on:click={() => navigate("/radio/new")} variant="raised" disabled={block_new_radio_suggestions}>
    <Icon class="material-icons">add</Icon>
    <Label>Nov predlog</Label>
</Button>

{#if block_new_radio_suggestions}
    Administratorji šolskega radia so začasno ustavili nove predloge.
{/if}

<p/>

<TabBar {tabs} let:tab bind:active>
    <Tab {tab}>
        <Icon class="material-icons">{tab.icon}</Icon>
        <Label>{tab.label}</Label>
    </Tab>
</TabBar>

<p/>
<DataTable table$aria-label="Predlogi" style="width: 100%;">
    <Head>
        <Row>
            <Cell>Naslov</Cell>
            <Cell>YouTube povezava</Cell>
            {#if allow_voting && active.label === "Predlogi na čakanju"}<Cell>Glasovanje</Cell>{/if}
            <Cell>Opis</Cell>
            {#if is_admin}<Cell>Status</Cell>{/if}
            {#if active.label === "Zavrnjeni predlogi" || active.label === "Vsi predlogi"}<Cell>Razlog za zavrnitev</Cell>{/if}
            {#if active.label !== "Predlogi na čakanju"}<Cell>Pregledal(a)</Cell>{/if}
            {#if active.label === "Predlogi na čakanju" || active.label === "Odobreni predlogi" || active.label === "Vsi predlogi"}<Cell>Položaj v vrsti</Cell>{/if}
            <Cell>Zadnja sprememba</Cell>
            <Cell>Predlog poslan</Cell>
            <Cell>Izbris</Cell>
        </Row>
    </Head>
    <Body>
        {#each suggestions as suggestion}
            {#if (active.label === "Predlogi na čakanju" && suggestion.status === "WAITING FOR REVIEW") ||
                (active.label === "Odobreni predlogi" && suggestion.status === "APPROVED") ||
                (active.label === "Zavrnjeni predlogi" && suggestion.status === "DENIED") ||
                (active.label === "Predvajane pesmi" && suggestion.status === "PLAYED") ||
                (active.label === "Vsi predlogi")}
                <Row>
                    <Cell>{suggestion.name}</Cell>
                    <Cell><a href="https://youtu.be/{suggestion.youtube_id}">https://youtu.be/{suggestion.youtube_id}</a></Cell>
                    {#if allow_voting && active.label === "Predlogi na čakanju"}
                        <Cell>
                            <div style="display: flex;">
                                <IconButton class="material-icons inline" style="color: {suggestion.upvote_status === -1 ? 'rgb(0, 128, 83)' : ''};" on:click={async () => await vote(suggestion.id, "downvote")}>
                                    <div style="margin: 0 0 0 0.1em;">thumb_down</div>
                                </IconButton>
                                <div style="width: 10px;"/>
                                <span style="display: flex; align-items: center; justify-content: center; flex-direction: column; font-size: 20px;">{suggestion.upvote_count}</span>
                                <div style="width: 10px;"/>
                                <IconButton class="material-icons inline" style="color: {suggestion.upvote_status === 1 ? 'rgb(0, 128, 83)' : ''};" on:click={async () => await vote(suggestion.id, "upvote")}>
                                    <div style="margin: 0 0 0 0.1em;">thumb_up</div>
                                </IconButton>
                            </div>
                        </Cell>
                    {/if}
                    <Cell>{@html insane(marked(suggestion.description))}</Cell>
                    {#if is_admin}
                        <Cell>
                            <SegmentedButton segments={choices} let:segment singleSelect bind:selected={suggestion.status}>
                                <!-- Note: the `segment` property is required! -->
                                <Segment {segment} on:click={async (e) => {
                                    denied_id = suggestion.id;
                                    if (segment === "DENIED") {
                                        open = true;
                                        e.preventDefault();
                                    } else {
                                        await updateStatus(denied_id, segment);
                                    }
                                }}>
                                    <Label>{segment}</Label>
                                </Segment>
                            </SegmentedButton>
                        </Cell>
                    {/if}
                    {#if active.label === "Zavrnjeni predlogi" || active.label === "Vsi predlogi"}<Cell>{suggestion.declined_reason}</Cell>{/if}
                    {#if active.label !== "Predlogi na čakanju"}<Cell>{suggestion.reviewed_by}</Cell>{/if}
                    {#if active.label === "Predlogi na čakanju" || active.label === "Odobreni predlogi" || active.label === "Vsi predlogi"}<Cell>{suggestion.vrsta}</Cell>{/if}
                    <Cell>{timeConverter(suggestion.last_status_update)}</Cell>
                    <Cell>{timeConverter(suggestion.submitted_on)}</Cell>
                    {#if suggestion.can_delete}
                        <Cell>
                            <IconButton style="margin: 0 0 0 0.5em;" class="material-icons" on:click={() => deleteSuggestion(suggestion.id)}>delete</IconButton>
                        </Cell>
                    {/if}
                </Row>
            {/if}
        {/each}
    </Body>
</DataTable>

<Dialog
        bind:open
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <Title id="simple-title">Zavrni predlog pesmi</Title>
    <Content id="simple-content">
        <br>
        <Textfield textarea style="width: 500px;" input$maxlength={1000} bind:value={denied_description} label="Obvezna obrazložitev, zakaj zavračate predlog.">
            <CharacterCounter slot="internalCounter">0 / 1000</CharacterCounter>
        </Textfield>
    </Content>
    <Actions>
        <Button on:click={async () => await deny(denied_id)} variant="raised">
            <Icon class="material-icons">block</Icon>
            <Label>Zavrni</Label>
        </Button>
    </Actions>
</Dialog>
