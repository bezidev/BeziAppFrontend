<script lang="ts">
    import {onMount} from "svelte";
    import {makeRequest} from "../constants";
    import Button, {Icon, Label} from "@smui/button";
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import Textfield from "@smui/textfield";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {navigate} from "svelte-routing";
    import Select, {Option} from "@smui/select";
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

    export let id: string;

    let open = false;
    let name = "";
    let gamemode = "";
    let igra_kontre = "";
    let trulo_napovedal = "";
    let trulo_zbral = "";
    let trula_kontre = "";
    let kralji_napovedal = "";
    let kralji_zbral = "";
    let kralji_kontre = "";
    let pagat_napovedal = "";
    let pagat_zbral = "";
    let pagat_kontre = "";
    let kralj_napovedal = "";
    let kralj_zbral = "";
    let kralj_kontre = "";
    let valat_napovedal = "";
    let valat_zbral = "";
    let valat_kontre = "";
    let izgubil_monda = "";
    let contestants = [];

    let contestant = "";

    const GAMEMODES = {
        Tri: 0,
        Dva: 1,
        Ena: 2,
        Pikolo: 3,
        "Solo tri": 4,
        "Solo dva": 5,
        "Solo ena": 6,
        Berač: 7,
        "Solo brez": 8,
        "Odprti berač": 9,
        Valat: 10,
        "Barvni valat": 11,
        Klop: 12,
        Renons: 13,
        "Ročni vpis": 14,
        "Ročni vpis z radlcem": 15,
    };

    const KONTRE = {
        "": 0,
        "Kontra (2x)": 1,
        "Rekontra (4x)": 2,
        "Subkontra (8x)": 3,
        "Mortkontra (16x)": 4,
    }

    const GAMEMODES_IN_THREE = {
        Tri: 0,
        Dva: 1,
        Ena: 2,
        Pikolo: 3,
        Berač: 7,
        "Solo brez": 8,
        "Odprti berač": 9,
        Valat: 10,
        "Barvni valat": 11,
        Klop: 12,
        Renons: 13,
        "Ročni vpis": 14,
        "Ročni vpis z radlcem": 15,
    };

    const NO_PREDICTIONS = ["Pikolo", "Berač", "Solo brez", "Odprti berač", "Valat", "Barvni valat", "Klop", "Renons", "Ročni vpis", "Ročni vpis z radlcem"]
    const SEPARATE_COUNTERS = ["Klop", "Ročni vpis", "Ročni vpis z radlcem"];
    const NO_DIFFERENCE = ["Pikolo", "Berač", "Solo brez", "Odprti berač", "Valat", "Barvni valat"]
    const CONSTANT_GAMEMODE = ["Renons"];
    const NO_REVERSALS = ["Klop", "Renons", "Ročni vpis", "Ročni vpis z radlcem"]; // ni konter na igro

    let difference = 0;

    let contest;

    async function getContest() {
        contest = await makeRequest(`/tarot/contest/${id}`);
    }

    function preprocessUI() {
        for (let i in contestants) {
            if (contestants[i].playing && NO_DIFFERENCE.includes(gamemode)) contestants[i].difference = (contestants[i].won === undefined || contestants[i].won === false) ? -1 : 1;
            if (contestants[i].playing &&
                !(NO_DIFFERENCE.includes(gamemode) ||
                    SEPARATE_COUNTERS.includes(gamemode) ||
                    CONSTANT_GAMEMODE.includes(gamemode)
                )) contestants[i].difference = difference;
        }
    }

    async function newGame() {
        preprocessUI();
        await makeRequest(
            `/tarot/contest/${id}`,
            "POST",
            JSON.stringify({
                gamemode: GAMEMODES[gamemode].toString(),
                igra_kontre: KONTRE[igra_kontre],
                trula_zbral: trulo_zbral,
                trula_napovedal: trulo_napovedal,
                trula_kontre: KONTRE[trula_kontre],
                kralji_zbral: kralji_zbral,
                kralji_napovedal: kralji_napovedal,
                kralji_kontre: KONTRE[kralji_kontre],
                pagat_zbral: pagat_zbral,
                pagat_napovedal: pagat_napovedal,
                pagat_kontre: KONTRE[pagat_kontre],
                kralj_zbral: kralj_zbral,
                kralj_napovedal: kralj_napovedal,
                kralj_kontre: KONTRE[kralj_kontre],
                valat_zbral: valat_zbral,
                valat_napovedal: valat_napovedal,
                valat_kontre: KONTRE[valat_kontre],
                izgubil_monda: izgubil_monda,
                contestants: JSON.stringify(contestants).toString(),
            }),
            false,
            false,
            true
        );
    }

    function removeNulls(arr) {
        let newArray = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== null) {
                console.log(arr[i]);
                newArray.push(arr[i]);
            }
        }
        console.log(newArray);
        return newArray;
    }

    onMount(async () => {
        await getContest();
    });
