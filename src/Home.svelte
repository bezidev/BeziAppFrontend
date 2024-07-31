<script lang="ts">
    import Timetable from "./Widgets/Timetable.svelte";
    import {handleRejection, makeRequest, saveBlob} from "./constants";
    import {marked} from "marked";
    import Button, {Icon, Label} from "@smui/button";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined || token === "") {
        let j = {
            message: "Token is either null or undefined",
            fileName: `Home.svelte`,
            lineNumber: 5,
            columnNumber: 0,
            stack: token,
        };
        handleRejection(j);
        localStorage.removeItem("key");
        window.location.href = "/login";
    }

    async function downloadGradesExport() {
        await saveBlob(await makeRequest(`/grades/export`, "GET", undefined, false, true))
    }
</script>

<div style="padding: 10px; background-color: darkorange; border-radius: 10px;">
    <h2>Prenos ocen na BežiApp Evolved</h2>
    Če želite prenesti vse svoje ocene iz GimSISa na prenovljen BežiApp sistem, izvozite vse svoje ocene preden GimSIS ugasne. Če jih izvozite zdaj, jih boste lahko kasneje prenesli v BežiApp Evolved sistem, ki bo podpiral eAsistent, in s tem shranili vse pomembnejše zgodovinske podatke.

    <p/>

    Podatke prenesite s klikom na spodnji gumb. Ustvarjeno datoteko skrbno shranite, dokler je ne uvozite v prenovljen BežiApp sistem. Datoteke ne delite z drugimi, razen če hočete, da drugi vidijo vse vaše ocene.

    <p/>

    <Button on:click={async () => await downloadGradesExport()} variant="raised">
        <Icon class="material-icons">download</Icon>
        <Label>Izvozi vse ocene</Label>
    </Button>
</div>

<p/>

<Timetable />

