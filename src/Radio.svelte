<script lang="ts">
    import Tab, { Icon, Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from "@smui/button";
    import {makeRequest, timeConverter} from "./constants";
    import {onMount} from "svelte";
    import SegmentedButton, { Segment } from '@smui/segmented-button';
    import DataTable, {Body, Cell, Head, Row} from "@smui/data-table";
    import insane from "insane";
    import {marked} from "marked";
    import {navigate} from "svelte-navigator";
    import IconButton from "@smui/icon-button";
    import Dialog, {Actions, Content, Title} from "@smui/dialog";
    import Autocomplete from "@smui-extra/autocomplete";
    import CharacterCounter from "@smui/textfield/character-counter";
    import Textfield from "@smui/textfield";

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

    async function getSuggestions() {
        suggestions = await makeRequest(`/radio/suggestions`)
        // sortiramo od najstarejše do najnovejše, da bomo šli po predvidljivem vrstnem redu
        suggestions.sort((a, b) => {
            const [aVal, bVal] = [a["submitted_on"], b["submitted_on"]]['slice']();
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal);
            }
            return Number(aVal) - Number(bVal);
        });
    }

    async function deleteSuggestion(id: string) {
        let fd = new FormData();
        fd.append('id', id);
        await makeRequest(`/radio/suggestions`, "DELETE", fd);
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
        await getSuggestions();
    })
</script>

<h4>Modul trenutno ni v uporabi. Za zdaj je samo demonstracija, na kakšen način bi lahko prenovili šolski radio, da bi le-ta postal malo bolj transparenten s tem katere pesmi spuščajo skozi (ker se mi zdi, da sploh ne upoštevajo predlogov 🙃).</h4>

Samo administratorji Radio modula (BežiApp razvijalci in uredniki šolskega radia) imajo dostop do spremembe statusa pesmi - ne se čuditi, če ne morete spremeniti statusa. Sistem razvršča predloge od najstarejših do najnovejših.

<p/>

<Button on:click={() => navigate("/radio/new")} variant="raised">
    <Icon class="material-icons">add</Icon>
    <Label>Nov predlog</Label>
</Button>

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
            <Cell>Opis</Cell>
            <Cell>Status</Cell>
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
                    <Cell>{@html marked(insane(suggestion.description))}</Cell>
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
