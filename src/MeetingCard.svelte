<script lang="ts">
    import isMobile from "is-mobile";
    import {barvaPredmeta} from "./constants";
    import DetailsTimetable from "./Widgets/DetailsTimetable.svelte";
    import TooltipMobile from "./Widgets/TooltipMobile.svelte";
    import type {TimetableHour} from "./ts/timetable";

    export let n: TimetableHour;

    let selected = localStorage.getItem("colorGeneration") ?? "Dolgega imena predmeta";
    let paleta = JSON.parse(localStorage.getItem("palette") ?? "[]");

    let barva = "";

    $: {
        barva = barvaPredmeta(selected, paleta, n);
    }

    const mobile: boolean = isMobile();
    let open = false;
</script>

<style>
    a { color: white; }

    .triangle {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        border-left: 20px solid transparent;
        right: 0;
    }

    .classroom {
        position: absolute;
        bottom: 6px;
        right: 5px;
        font-size: 0.7em;
    }

    a:link { text-decoration: none; }

    a:visited { text-decoration: none; }

    a:hover { text-decoration: none; }

    a:active { text-decoration: none; }

    .pos { position: relative; }

    .strike {
        text-decoration: line-through;
        text-decoration-thickness: 0.2em;
    }

    /*:global(i) {
        padding: 0 !important;
    }*/
</style>

<TooltipMobile>
    <div style="padding: 3px; min-width: 93%" class="inline" on:click={() => open = true} on:keydown={() => {}} slot="torender" role="toolbar" tabindex="0">
        <div style="background-color: {barva}; padding: 5px; display: flex; width: 100%; display: inline-block; height: 40px; text-align: left; " class="pos">
            <div>
                <span style="font-size: 0.8em; font-weight: 700;" class="sameline">
                    {#if n.hour_special_type === "cancelled"}
                        <span class="strike inline">{n.subject.name}</span>
                    {:else}
                        {n.subject.name}
                    {/if}
                </span>
                <br>
                <span style="font-size: 0.7em; position: absolute; bottom: 6px; left: 5px;">
                    <span class="{n.hour_special_type === 'cancelled' ? 'strike' : ''}">
                        {n.teacher_name_short}
                    </span>
                </span>
                <div
                        class="triangle"
                        style="border-top: 20px solid {n.hour_special_type === 'cancelled' ? 'lightblue': (n.hour_special_type === 'exam' ? 'magenta' : (n.hour_special_type === 'pre-exam' ? 'white' : (n.hour_special_type === 'substitution' ? 'red' : `transparent`)))};"
                />
                <span class="classroom {n.hour_special_type === 'cancelled' ? 'strike' : ''}">
                    {#if mobile}
                        {n.classroom.name.replace("Učilnica ", "").replace("Telovadnica", "T").replace("Predavalnica", "P")}
                    {:else}
                        {n.classroom.name}
                    {/if}
                </span>
            </div>
        </div>
    </div>
    <DetailsTimetable open={open} changeOpen={(v) => open=v} slot="tooltip">
        <h1>{n.subject.name}</h1>
        {#if n.teachers.length !== 0}Profesor: <b>{n.teachers[0].name}</b><br>{/if}
        Razredi: <b>{n.departments.map(function(elem){
            return elem.name;
        }).join(", ")}</b><br>
        Dan: <b>{n.time.date}</b><br>
        Ura: <b>{n.hour}</b><br>

        {#if n.completed}
            <b>Ura je bila končana.</b><br>
        {/if}
        {#if n.hour_special_type === 'substitution'}
            <b>Nadomeščanje je vpisano v eAsistent.</b><br>
        {/if}
        {#if n.hour_special_type === 'cancelled'}
            <b>Ura ODPADE.</b><br>
        {/if}
        {#if n.hour_special_type === 'exam'}
            <b>Ura je ocenjevanje.</b><br>
        {/if}
        {#if n.hour_special_type === 'pre-exam'}
            <b>Ura je preverjanje pred ocenjevanjem znanja.</b><br>
        {/if}
    </DetailsTimetable>
</TooltipMobile>