</script>

{#if contest !== undefined}
    <h1>Nova igra</h1>

    <Select bind:value={contestant} label="Igralci">
        {#each JSON.parse(contest.contestants) as contestant}
            <Option
                value={contestant}
                on:click={() => {
                    let ok = true;
                    for (let i in contestants) if (contestants[i].username === contestant) {
                        ok = false;
                        break;
                    }
                    if (ok) {
                        contestants.push({
                            username: contestant,
                            difference: 0,
                            playing: false,
                            won: false,
                        });
                        contestants = contestants;
                    }
                    // hack as described in https://github.com/hperrin/svelte-material-ui/issues/356
                    // ugly but works
                    setTimeout(() => {
                        const containers = document.getElementsByClassName("mdc-data-table__table-container");
                        console.log(containers);
                        for (let i = 0; i < containers.length; i++) {
                            const container = containers[i];
                            console.log(container);
                            container.className += " overflow";
                        }
                    }, 50);
            }}>{contestant}</Option>
        {/each}
    </Select>

    <h4>Tekmovalci</h4>
    {#each contestants as cont}
        <h5>{cont.username}</h5>
        {#if gamemode !== "Klop"}
            <FormField>
                <Switch bind:checked={cont.playing}/>
                <span slot="label">Igra</span>
            </FormField>
        {/if}
        {#if SEPARATE_COUNTERS.includes(gamemode)}
            {#if !(gamemode === "Ročni vpis" || gamemode === "Ročni vpis z radlcem") || ((gamemode === "Ročni vpis" || gamemode === "Ročni vpis z radlcem") && cont.playing)}
                <p/>
                <Textfield
                    bind:value={cont.difference}
                    style="width: 100%;"
                    helperLine$style="width: 100%;"
                    label="Razlika"
                    type="tel"
                />
            {/if}
        {/if}
        <p/>
        {#if NO_DIFFERENCE.includes(gamemode) && cont.playing}
            <p/>
            <FormField>
                <Switch bind:checked={cont.won}/>
                <span slot="label">Zmagal</span>
            </FormField>
        {/if}
        <p/>
        <Button
            on:click={async () => {
                let cs = [];
                for (let i in contestants) if (contestants[i].username !== cont.username) {
                    console.log(contestants, i);
                    cs.push(contestants[i]);
                }
                contestants = cs;
            }}
            variant="raised"
        >
            <Icon class="material-icons">delete</Icon>
            <Label>Izbriši</Label>
        </Button>
        <p/>
    {/each}

    {#if !(contestants.length < 3 || contestants.length > 4)}
        <p/>
        <SegmentedButton
                segments={Object.keys(contestants.length === 3 ? GAMEMODES_IN_THREE : GAMEMODES)}
                let:segment
                singleSelect
                bind:selected={gamemode}
        >
            <Segment {segment}><Label>{segment}</Label></Segment>
        </SegmentedButton>
        <p/>
        {#if !(CONSTANT_GAMEMODE.includes(gamemode) || NO_DIFFERENCE.includes(gamemode) || SEPARATE_COUNTERS.includes(gamemode))}
            <Textfield
                    bind:value={difference}
                    style="width: 100%;"
                    helperLine$style="width: 100%;"
                    label="Razlika"
                    type="tel"
            />
            <p/>
        {/if}
        <h3>Napovedi</h3>
        <DataTable table$aria-label="Napovedi" style="min-width: 100%;">
            <Head>
                <Row>
                    <Cell>Napoved</Cell>
                    <Cell>Napovedal</Cell>
                    <Cell>Zbral</Cell>
                    <Cell>Kontra</Cell>
                </Row>
            </Head>
            <Body>
                {#if !NO_REVERSALS.includes(gamemode)}
                    <Row>
                        {@const igralci = contestants.map((a) => a.playing === true ? a.username : null)}
                        <Cell>{gamemode}</Cell>
                        <Cell>{removeNulls(igralci).join(", ")}</Cell>
                        <Cell />
                        <Cell class="overflow">
                            <Select bind:value={igra_kontre} label="Kontriranje igre">
                                {#each Object.keys(KONTRE) as kontra}
                                    <Option value={kontra}>{kontra}</Option>
                                {/each}
                            </Select>
                        </Cell>
                    </Row>
                {/if}
                {#if !NO_PREDICTIONS.includes(gamemode)}
                    <Row>
                        <Cell>Trula</Cell>
                        <Cell class="overflow">
                            <Select bind:value={trulo_napovedal} label="Trulo napovedal">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={trulo_zbral} label="Trulo zbral">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={trula_kontre} label="Kontriranje trule">
                                {#each Object.keys(KONTRE) as kontra}
                                    <Option value={kontra}>{kontra}</Option>
                                {/each}
                            </Select>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>Kralji</Cell>
                        <Cell class="overflow">
                            <Select bind:value={kralji_napovedal} label="Kralje napovedal">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={kralji_zbral} label="Kralje zbral">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={kralji_kontre} label="Kontriranje kraljev">
                                {#each Object.keys(KONTRE) as kontra}
                                    <Option value={kontra}>{kontra}</Option>
                                {/each}
                            </Select>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>Pagat ultimo</Cell>
                        <Cell class="overflow">
                            <Select bind:value={pagat_napovedal} label="Pagat ultimo napovedal">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={pagat_zbral} label="Pagat ultimo zbral">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={pagat_kontre} label="Kontriranje pagat ultima">
                                {#each Object.keys(KONTRE) as kontra}
                                    <Option value={kontra}>{kontra}</Option>
                                {/each}
                            </Select>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>Kralj ultimo</Cell>
                        <Cell class="overflow">
                            <Select bind:value={kralj_napovedal} label="Kralj ultimo napovedal">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={kralj_zbral} label="Kralj ultimo zbral">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={kralj_kontre} label="Kontriranje kralj ultima">
                                {#each Object.keys(KONTRE) as kontra}
                                    <Option value={kontra}>{kontra}</Option>
                                {/each}
                            </Select>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>Valat</Cell>
                        <Cell class="overflow">
                            <Select bind:value={valat_napovedal} label="Valat napovedal">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={valat_zbral} label="Valat zbral">
                                {#each ["", "igralci", "nasprotniki"] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell class="overflow">
                            <Select bind:value={valat_kontre} label="Kontriranje valata">
                                {#each Object.keys(KONTRE) as kontra}
                                    <Option value={kontra}>{kontra}</Option>
                                {/each}
                            </Select>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>Izguba monda</Cell>
                        <Cell />
                        <Cell class="overflow">
                            <Select bind:value={izgubil_monda} label="Izgubil monda">
                                {#each ["", ...JSON.parse(contest.contestants)] as contestant}
                                    <Option value={contestant}>{contestant}</Option>
                                {/each}
                            </Select>
                        </Cell>
                        <Cell />
                    </Row>
                {/if}
            </Body>
        </DataTable>

        <p/>
        Z ustvarjanjem nove igre se strinjate s <a href="/tos.html">Pogoji uporabe</a>.

        <p/>
        <Button
            on:click={async () => {
                await newGame();
                navigate(`/tarot/contest/${id}`);
            }}
            variant="raised"
        >
            <Icon class="material-icons">add</Icon>
            <Label>OK</Label>
        </Button>
    {:else}
        <b>Neveljavno število igralcev. Najdenih {contestants.length}.</b>
    {/if}
{/if}
