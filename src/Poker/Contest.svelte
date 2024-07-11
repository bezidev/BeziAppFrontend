<script lang="ts">
    import {onMount} from "svelte";
    import {makeRequest} from "../constants";
    import DataTable, {Body, Cell, Head, Row, Pagination} from "@smui/data-table";
    import Button, {Icon, Label} from "@smui/button";
    import {navigate} from "svelte-routing";
    import IconButton from "@smui/icon-button";
    import Tab from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { chart } from "svelte-apexcharts";
    import Select, {Option} from "@smui/select";
    import Textfield from "@smui/textfield";
    import List, {Item, Text} from "@smui/list";
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Tooltip, {Wrapper} from "@smui/tooltip";

    export let id: string;
    let options = {};
    let options_points = {};
    let options_overtime = {};
    let options_wl = {};

    let oseba = "";
    let activeStats = "";

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

    const CHART_HEIGHT = 600;

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
        contest = await makeRequest(`/poker/contest/${id}`)
        let odigranih = Object.keys(contest.statistics).map((v) => contest.statistics[v].iger_odigranih);
        let zmaganih = Object.keys(contest.statistics).map((v) => contest.statistics[v].iger_zmaganih);
        console.log(odigranih, zmaganih)
        const parsed = JSON.parse(contest.contestants);
        options = {
            series: [
                {
                    name: 'Odigranih iger',
                    data: odigranih
                },
                {
                    name: 'Zmaganih iger',
                    data: zmaganih
                }
            ],
            chart: {
                type: 'bar',
                height: CHART_HEIGHT
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
                height: CHART_HEIGHT
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
        let wl_data = Object.keys(contest.statistics).map((v) => contest.statistics[v].razmerje_zmaganih_iger);
        console.log("ok", wl_data);
        options_wl = {
            series: [{
                name: "Razmerje zmaganih iger proti vsem igranim igram",
                data: wl_data,
            }],
            chart: {
                type: 'bar',
                height: CHART_HEIGHT
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
                height: CHART_HEIGHT,
                type: 'line',
                zoom: {
                    enabled: true
                },
            },
            dataLabels: {
                enabled: false
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

    let openWarning = false;
    let func;
    let title;
    let props;

    async function deleteGame(game_id: string) {
        await makeRequest(`/poker/game/${game_id}`, "DELETE");
        await getContest();
    }

    async function addPerson() {
        let fd = new FormData();
        fd.append("person", oseba);
        await makeRequest(`/poker/contest/${id}/add`, "PATCH", fd);
        await getContest();
    }

    async function removePerson(person: string) {
        let fd = new FormData();
        fd.append("person", person);
        await makeRequest(`/poker/contest/${id}/remove`, "DELETE", fd);
        await getContest();
    }

    async function privatePublicContest() {
        await makeRequest(`/poker/contest/${id}/private_public`, "PATCH");
        await getContest();
    }

    async function deleteContest() {
        await makeRequest(`/poker/contest/${id}`, "DELETE");
        navigate("/poker/contests");
    }

    onMount(async () => {
        await getContest();
    })
</script>

<Dialog bind:open={openWarning} aria-labelledby="simple-title" aria-describedby="simple-content">
    <Title id="simple-title">Izbriši {title}</Title>
    <Content id="simple-content">Ali res želite izbrisati {title}?</Content>
    <Actions>
        <Button>
            <Label>Ne</Label>
        </Button>
        <Button on:click={async () => await func(props)}>
            <Label>Ja</Label>
        </Button>
    </Actions>
</Dialog>

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
        <Button on:click={async () => navigate(`/poker/contest/${id}/games`)} variant="raised">
            <Icon class="material-icons">add</Icon>
            <Label>Nova igra</Label>
        </Button>
        <Button on:click={async () => await getContest()} variant="raised">
            <Icon class="material-icons">refresh</Icon>
            <Label>Osveži podatke</Label>
        </Button>
        <p/>
        <DataTable style="width: 100%;">
            <Head>
                <Row>
                    {#each JSON.parse(contest.contestants) as con}
                        <Cell>
                            <div style="display: flex; flex-direction: row; align-items: center;">
                                {con}
                            </div>
                        </Cell>
                    {/each}
                    <Cell>Iden. št. igre</Cell>
                </Row>
            </Head>
            <Body>
                {#each slice as game}
                    <Row>
                        {#each JSON.parse(contest.contestants) as contestant}
                            {#if Object.keys(game.contestants).includes(contestant)}
                                {#each Object.keys(game.contestants) as cs}
                                    {#if cs === contestant}
                                        <Cell style="font-size: 20px; color: {game.contestants[cs].money === 0 ? 'gray' : (game.contestants[cs].money < 0  ? '#F44336' : '#64DD17')};">
                                            <span>{#if game.contestants[cs].money > 0}+{/if}{game.contestants[cs].money} €</span>
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
                                <IconButton class="material-icons" on:click={() => {
                                        openWarning = true;
                                        func = deleteGame;
                                        title = "igro";
                                        props = game.id;
                                    }}>delete</IconButton>
                            </div>
                        </Cell>
                    </Row>
                {/each}
                <Row>
                    {#each JSON.parse(contest.contestants) as contestant}
                        {#if Object.keys(contest.status).includes(contestant)}
                            {#each Object.keys(contest.status) as cs}
                                {#if cs === contestant}
                                    <Cell style="font-size: 20px; color: {contest.status[cs].total <= 0 ? '#F44336' : '#64DD17'};">
                                        <b>{contest.status[cs].total} €</b>
                                    </Cell>
                                {/if}
                            {/each}
                        {:else}
                            <Cell/>
                        {/if}
                    {/each}
                    <Cell/>
                </Row>
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
    {/if}
    {#if active.label === "Statistika"}
        <TabBar tabs={['Splošno', 'Dobljenih točk', "Razmerje zmaganih iger proti igranim igram", "Točk čez čas"]} let:tab bind:active={activeStats}>
            <!-- Note: the `tab` property is required! -->
            <Tab {tab}>
                <Label>{tab}</Label>
            </Tab>
        </TabBar>
        {#if activeStats === "Splošno"}
            <div use:chart={options}/>
        {/if}
        {#if activeStats === "Dobljenih točk"}
            <div use:chart={options_points}/>
        {/if}
        {#if activeStats === "Razmerje zmaganih iger proti igranim igram"}
            <div use:chart={options_wl}/>
        {/if}
        {#if activeStats === "Točk čez čas"}
            <div use:chart={options_overtime}/>
        {/if}
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
                <Item on:SMUI:action={async () => {
                    title = "osebo";
                    func = removePerson;
                    props = contestant;
                    openWarning = true;
                }}><Text>{contestant}</Text></Item>
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


