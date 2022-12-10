<script lang="ts">
    import {onMount} from "svelte";
    import {makeRequest} from "../constants";
    import DataTable, {Body, Cell, Head, Row} from "@smui/data-table";
    import Button, {Icon, Label} from "@smui/button";
    import {navigate} from "svelte-navigator";
    import IconButton from "@smui/icon-button";

    export let id: string;

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
    }

    let contest;

    async function getContest() {
        contest = await makeRequest(`/tarot/contest/${id}`)
    }

    async function deleteGame(game_id: string) {
        await makeRequest(`/tarot/game/${game_id}`, "DELETE");
        await getContest();
    }

    onMount(async () => {
        await getContest();
    })
</script>

{#if contest !== undefined}
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


