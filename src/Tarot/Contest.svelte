<script lang="ts">
    import {onMount} from "svelte";
    import {makeRequest} from "../constants";
    import DataTable, {Body, Cell, Head, Row} from "@smui/data-table";
    import Button, {Icon, Label} from "@smui/button";
    import {navigate} from "svelte-navigator";
    import IconButton from "@smui/icon-button";
    import Tab from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { chart } from "svelte-apexcharts";
    import Select, {Option} from "@smui/select";
    import Textfield from "@smui/textfield";
    import List, {Item, Text} from "@smui/list";

    export let id: string;
    let options = {};
    let options_gamemode;
    let options_points = {};
    let options_overtime = {};
    let igra = "";

    let oseba = "";

    const GAMEMODES = {
        0: "Tri",
        1: "Dva",
        2: "Ena",
        3: "Pikolo",
        4: "Solo tri",
        5: "Solo dva",
        6: "Solo ena",
        7: "Berač",
        8: "Solo brez",
        9: "Odprti berač",
        10: "Valat",
        11: "Barvni valat",
        12: "Klop",
        13: "Renons",
    }

    const GAMEMODES_KEYS = {
        "Tri": 0,
        "Dva": 1,
        "Ena": 2,
        "Pikolo": 3,
        "Solo tri": 4,
        "Solo dva": 5,
        "Solo ena": 6,
        "Berač": 7,
        "Solo brez": 8,
        "Odprti berač": 9,
        "Valat": 10,
        "Barvni valat": 11,
        "Klop": 12,
        "Renons": 13,
    }

    let tabs = [
        {
            icon: 'table_view',
            label: 'Igre',
        },
        {
            icon: 'analytics',
            label: 'Statistika',
        },
        {
            icon: 'settings',
            label: 'Nastavitve',
        }
    ];
    let active = tabs[0];

    let contest;

    async function getContest() {
        contest = await makeRequest(`/tarot/contest/${id}`)
        let odigranih = Object.keys(contest.statistics).map((v) => contest.statistics[v].iger_odigranih);
        let igranih = Object.keys(contest.statistics).map((v) => contest.statistics[v].iger_igral);
        let zmaganih = Object.keys(contest.statistics).map((v) => contest.statistics[v].iger_zmagal);
        console.log(odigranih, igranih, zmaganih)
        const parsed = JSON.parse(contest.contestants);
        options = {
            series: [
                {
                    name: 'Odigranih iger',
                    data: odigranih
                }, {
                    name: 'Igranih iger',
                    data: igranih
                }, {
                    name: 'Zmaganih iger',
                    data: zmaganih
                }
            ],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: parsed,
            },
            yaxis: {
                title: {
                    text: 'iger'
                }
            },
            fill: {
                opacity: 1
            },
            theme: {
                mode: "dark",
            }
        };
        options_points = {
            series: [{
                name: "Dobljenih točk",
                data: Object.keys(contest.statistics).map((v) => contest.statistics[v].tock_skupaj)
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: parsed,
            },
            theme: {
                mode: "dark",
            }
        };
        let series = [];
        for (let i in parsed) {
            series.push({name: parsed[i], data: contest.statistics[parsed[i]].points_overtime})
        }
        console.log(series)
        options_overtime = {
            series: series,
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: true
            },
            stroke: {
                width: 5,
                curve: 'straight',
                dashArray: 0
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                categories: [...Array(series[0].data.length).keys()],
            },
            theme: {
                mode: "dark",
            }
        };

    }

    async function deleteGame(game_id: string) {
        await makeRequest(`/tarot/game/${game_id}`, "DELETE");
        await getContest();
    }

    async function addPerson() {
        await makeRequest(`/tarot/contest/${id}/add`, "PATCH", JSON.stringify({"person": oseba}), false, false, true);
        await getContest();
    }

    async function removePerson(person: string) {
        await makeRequest(`/tarot/contest/${id}/remove`, "DELETE", JSON.stringify({"person": person}), false, false, true);
        await getContest();
    }

    async function deleteContest() {
        await makeRequest(`/tarot/contest/${id}`, "DELETE");
        navigate("/tarot/contests");
    }

    onMount(async () => {
        await getContest();
    })
</script>

