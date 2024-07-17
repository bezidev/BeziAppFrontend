<script lang="ts">
    import {makeRequest, timeConverter} from "./constants";
    import SegmentedButton, { Segment } from '@smui/segmented-button';
    import Button, {Icon, Label} from "@smui/button";
    import Textfield from "@smui/textfield";
    import IconButton from "@smui/icon-button";
    import DataTable, {Body, Cell, Head, Row} from "@smui/data-table";
    import LayoutGrid, {Cell as LayoutCell} from '@smui/layout-grid';
    import Switch from "@smui/switch";
    import FormField from "@smui/form-field";

    const DEFAULT_PALETTE = [
        {id: "SLO", color: "#2b1e76"},
        {id: "MAT", color: "#2e1f27"},
        {id: "ANG", color: "#1c5e42"},
        {id: "NEM", color: "#00a86b"},
        {id: "FRA", color: "#00a86b"},
        {id: "ŠPA", color: "#00a86b"},
        {id: "KEM", color: "#432818"},
        {id: "FIZ", color: "#003d5b"},
        {id: "BIO", color: "#ed2939"},
        {id: "INF", color: "#62b4a5"},
        {id: "ZGO", color: "#957d95"},
        {id: "GEO", color: "#5294e2"},
        {id: "LUM", color: "#ff9966"},
        {id: "GLA", color: "#5d5d5d"},
        {id: "ŠVZ", color: "#ae5a41"},
        {id: "RU", color: "#ee6c4d"},
        {id: "SOC", color: "#1e5a76"},
        {id: "PSI", color: "#671d47"},
        {id: "FIL", color: "#001d4f"}
    ];

    let choices = ["Kratkega imena predmeta", "Dolgega imena predmeta", "Lastne barvne plošče"];
    let selected = localStorage.getItem("colorGeneration") ?? "Dolgega imena predmeta";
    let predmeti = JSON.parse(localStorage.getItem("palette") ?? JSON.stringify(DEFAULT_PALETTE));

    let palettes = [];
    let zasebno_avtorstvo = false;

    async function getPalettes() {
        palettes = await makeRequest(`/palettes`)
    }

    async function getCurrentPalette() {
        predmeti = await makeRequest("/palette") ?? [];
        localStorage.setItem("palette", JSON.stringify(predmeti));
    }

    function setPalette() {
        localStorage.setItem("colorGeneration", "Lastne barvne plošče");
        selected = localStorage.getItem("colorGeneration") ?? "Dolgega imena predmeta";
    }

    getPalettes();
</script>

Modul se vrne kmalu!

<!--
<h2>Generacija barv na urniku</h2>
BežiApp bo generiral barve na urniku na osnovi

<br>

<SegmentedButton segments={choices} let:segment singleSelect bind:selected>
    <Segment {segment} on:click={() => localStorage.setItem("colorGeneration", segment)}>
        <Label>{segment}</Label>
    </Segment>
</SegmentedButton>

<h2>Trenutna barvna paleta</h2>

<p/>

<Button on:click={async () => {
    await getCurrentPalette();
    setPalette();
}} variant="raised">
    <Icon class="material-icons">download</Icon>
    <Label>Potegni trenutno barvno paleto iz strežnika</Label>
</Button>

<Button on:click={async () => {
    predmeti = [...DEFAULT_PALETTE];
    setPalette();
}} variant="raised">
    <Icon class="material-icons">reset_tv</Icon>
    <Label>Resetiraj paleto</Label>
</Button>

<p/>

