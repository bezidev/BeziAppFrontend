<script lang="ts">
  import { onMount } from "svelte";
  import { makeRequest } from "../constants";
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import Autocomplete from "@smui-extra/autocomplete";
  import Button, { Icon, Label } from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import SegmentedButton, { Segment } from "@smui/segmented-button";
  import Textfield from "@smui/textfield";
  import insane from "insane";
  import { marked } from "marked";
  import CharacterCounter from "@smui/textfield/character-counter";
  import FormField from "@smui/form-field";
  import Switch from "@smui/switch";
  import { navigate } from "svelte-navigator";
  import Select, { Option } from "@smui/select";

  export let id: string;

  let open = false;
  let name = "";
  let gamemode = "";
  let trulo_napovedal = "";
  let trulo_zbral = "";
  let kralji_napovedal = "";
  let kralji_zbral = "";
  let pagat_napovedal = "";
  let pagat_zbral = "";
  let kralj_napovedal = "";
  let kralj_zbral = "";
  let valat_napovedal = "";
  let valat_zbral = "";
  let barvni_valat_napovedal = "";
  let barvni_valat_zbral = "";
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
  };

  let contest;

  async function getContest() {
    contest = await makeRequest(`/tarot/contest/${id}`);
  }

  async function newGame() {
    // let fd = new FormData();
    // fd.append("gamemode", GAMEMODES[gamemode].toString());
    // fd.append("trula_zbral", trulo_zbral);
    // fd.append("trula_napovedal", trulo_napovedal);
    // fd.append("kralji_zbral", kralji_zbral);
    // fd.append("kralji_napovedal", kralji_napovedal);
    // fd.append("pagat_zbral", pagat_zbral);
    // fd.append("pagat_napovedal", pagat_napovedal);
    // fd.append("kralj_zbral", kralj_zbral);
    // fd.append("kralj_napovedal", kralj_napovedal);
    // fd.append("valat_zbral", valat_zbral);
    // fd.append("valat_napovedal", valat_napovedal);
    // fd.append("barvni_valat_zbral", barvni_valat_zbral);
    // fd.append("barvni_valat_napovedal", barvni_valat_napovedal);
    // fd.append("izgubil_monda", izgubil_monda);
    // fd.append("contestants", JSON.stringify(contestants).toString());
    await makeRequest(
      `/tarot/contest/${id}`,
      "POST",
      JSON.stringify({
        gamemode: GAMEMODES[gamemode].toString(),
        trula_zbral: trulo_zbral,
        trula_napovedal: trulo_napovedal,
        kralji_zbral: kralji_zbral,
        kralji_napovedal: kralji_napovedal,
        pagat_zbral: pagat_zbral,
        pagat_napovedal: pagat_napovedal,
        kralj_zbral: kralj_zbral,
        kralj_napovedal: kralj_napovedal,
        valat_zbral: valat_zbral,
        valat_napovedal: valat_napovedal,
        barvni_valat_zbral: barvni_valat_zbral,
        barvni_valat_napovedal: barvni_valat_napovedal,
        izgubil_monda: izgubil_monda,
        contestants: JSON.stringify(contestants).toString(),
      }),
      false,
      false,
      true
    );
  }

  onMount(async () => {
    await getContest();
  });
</script>

{#if contest !== undefined}
  <h1>Nova igra</h1>
  <p />
  <SegmentedButton
    segments={Object.keys(GAMEMODES)}
    let:segment
    singleSelect
    bind:selected={gamemode}
  ><Segment {segment}><Label>{segment}</Label></Segment></SegmentedButton>

  <p />
  <Select bind:value={contestant} label="Igralci">
    {#each JSON.parse(contest.contestants) as contestant}
      <Option
        value={contestant}
        on:click={() => {
          let ok = true;
          for (let i in contestants)
            if (contestants[i].username === contestant) {
              ok = false;
              break;
            }
          if (ok) {
            contestants.push({
              username: contestant,
              difference: 0,
              playing: false,
            });
            contestants = contestants;
          }
        }}>{contestant}</Option
      >
    {/each}
  </Select>

  <h4>Tekmovalci</h4>
  {#each contestants as cont}
    <h5>{cont.username}</h5>
    <FormField>
      <Switch bind:checked={cont.playing} />
      <span slot="label">Igra</span>
    </FormField>
    <br />
    <Textfield
      bind:value={cont.difference}
      style="width: 100%;"
      helperLine$style="width: 100%;"
      label="Razlika"
      type="number"
    />
    <p />
    <Button
      on:click={async () => {
        let cs = [];
        for (let i in contestants) {
          if (contestants[i].username !== cont.username)
            cs.push(contestants[i]);
        }
        contestants = cs;
      }}
      variant="raised"
    >
      <Icon class="material-icons">delete</Icon>
      <Label>Izbriši</Label>
    </Button>
  {/each}

  {#if !(gamemode === "Pikolo" || gamemode === "Berač" || gamemode === "Odprti berač" || gamemode === "Valat" || gamemode === "Barvni valat" || gamemode === "Klop" || gamemode === "Renons")}
    <h4>Trula</h4>
    <Select bind:value={trulo_zbral} label="Trulo zbral">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
    <Select bind:value={trulo_napovedal} label="Trulo napovedal">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>

    <h4>Kralji</h4>
    <Select bind:value={kralji_zbral} label="Kralje zbral">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
    <Select bind:value={kralji_napovedal} label="Kralje napovedal">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>

    <h4>Pagat ultimo</h4>
    <Select bind:value={pagat_zbral} label="Pagat ultimo zbral">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
    <Select bind:value={pagat_napovedal} label="Pagat ultimo napovedal">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>

    <h4>Kralj ultimo</h4>
    <Select bind:value={kralj_zbral} label="Kralj ultimo zbral">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
    <Select bind:value={kralj_napovedal} label="Kralj ultimo napovedal">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>

    <h4>Valat</h4>
    <Select bind:value={valat_zbral} label="Valat zbral">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
    <Select bind:value={valat_napovedal} label="Valat napovedal">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>

    <h4>Barvni valat</h4>
    <Select bind:value={barvni_valat_zbral} label="Barvni valat zbral">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
    <Select bind:value={barvni_valat_napovedal} label="Barvni valat napovedal">
      {#each ["", "igralci", "nasprotniki"] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>

    <h4>Izguba monda</h4>
    <Select bind:value={izgubil_monda} label="Izgubil monda">
      {#each ["", ...JSON.parse(contest.contestants)] as contestant}
        <Option value={contestant}>{contestant}</Option>
      {/each}
    </Select>
  {/if}

  <p />
  Z ustvarjanjem nove igre se strinjate s <a href="/tos.html">Pogoji uporabe</a>.
{/if}

<p />
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
