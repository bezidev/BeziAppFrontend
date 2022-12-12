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
    import {navigate} from "svelte-navigator";

    let contests = [];
    let open = false;
    let name = "";
    let description = "";
    let contestants = [];
    let contestant = "";
    let is_private = false;

    async function getContests() {
        contests = await makeRequest(`/tarot/contests`)
    }

    async function newContest() {
        let fd = new FormData();
        fd.append("contestants", JSON.stringify(contestants));
        fd.append("name", name);
        fd.append("description", description);
        fd.append("is_private", is_private.toString());
        fd.append("has_ended", "false");
        await makeRequest(`/tarot/contests`, "POST", fd);
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
            {@html marked(insane(description))}
        {/if}

        <FormField>
            <Switch bind:checked={is_private} />
            <span slot="label">Zasebno tekmovanje</span>
        </FormField>

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
        Z ustvarjanjem Tarok tekmovanja se strinjate s <a href="/tos.html">Pogoji uporabe</a>.
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

<LayoutGrid>
    {#each contests as contest}
        <Cell on:click={() => navigate(`/tarot/contest/${contest.id}`)}>
            <div class="demo-cell">
                <div style="margin: 0 10px 10px">
                    <h3>{contest.name}</h3>
                    <div class="break" />
                    {@html marked(insane(contest.description))}
                </div>
            </div>
        </Cell>
    {/each}
</LayoutGrid>