<DataTable style="width: 100%;">
    <Head>
        <Row>
            <Cell>Predmet</Cell>
            <Cell>Barva</Cell>
            <Cell>Predogled</Cell>
            <Cell>Izbris</Cell>
        </Row>
    </Head>
    <Body>
    {#each predmeti as predmet, i}
        <Row>
            <Cell><Textfield class="inline" type="text" helperLine$style="width: 100%;" style="width: 100%; min-width: 150px;" bind:value={predmet.id} /></Cell>
            <Cell><input class="inline" type="color" bind:value={predmet.color} /></Cell>
            <Cell>
                <div style="background-color: {`${predmet.color}`}; height: 50px;">
                    <span style="top: 15px; left: 15px; position: relative;"><b>{predmet.id}</b></span>
                </div>
            </Cell>
            <Cell>
                <IconButton style="margin: 0 0 0 0.5em;" class="material-icons" on:click={() => {
                    predmeti.splice(i, 1);
                    predmeti = predmeti;
                }}>delete</IconButton>
            </Cell>
        </Row>
    {/each}
    </Body>
</DataTable>

<p/>

<Button on:click={async () => {
    predmeti.push({id: "", color: ""});
    predmeti = predmeti;
}} variant="raised">
    <Icon class="material-icons">add</Icon>
    <Label>Dodaj predmet</Label>
</Button>

<Button on:click={async () => {
    let fd = new FormData();
    fd.append("palette", JSON.stringify(predmeti));
    await makeRequest("/palette", "PATCH", fd);
    predmeti = await makeRequest("/palette") ?? [];
    localStorage.setItem("palette", JSON.stringify(predmeti));
    setPalette();
}} variant="raised">
    <Icon class="material-icons">sync</Icon>
    <Label>Shrani barvno paleto</Label>
</Button>

<p/>

<FormField>
    <Switch bind:checked={zasebno_avtorstvo} />
    <span slot="label">Zasebno avtorstvo (uporabnik bo prikazan kot anonimna oseba)</span>
</FormField>

<p/>

<Button on:click={async () => {
    let fd = new FormData();
    fd.append("palette", JSON.stringify(predmeti));
    await makeRequest("/palette", "PATCH", fd);
    await getCurrentPalette();
    fd = new FormData();
    fd.append("name", "");
    fd.append("palette", JSON.stringify(predmeti));
    fd.append("is_owner_private", zasebno_avtorstvo.toString());
    await makeRequest("/palettes", "POST", fd);
    await getPalettes();
    setPalette();
}} variant="raised">
    <Icon class="material-icons">add</Icon>
    <Label>Shrani barvno paleto in jo objavi</Label>
</Button>

<h2>Deljene palete</h2>
Tukaj lahko najdete tudi palete drugih uporabnikov. Ti so se odločili, da jih delijo z drugimi.

<LayoutGrid>
    {#each palettes as palette}
        <LayoutCell>
            <div class="demo-cell">
                <div style="margin: 10px 10px 10px">
                    Lastnik barvne palete: <b>{palette.owner}</b>
                    <div class="break" />
                    Paleta ustvarjena dne: <b>{timeConverter(palette.created_on)}</b>
                    <div class="break" />
                    Prenosov: <b>{palette.downloads}</b>
                    <div class="big-break" />
                    {#each palette.palette as predmet}
                        <div style="background-color: {`${predmet.color}`}; display: inline-flex; height: 50px;">
                            <span style="top: 15px; position: relative; margin: 0 10px 0 10px;"><b>{predmet.id}</b></span>
                        </div>
                    {/each}
                    <div class="big-break"/>
                    <Button on:click={async () => {
                        await makeRequest(`/palettes/set/${palette.id}`, "PATCH");
                        await getCurrentPalette();
                        palette.downloads++;
                    }} variant="raised">
                        <Icon class="material-icons">download</Icon>
                        <Label>Prenesi barvno paleto</Label>
                    </Button>
                    <div class="big-break" />
                    <Button on:click={async () => {
                        predmeti = palette.palette;
                    }} variant="raised">
                        <Icon class="material-icons">auto_fix_normal</Icon>
                        <Label>Uporabi to barvno paleto kot osnovo za novo</Label>
                    </Button>
                    <div class="big-break"/>
                    Prenos barvne palete bo povozil vašo trenutno barvno paleto, če jo imate.
                    {#if palette.owned}
                        <h4>Gumbi za lastnike barvnih palet</h4>
                        <Button on:click={async () => {
                            await makeRequest(`/palettes/set/${palette.id}`, "DELETE");
                            await getPalettes();
                        }} variant="raised">
                            <Icon class="material-icons">delete</Icon>
                            <Label>Izbriši barvno paleto</Label>
                        </Button>
                        <div class="big-break" />
                        <Button on:click={async () => {
                            await makeRequest(`/palettes/anon/${palette.id}`, "PATCH");
                            await getPalettes();
                        }} variant="raised">
                            <Icon class="material-icons">visibility</Icon>
                            <Label>Zamenjaj vidnost lastnika (anonimno/neanonimno)</Label>
                        </Button>
                    {/if}
                </div>
            </div>
        </LayoutCell>
    {/each}
</LayoutGrid>
-->
