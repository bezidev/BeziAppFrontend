<script lang="ts">
    import isMobile from "is-mobile";
    import BottomSheet from "./BottomSheet.svelte";
    import Tooltip, {Wrapper} from "@smui/tooltip";

    export let grade;

    export let stalne;

    const mobile = isMobile();

    let open = false;

    const gradeColors = [
        "#F44336",
        "#FF9800",
        "#FFC107",
        "#8BC34A",
        "#64DD17"
    ];
</script>

{#if (stalne && grade.je_zakljucena) || !stalne}
    <Wrapper>
        <div style="color: {gradeColors[parseInt(grade.ocena) - 1]}; display:inline-block; font-size: 1.25rem; font-weight: 600;" on:click={(e) => {
            if (mobile) {
                open = true;
            }
        }}>
            <span class="{grade.je_zakljucena ? '' : 'zacasna'}">
                {grade.ocena}
            </span>
        </div>

        {#if !mobile}
            <Tooltip unbounded hideDelay={0}>
                <h1>{grade.predmet} - {grade.ocena}</h1>
                Datum: <b>{grade.datum}</b><br>
                Profesor: <b>{grade.ucitelj}</b><br>
                Tip ocenjevanja: <b>{grade.tip}</b><br>
                Rok: <b>{grade.rok}</b><br>
                Opis ocenjevanja: <b>{grade.opis_ocenjevanja}</b><br>
                <hr>
                {#if grade.je_zakljucena}
                    <b>Ocena je STALNA</b>
                {/if}
            </Tooltip>
        {/if}
    </Wrapper>
    {#if mobile && open}
        <BottomSheet open={open} callback={(value) => open=value}>
            <main class="body fill">
                <h1>{grade.predmet} - {grade.ocena}</h1>
                Datum: <b>{grade.datum}</b><br>
                Profesor: <b>{grade.ucitelj}</b><br>
                Tip ocenjevanja: <b>{grade.tip}</b><br>
                Rok: <b>{grade.rok}</b><br>
                Opis ocenjevanja: <b>{grade.opis_ocenjevanja}</b><br>
                <hr>
                {#if grade.je_zakljucena}
                    <b>Ocena je STALNA</b>
                {/if}
            </main>
        </BottomSheet>
    {/if}
{/if}