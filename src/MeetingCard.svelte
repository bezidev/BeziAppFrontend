<script lang="ts">
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import isMobile from "is-mobile";
    import randomColor from "randomcolor";
    import BottomSheet from "./Widgets/BottomSheet.svelte";
    import uniqolor from "uniqolor";
    import { Icon } from '@smui/common';

    export let n;

    let selected = localStorage.getItem("colorGeneration") ?? "Dolgega imena predmeta";
    let paleta = JSON.parse(localStorage.getItem("palette") ?? "[]");

    let barva = "";

    $: {
        if (selected !== "Lastne barvne plošče") {
            barva = uniqolor(selected === "Kratkega imena predmeta" ? n.kratko_ime : n.ime, {
                saturation: [50, 70],
                lightness: [20, 30],
            }).color;
        } else {
            //console.log("uporabljam lastno barvno ploščo");

            for (let i = 0; i < paleta.length; i++) {
                let predmet = paleta[i];
                //console.log(predmet.id.toLowerCase(), n.kratko_ime.toLowerCase())
                if (n.kratko_ime.toLowerCase().includes(predmet.id.toLowerCase())) {
                    barva = predmet.color;
                    break;
                }
            }

            if (barva === "") {
                for (let i = 0; i < paleta.length; i++) {
                    let predmet = paleta[i];
                    //console.log(predmet.id.toLowerCase(), n.ime.toLowerCase())
                    if (n.ime.toLowerCase().includes(predmet.id.toLowerCase())) {
                        barva = predmet.color;
                        break;
                    }
                }

                if (barva === "") {
                    barva = uniqolor(n.ime, {saturation: [50, 70], lightness: [20, 30],}).color;
                }
            }
        }
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

<div style="padding: 3px; min-width: 93%" class="inline" on:click={() => open = true} on:keydown={() => {}}>
    <!--<Wrapper>-->
    <div style="background-color: {barva}; padding: 5px; display: flex; width: 100%; display: inline-block; height: 40px; text-align: left; " class="pos">
        <!--<div style="z-index: 500; position: absolute;">
            {#if n.odpade}
                <div style="width: 400px; height: 400px;">
                    <Icon class="material-icons" style="color: black;">
                        <span style="font-size: 2em;">close</span>
                    </Icon>
                </div>
            {/if}
        </div>-->
        <div style="z-index: 700;">
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
                    {n.alt_profesor}
                </span>
            </span>
            <div
                    class="triangle"
                    style="border-top: 20px solid {n.implicitno_odpade ? 'darkblue' : (n.odpade ? 'lightblue': (n.ocenjevanje ? 'magenta' : (n.fixed_by_sharepoint ? 'yellow' : (n.vpisano_nadomescanje ? 'red' : (n.rocno ? 'LightSlateGray' : 'transparent')))))};"
            ></div>
            <span class="classroom {n.odpade ? 'strike' : ''}">
                {#if mobile}
                    {n.ucilnica.replace("Učilnica ", "").replace("Telovadnica", "T").replace("Predavalnica", "P")}
                {:else}
                    {n.ucilnica}
                {/if}
            </span>
        </div>
    </div>
    {#if !mobile}
        <Wrapper>
            <Tooltip unbounded hideDelay={0}>
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
                {#if n.fixed_by_sharepoint}
                    <b>BežiApp je združil nadomeščanja na tej uri preko intraneta in GimSIS-a.</b><br>
                    <!--Tip izostanka profesorja: <b>{n.tip_izostanka}</b><br>-->
                    Tip nadomeščanja: <b>{n.opis}</b><br>
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
            </Tooltip>
        </Wrapper>
    {/if}
</div>

{#if mobile && open}
    <BottomSheet open={open} callback={(value) => open=value}>
        <main class="body fill">
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
            {#if n.fixed_by_sharepoint}
                <b>BežiApp je združil nadomeščanja na tej uri preko intraneta in GimSIS-a.</b><br>
                <!--Tip izostanka profesorja: <b>{n.tip_izostanka}</b><br>-->
                Tip nadomeščanja: <b>{n.opis}</b><br>
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
        </main>
    </BottomSheet>
{/if}
