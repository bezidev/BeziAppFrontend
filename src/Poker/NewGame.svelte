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

    let contestants = [];
    let contestant = "";

    let contest;

    async function getContest() {
        contest = await makeRequest(`/poker/contest/${id}`);
    }

    async function newGame() {
        await makeRequest(
            `/poker/contest/${id}`,
            "POST",
            JSON.stringify(removeNulls(contestants)),
            false,
            false,
            true,
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
            <Option value={contestant} on:click={() => {
                let ok = true;
                for (let i in contestants) if (contestants[i].user_id === contestant) {
                    ok = false;
                    break;
                }
                if (ok) {
                    contestants.push({
                        user_id: contestant,
                        money: -contest.minimum_bet,
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

    <h4>Igralci</h4>
    {#each contestants as cont, i}
        <h5>{cont.user_id}</h5>
        <p/>
        Količina denarja: <b>{contest.status[cont.user_id].total} €</b>
        <p/>
        <Textfield bind:value={cont.money} style="width: 100%;" helperLine$style="width: 100%;" label="Pridobljenega denarja" type="tel" />
        <p/>
        <Button on:click={async () => {
            let cs = [];
            for (let i in contestants) if (contestants[i].user_id !== cont.user_id) {
                console.log(contestants, i);
                cs.push(contestants[i]);
            }
            contestants = cs;
        }} variant="raised">
            <Icon class="material-icons">delete</Icon>
            <Label>Izbriši</Label>
        </Button>
        <Button on:click={async () => {
            contestants[i].money = -contest.status[cont.user_id].total;
        }} variant="raised">
            <Icon class="material-icons">savings</Icon>
            <Label>All in</Label>
        </Button>
        <Button on:click={async () => {
            let money = 0;
            let splitBetween = 1;
            for (let i in contestants) if (contestants[i].user_id !== cont.user_id) {
                if (contestants[i].money < 0) {
                    money += Math.abs(contestants[i].money);
                } else if (contestants[i].money > 0) {
                    splitBetween++;
                }
            }
            contestants[i].money = money / splitBetween;
        }} variant="raised">
            <Icon class="material-icons">emoji_events</Icon>
            <Label>Izračunaj dobiček za zmagovalca</Label>
        </Button>
        <p/>
    {/each}

    <p/>
    Z ustvarjanjem nove igre se strinjate s <a href="/tos.html">Pogoji uporabe</a>.

    <p/>
    <Button
            on:click={async () => {
            await newGame();
            navigate(`/poker/contest/${id}`);
        }}
            variant="raised"
    >
        <Icon class="material-icons">add</Icon>
        <Label>OK</Label>
    </Button>
{/if}
