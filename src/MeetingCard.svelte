<script lang="ts">
    import isMobile from "is-mobile";
    import {barvaPredmeta} from "./constants";
    import DetailsTimetable from "./Widgets/DetailsTimetable.svelte";
    import TooltipMobile from "./Widgets/TooltipMobile.svelte";

    export let n;

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
    <div style="padding: 3px; min-width: 93%" class="inline" on:click={() => open = true} on:keydown={() => {}} slot="torender">
        <div style="background-color: {barva}; padding: 5px; display: flex; width: 100%; display: inline-block; height: 40px; text-align: left; " class="pos">
            <div>
                <span style="font-size: 0.8em; font-weight: 700;" class="sameline">
                    {#if n.odpade}
                        <span class="strike inline">{n.kratko_ime}</span>
                        <!--<span class="inline" style="height: 10px;"><Icon class="material-icons">close</Icon></span>-->
                    {:else}
                        {n.kratko_ime}
                    {/if}
                </span>
                <br>
                <span style="font-size: 0.7em; position: absolute; bottom: 6px; left: 5px;">
                    <span class="{n.odpade ? 'strike' : ''}">
                        {#if n.alt_profesor === undefined || n.alt_profesor === "undefined"}[???]{:else}{n.alt_profesor}{/if}
                    </span>
                </span>
                <div
                        class="triangle"
                        style="border-top: 20px solid {n.implicitno_odpade ? 'darkblue' : (n.odpade ? 'lightblue': (n.ocenjevanje ? 'magenta' : (n.fixed_by_sharepoint ? 'yellow' : (n.fixed_by_paralelepiped ? 'white' : (n.vpisano_nadomescanje ? 'red' : (n.rocno ? 'LightSlateGray' : 'transparent'))))))};"
                ></div>
                <span class="classroom {n.odpade ? 'strike' : ''} {n.fixed_by_paralelepiped ? 'bold' : ''}">
                    {#if mobile}
                        {n.ucilnica.replace("Učilnica ", "").replace("Telovadnica", "T").replace("Predavalnica", "P")}
                    {:else}
                        {n.ucilnica}
                    {/if}
                </span>
            </div>
        </div>
    </div>
    <DetailsTimetable open={open} changeOpen={(v) => open=v} slot="tooltip">
        <h1>{n.kratko_ime}</h1>
        Predmet: <b>{n.ime}</b><br>
        Profesor: <b>{n.profesor}</b><br>
        Razred: <b>{n.razred}</b><br>
        Dan: <b>{n.dan}</b><br>
        Ura: <b>{n.ura}</b><br>

        {#if n.dnevniski_zapis}
            <b>Dnevniški zapis obstaja.</b><br>
        {:else}
            <b>Dnevniški zapis NE obstaja.</b><br>
        {/if}
        {#if n.rocno}
            <b>Ura je ročno vpisana s strani razvijalcev BežiApp sistema.</b><br>
        {/if}
        {#if n.vpisano_nadomescanje}
            <b>Nadomeščanje je vpisano v GimSIS-u.</b><br>
        {/if}
        {#if n.opis}
            Opis: <b>{n.opis}</b><br>
        {/if}
        {#if n.fixed_by_paralelepiped}
            <b>BežiApp je uporabil modul Paralelepiped in dodal selitve na ta brezmadežen urnik.</b><br>
            <!--Tip izostanka profesorja: <b>{n.tip_izostanka}</b><br>-->
            GimSIS učilnica: <b>{n.stara_ucilnica}</b><br>
        {/if}
        {#if n.fixed_by_sharepoint}
            <b>BežiApp je združil nadomeščanja na tej uri preko intraneta in GimSIS-a.</b><br>
            <!--Tip izostanka profesorja: <b>{n.tip_izostanka}</b><br>-->
            GimSIS kratko ime predmeta: <b>{n.gimsis_kratko_ime}</b><br>
            GimSIS ime predmeta: <b>{n.gimsis_ime}</b><br>
        {/if}
        {#if n.implicitno_odpade}
            <b>BežiApp na podlagi druge ure v tem dnevu sklepa, da ura odpade. Prosimo, preverite.</b><br>
        {/if}
        {#if n.odpade}
            <b>Ura ODPADE.</b><br>
        {/if}
        {#if n.ocenjevanje}
            Opis ocenjevanja: <b>{n.ocenjevanje_details.opis}</b><br>
        {/if}
        {#if n.alt_profesor === undefined || n.alt_profesor === "undefined"}
            BežiApp ni uspel pridobiti profesorja. Pošljite naslednje podatke razvijalcu:<br>
            Prof: <b>{n.alt_profesor}</b> <b>{typeof n.alt_profesor}</b><br>
            GimSIS prof: <b>{n.profesor}</b> <b>{typeof n.profesor}</b><br>
            <b>{JSON.stringify(n)}</b><br>
        {/if}
    </DetailsTimetable>
</TooltipMobile>