{#if contest !== undefined}
    <TabBar {tabs} let:tab bind:active>
        <!-- Note: the `tab` property is required! -->
        <Tab {tab}>
            <Icon class="material-icons">{tab.icon}</Icon>
            <Label>{tab.label}</Label>
        </Tab>
    </TabBar>
    <p/>
    {#if active.label === "Igre"}
        <Button on:click={async () => navigate(`/tarot/contest/${id}/games`)} variant="raised">
            <Icon class="material-icons">add</Icon>
            <Label>Nova igra</Label>
        </Button>
        <br>
        <DataTable style="width: 100%;">
            <Head>
                <Row>
                    <Cell>Iden. št. igre</Cell>
                    <Cell>Igra</Cell>
                    {#each JSON.parse(contest.contestants) as con}
                        <Cell>
                            <div style="display: flex; flex-direction: row; align-items: center;">
                                {con}
                                {#each [...Array(contest.status[con].radlci_status).keys()] as i}<Icon class="material-icons">star</Icon>{/each}
                            </div>
                        </Cell>
                    {/each}
                </Row>
            </Head>
            <Body>
                {#each contest.games as game}
                    <Row>
                        <Cell>
                            <div style="display: flex; flex-direction: row; align-items: center;">
                                <span>{game.id.substring(0, 5)}</span>
                                <IconButton class="material-icons" on:click={async () => await deleteGame(game.id)}>delete</IconButton>
                            </div>
                        </Cell>
                        <Cell>{GAMEMODES[game.type]}</Cell>
                        {#each JSON.parse(contest.contestants) as contestant}
                            {#if Object.keys(game.contestants).includes(contestant)}
                                {#each Object.keys(game.contestants) as cs}
                                    {#if cs === contestant}
                                        {#if game.contestants[cs].razlika === 0}
                                            <Cell style="font-size: 20px; color: gray;">+0</Cell>
                                        {:else}
                                            <Cell style="font-size: 20px; color: {game.contestants[cs].razlika < 0 ? '#F44336' : '#64DD17'};">
                                                {game.contestants[cs].razlika}
                                            </Cell>
                                        {/if}
                                    {/if}
                                {/each}
                            {:else}
                                <Cell/>
                            {/if}
                        {/each}
                    </Row>
                {/each}
                <Row>
                    <Cell>
                        Skupaj
                    </Cell>
                    <Cell/>
                    {#each JSON.parse(contest.contestants) as contestant}
                        {#if Object.keys(contest.status).includes(contestant)}
                            {#each Object.keys(contest.status) as cs}
                                {#if cs === contestant}
                                    <Cell style="font-size: 20px; color: {contest.status[cs].total < 0 ? '#F44336' : '#64DD17'};">
                                        {contest.status[cs].total} <!--<span style="font-size: 13px; color: grey;">{contest.status[cs].radlci_status}</span>-->
                                    </Cell>
                                {/if}
                            {/each}
                        {:else}
                            <Cell/>
                        {/if}
                    {/each}
                </Row>
            </Body>
        </DataTable>
    {/if}
    {#if active.label === "Statistika"}
        <h1>Statistika iger</h1>
        <div use:chart={options}/>

        <h1>Igre</h1>
        <Select bind:value={igra} label="Igre">
            {#each ["", ...Object.keys(GAMEMODES_KEYS)] as gamemode}
                <Option value={gamemode} on:click={() => {
                    setTimeout(() => {
                        console.log(igra)
                        options_gamemode = {
                            series: [
                                {
                                    name: 'Iger igral',
                                    data: Object.keys(contest.statistics).map((v) => contest.statistics[v].tipi_iger[GAMEMODES_KEYS[igra]])
                                }
                            ],
                            chart: {
                                type: 'bar',
                                height: 350
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded'
                                },
                            },
                            dataLabels: {
                                enabled: false
                            },
                            stroke: {
                                show: true,
                                width: 2,
                                colors: ['transparent']
                            },
                            xaxis: {
                                categories: JSON.parse(contest.contestants),
                            },
                            yaxis: {
                                title: {
                                    text: 'iger'
                                }
                            },
                            fill: {
                                opacity: 1
                            },
                            theme: {
                                mode: "dark",
                            }
                        };
                    }, 50);
                }}>{gamemode}</Option>
            {/each}
        </Select>
        <p/>
        {#if options_gamemode !== undefined}
            <div use:chart={options_gamemode}/>
        {/if}

        <h1>Dobljenih točk</h1>
        <div use:chart={options_points}/>

        <h1>Točk čez čas</h1>
        <div use:chart={options_overtime}/>
    {/if}
    {#if active.label === "Nastavitve"}
        <Textfield bind:value={oseba} helperLine$style="width: 100%;" style="width: 100%;" label="Uporabniško ime osebe (GimSIS)" />
        <Button on:click={async () => await addPerson()} variant="raised"><p/>
            <Icon class="material-icons">add</Icon>
            <Label>Dodaj osebo</Label>
        </Button>
        <p/>
        <List style="width: 100%;">
            {#each JSON.parse(contest.contestants) as contestant}
                <Item on:SMUI:action={async () => await removePerson(contestant)}><Text>{contestant}</Text></Item>
            {/each}
        </List>
        <p/>
        <Button on:click={async () => await deleteContest()} variant="raised"><p/>
            <Icon class="material-icons">delete</Icon>
            <Label>Izbriši tekmovanje</Label>
        </Button>
    {/if}
{/if}


