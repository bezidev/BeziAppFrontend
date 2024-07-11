<script lang="ts">
    import {makeRequest} from "../constants";
    import {onMount} from "svelte";
    import Button, {Icon, Label} from "@smui/button";
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Textfield from "@smui/textfield";
    import insane from "insane";
    import {marked} from "marked";
    import CharacterCounter from "@smui/textfield/character-counter";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {navigate} from "svelte-routing";

    let contests = {my_contests: [], public_contests: []};
    let open = false;
    let name = "";
    let description = "";
    let contestants = [];
    let contestant = "";
    let minimum_bet: number = 0;
    let is_private = true;

    async function getContests() {
        contests = await makeRequest(`/poker/contests`)
    }

    async function joinContest(id: string) {
        await makeRequest(`/poker/contest/${id}/join`, "POST")
        navigate(`/poker/contest/${id}`);
    }

    async function newContest() {
        let fd = new FormData();
        fd.append("contestants", JSON.stringify(contestants));
        fd.append("name", name);
        fd.append("description", description);
        fd.append("minimum_bid", minimum_bet.toString());
        fd.append("is_private", is_private.toString());
        fd.append("has_ended", "false");
        await makeRequest(`/poker/contests`, "POST", fd);
        await getContests();
    }

    onMount(async () => {
        await getContests();
    })
</script>

<Dialog
        bind:open
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <Title id="simple-title">Novo tekmovanje</Title>
    <Content id="simple-content">
        <Textfield bind:value={name} helperLine$style="width: 100%;" style="width: 100%;" label="Ime" />
        <p/>
        <Textfield textarea style="width: 100%;" input$maxlength={200} bind:value={description} label="Neobvezen opis tekmovanja. Podpira Markdown.">
            <CharacterCounter slot="internalCounter">0 / 200</CharacterCounter>
        </Textfield>

        {#if description !== ""}
            <h3>Predogled</h3>
            {@html insane(marked(description))}
        {/if}

        <FormField>
            <Switch bind:checked={is_private} />
            <span slot="label">Zasebno tekmovanje</span>
        </FormField>

        <p/>

        <Textfield style="width: 100%;" bind:value={minimum_bet} label="Vpišite najmanjše število žetonov za začetek igre" type="num" />

        <p/>

        <Textfield style="width: 100%;" bind:value={contestant} label="Vpišite GimSIS uporabniško ime vsakega tekmovalca posebej."/>
        <Button on:click={() => {
            if (!contestants.includes(contestant)) contestants.push(contestant)
            contestants = contestants;
            console.log(contestants)
        }} variant="raised"><Label>OK</Label></Button>

        <h4>Tekmovalci na seznamu</h4>
        Sistem vas bo avtomatično dodal na seznam, če se ne boste vključili.<br>
        {#each contestants as cont}
            - {cont}<br>
        {/each}
        <p/>
        Z ustvarjanjem Poker tekmovanja se strinjate s <a href="/tos.html">Pogoji uporabe</a>.
        Poker tekmovanje je narejeno izključno za zabavo, striktno prepovedano je zastavljati karkoli resničnega.
        Virtualni evri v tem modulu niso resnični.
    </Content>
    <Actions>
        <Button on:click={async () => await newContest()} variant="raised">
            <Icon class="material-icons">add</Icon>
            <Label>OK</Label>
        </Button>
    </Actions>
</Dialog>

<Button on:click={async () => open=!open} variant="raised">
    <Icon class="material-icons">add</Icon>
    <Label>Novo tekmovanje</Label>
</Button>

<h1>Moja tekmovanja</h1>
<LayoutGrid>
    {#each contests.my_contests as contest}
        <Cell on:click={() => navigate(`/poker/contest/${contest.id}`)}>
            <div class="demo-cell">
                <div style="margin: 0 10px 10px">
                    <h3>{contest.name}</h3>
                    <div class="break" />
                    {@html insane(marked(contest.description))}
                </div>
            </div>
        </Cell>
    {/each}
</LayoutGrid>

<h1>Javna tekmovanja</h1>
<LayoutGrid>
    {#each contests.public_contests as contest}
        <Cell on:click={async () => await joinContest(contest.id)}>
            <div class="demo-cell">
                <div style="margin: 0 10px 10px">
                    <h3>{contest.name}</h3>
                    <div class="break" />
                    {@html insane(marked(contest.description))}
                </div>
            </div>
        </Cell>
    {/each}
</LayoutGrid>
