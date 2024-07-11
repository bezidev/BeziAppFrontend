<script lang="ts">
    import TextField from '@smui/textfield';
    import Icon from '@smui/textfield/icon';
    import HelperText from '@smui/textfield/helper-text';
    import CharacterCounter from "@smui/textfield/character-counter";
    import {navigate} from "svelte-routing";
    import Button, {Label} from "@smui/button";
    import {makeRequest} from "./constants";

    let title = "";
    let description = "";
    let video_id = "";
</script>

<h1>Nov predlog pesmi</h1>

Bodite pozorni pri izpolnjevanju tega obrazca. Ko enkrat oddate, ne morete popravljati vaše oddaje. V primeru, da obrazec ne bo izpolnjen tako, kot je po navodilih, ima manjšo možnost, da prestane potrditev s strani urednikov šolskega radia.

<p/>

<TextField bind:value={title} label="Avtor in naslov pesmi (npr. Rick Astley - Never gonna give you up)" style="width: 100%;" helperLine$style="width: 100%;" />

<p/>

<TextField textarea
           input$maxlength={1000} bind:value={description}
           label="Neobvezen opis pesmi (lahko pomaga, da se uredniki lažje odločijo, ni pa obvezno). Podpira Markdown."
           style="width: 100%;" helperLine$style="width: 100%;"
>
    <CharacterCounter slot="internalCounter">0 / 1000</CharacterCounter>
</TextField>

<p/>

<TextField bind:value={video_id} label="YouTube video identifikator ali povezava do videa (npr. dQw4w9WgXcQ)" style="width: 100%;" helperLine$style="width: 100%;" />

<p/>

S klikom na spodnji gumb se strinjate s <a href="/tos.html">pogoji uporabe</a>.

<p/>

<Button on:click={async () => {
    let fd = new FormData();
    fd.append('name', title);
    fd.append("description", description);
    fd.append("youtube_id", video_id);
    await makeRequest(`/radio/suggestions`, "POST", fd)
    navigate("/radio")
}} variant="raised">
    <Icon class="material-icons">add</Icon>
    <Label>Objavi predlog</Label>
</Button>
