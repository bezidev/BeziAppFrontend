<script lang="ts">
    import {onMount} from "svelte";
    import {makeRequest} from "../constants";
    import DataTable, {Body, Cell, Head, Row, Pagination} from "@smui/data-table";
    import Button, {Icon, Label} from "@smui/button";
    import {navigate} from "svelte-navigator";
    import IconButton from "@smui/icon-button";
    import Tab from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { chart } from "svelte-apexcharts";
    import Select, {Option} from "@smui/select";
    import Textfield from "@smui/textfield";
    import List, {Item, Text} from "@smui/list";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";

    export let id: string;
    let options = {};
    let options_gamemode;
    let options_points = {};
    let options_overtime = {};
    let options_wl = {};
    let igra = "";
    let show_radlci = false;

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
    let rowsPerPage = 5;
    let currentPage = 0;
    let start;
    let end;
    let slice;
    let lastPage;

    $: {
        if (contest !== undefined) {
            start = currentPage * rowsPerPage;
            end = Math.min(start + rowsPerPage, contest.games.length);
            slice = [...contest.games].reverse().slice(start, end).reverse();
            lastPage = Math.max(Math.ceil(contest.games.length / rowsPerPage) - 1, 0);
            if (currentPage > lastPage) {
                currentPage = lastPage;
            }
            console.log(start, end, slice, lastPage, currentPage);
        }
    }

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
        options_wl = {
            series: [{
                name: "Razmerje med igranimi in zmaganimi igrami",
                data: Object.keys(contest.statistics).map((v) => (contest.statistics[v].iger_zmagal/contest.statistics[v].iger_igral).toFixed(2))
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

    async function privatePublicContest() {
        await makeRequest(`/tarot/contest/${id}/private_public`, "PATCH");
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
        <Button on:click={async () => await getContest()} variant="raised">
            <Icon class="material-icons">refresh</Icon>
            <Label>Osveži podatke</Label>
        </Button>
        <br>
        <DataTable style="width: 100%;">
            <Head>
                <Row>
                    <Cell>Igra</Cell>
                    {#each JSON.parse(contest.contestants) as con}
                        <Cell>
                            <div style="display: flex; flex-direction: row; align-items: center;">
                                {con}
                                (<span style="color: grey; font-size: 15px;">{contest.status[con].radlci_status}</span>)
                            </div>
                        </Cell>
                    {/each}
                    <Cell>Iden. št. igre</Cell>
                </Row>
            </Head>
            <Body>
                {#each slice as game}
                    <Row>
                        <Cell>{GAMEMODES[game.type]}</Cell>
                        {#each JSON.parse(contest.contestants) as contestant}
                            {#if Object.keys(game.contestants).includes(contestant)}
                                {#each Object.keys(game.contestants) as cs}
                                    {#if cs === contestant}
                                        <Cell style="font-size: 20px; color: {game.contestants[cs].razlika === 0 ? 'gray' : (game.contestants[cs].razlika < 0  ? '#F44336' : '#64DD17')};">
                                            {#if game.contestants[cs].razlika === 0}
                                                +0
                                            {:else}
                                                {game.contestants[cs].razlika}
                                            {/if}
                                            {#if game.contestants[cs].radlc_uporabljen}
                                                <Icon class="material-icons" slot="leadingIcon"><div style="font-size: 15px !important;">stars</div></Icon>
                                            {/if}
                                        </Cell>
                                    {/if}
                                {/each}
                            {:else}
                                <Cell/>
                            {/if}
                        {/each}
                        <Cell>
                            <div style="display: flex; flex-direction: row; align-items: center;">
                                <span>{game.id.substring(0, 5)}</span>
                                <IconButton class="material-icons" on:click={async () => await deleteGame(game.id)}>delete</IconButton>
                            </div>
                        </Cell>
                    </Row>
                {/each}
                <Row>
                    <Cell>
                        {#if show_radlci}
                            <b>Skupaj pred radlci</b>
                        {:else}
                            <b>Skupaj</b>
                        {/if}
                    </Cell>
                    {#each JSON.parse(contest.contestants) as contestant}
                        {#if Object.keys(contest.status).includes(contestant)}
                            {#each Object.keys(contest.status) as cs}
                                {#if cs === contestant}
                                    <Cell style="font-size: 20px; color: {contest.status[cs].total < 0 ? '#F44336' : '#64DD17'};">
                                        {#if show_radlci}{contest.status[cs].total}{:else}<b>{contest.status[cs].total}</b>{/if}
                                    </Cell>
                                {/if}
                            {/each}
                        {:else}
                            <Cell/>
                        {/if}
                    {/each}
                    <Cell/>
                </Row>
                {#if show_radlci}
                    <Row>
                        <Cell>
                            <b>Kazen za radlce</b>
                        </Cell>
                            {#each JSON.parse(contest.contestants) as contestant}
                                {#if Object.keys(contest.status).includes(contestant)}
                                    {#each Object.keys(contest.status) as cs}
                                        {#if cs === contestant}
                                            {@const radlci = contest.status[cs].radlci_status * -40}
                                            <Cell style="font-size: 20px; color: {radlci >= 0 ? '#64DD17' : '#F44336'};">
                                                {radlci}
                                            </Cell>
                                        {/if}
                                    {/each}
                                {:else}
                                    <Cell/>
                                {/if}
                            {/each}
                        <Cell/>
                    </Row>
                    <Row>
                        <Cell>
                            <b>Skupaj</b>
                        </Cell>
                        {#each JSON.parse(contest.contestants) as contestant}
                            {#if Object.keys(contest.status).includes(contestant)}
                                {#each Object.keys(contest.status) as cs}
                                    {#if cs === contestant}
                                        <Cell style="font-size: 20px; color: {contest.status[cs].total_radlci < 0 ? '#F44336' : '#64DD17'};">
                                            <b>{contest.status[cs].total_radlci}</b>
                                        </Cell>
                                    {/if}
                                {/each}
                            {:else}
                                <Cell/>
                            {/if}
                        {/each}
                        <Cell/>
                    </Row>
                {/if}
            </Body>
            <Pagination slot="paginate">
                <svelte:fragment slot="rowsPerPage">
                    <Label>Vrstic na stran</Label>
                    <Select variant="outlined" bind:value={rowsPerPage} noLabel>
                        <Option value={5}>5</Option>
                        <Option value={10}>10</Option>
                        <Option value={25}>25</Option>
                        <Option value={100}>100</Option>
                    </Select>
                    <FormField>
                        <Switch bind:checked={show_radlci} />
                        <span slot="label">Kazni</span>
                    </FormField>
                </svelte:fragment>
                <svelte:fragment slot="total">
                    {start + 1}-{end} od {contest.games.length}
                </svelte:fragment>

                <IconButton
                        class="material-icons"
                        action="first-page"
                        title="First page"
                        on:click={() => (currentPage = 0)}
                        disabled={currentPage === 0}>first_page</IconButton
                >
                <IconButton
                        class="material-icons"
                        action="prev-page"
                        title="Prev page"
                        on:click={() => currentPage--}
                        disabled={currentPage === 0}>chevron_left</IconButton
                >
                <IconButton
                        class="material-icons"
                        action="next-page"
                        title="Next page"
                        on:click={() => currentPage++}
                        disabled={currentPage === lastPage}>chevron_right</IconButton
                >
                <IconButton
                        class="material-icons"
                        action="last-page"
                        title="Last page"
                        on:click={() => (currentPage = lastPage)}
                        disabled={currentPage === lastPage}>last_page</IconButton
                >
            </Pagination>
        </DataTable>
        <p/>
        {#if show_radlci}
            Vsak neporabljen radlc se točkuje z -40 točkami.
        {/if}
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
        {#if !(options_gamemode === undefined || options_gamemode === "")}
            <div use:chart={options_gamemode}/>
        {/if}

        <h1>Dobljenih točk</h1>
        <div use:chart={options_points}/>

        <h1>Razmerje zmaganih iger proti igranim igram</h1>
        <div use:chart={options_wl}/>

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
        <Button on:click={async () => await privatePublicContest()} variant="raised"><p/>
            {#if contest.is_private}
                <Icon class="material-icons">public</Icon>
                <Label>Naredi tekmovanje javno</Label>
            {:else}
                <Icon class="material-icons">vpn_lock</Icon>
                <Label>Naredi tekmovanje zasebno</Label>
            {/if}
        </Button>
    {/if}
{/if}


