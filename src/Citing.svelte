<script lang="ts">
    import SegmentedButton, { Segment } from '@smui/segmented-button';
    import {Label} from "@smui/common";
    import Textfield from "@smui/textfield";
    import HelperText from "@smui/textfield/helper-text";
    import IconButton from "@smui/icon-button";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";

    const types = [
        "Knjiga",
        "Spletna stran",
        "Članek iz revije, časopisa, časnika ali zbornika",
    ];

    let naslov = "";
    let podnaslov = "";
    let izdaja = 0;
    let natis = 0;
    let zalozba = "";
    let leto_izd = 2000;
    let zbirka = "";
    let stetje = 0;
    let datum_izd = "";
    let spl_stran = "";
    let letnik = 0;
    let stevilka = 0;
    let od_strani = 0;
    let do_strani = 0;
    let casnik = false;

    const authors = [
        "Neznan avtor",
        "En avtor",
        "Dva avtorja",
        "Trije ali več avtorjev",
    ];

    let avtorji = [
        {ime: "", priimek: ""},
        {ime: "", priimek: ""},
    ];

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    let g = [];
    let spp = "";
    $: {
        g = [];
        spp = "";
        if (author === "En avtor" || author === "Trije ali več avtorjev") {
            g.push({beseda: `${capitalizeFirstLetter(avtorji[0].priimek)}, ${capitalizeFirstLetter(avtorji[0].ime)}`, lezece: false, krepko: false});
            spp += `${capitalizeFirstLetter(avtorji[0].priimek)}`;
            if (author === "Trije ali več avtorjev") {
                g.push({beseda: `, idr`, lezece: false, krepko: false});
                spp += ` idr. `;
            }
            g.push({beseda: `. `, lezece: false, krepko: false});
        } else if (author === "Dva avtorja") {
            spp += `${capitalizeFirstLetter(avtorji[0].priimek)} in `;
            spp += `${capitalizeFirstLetter(avtorji[1].priimek)}`;
            g.push({beseda: `${capitalizeFirstLetter(avtorji[0].priimek)}, ${capitalizeFirstLetter(avtorji[0].ime)} in ${capitalizeFirstLetter(avtorji[1].ime)}, ${capitalizeFirstLetter(avtorji[1].priimek)}`, lezece: false, krepko: false});
            g.push({beseda: `. `, lezece: false, krepko: false});
        }

        if (spp === "") {
            spp = naslov;
        }

        if (od_strani > 0) {
            spp += ` ${od_strani}`
        }

        let d = new Date();

        if (type === "Knjiga") {
            g.push({beseda: `${naslov}`, lezece: true, krepko: false});
            if (podnaslov !== "") {
                g.push({beseda: `: ${podnaslov}`, lezece: true, krepko: false});
            }
            g.push({beseda: `. `, lezece: false, krepko: false});
            if (izdaja > 0) {
                g.push({beseda: `${izdaja}. izd.`, lezece: false, krepko: false});
                if (natis > 0) {
                    g.push({beseda: `, `, lezece: false, krepko: false});
                }
            }
            if (natis > 0) {
                g.push({beseda: `${natis}. natis.`, lezece: false, krepko: false});
            }
            if (izdaja > 0 || natis > 0) {
                g.push({beseda: ` `, lezece: false, krepko: false});
            }
            g.push({beseda: `${zalozba}, ${leto_izd}. `, lezece: false, krepko: false});
            if (zbirka !== "") {
                g.push({beseda: `${zbirka}`, lezece: false, krepko: false});
                if (stetje > 0) {
                    g.push({beseda: ` `, lezece: false, krepko: false});
                }
            }
            if (stetje > 0) {
                g.push({beseda: `${stetje}`, lezece: false, krepko: false});
            }
            g.push({beseda: ".", lezece: false, krepko: false});
        } else if (type === "Spletna stran") {
            g.push({beseda: `»${podnaslov}«. `, lezece: false, krepko: false});
            g.push({beseda: `${naslov}`, lezece: true, krepko: false});
            // vejica vs pika
            // wtf mla9
            if (datum_izd !== "") {
                g.push({beseda: `, ${datum_izd}, `, lezece: false, krepko: false});
            } else {
                g.push({beseda: `. `, lezece: false, krepko: false});
            }
            g.push({beseda: `${spl_stran}. `, lezece: false, krepko: false});
            g.push({beseda: `Citirano ${d.getDay()}. ${d.getMonth()}. ${d.getFullYear()}. `, lezece: false, krepko: false});
        } else if (type === "Članek iz revije, časopisa, časnika ali zbornika") {
            g.push({beseda: `»${podnaslov}«. `, lezece: false, krepko: false});
            g.push({beseda: `${naslov}, `, lezece: true, krepko: false});
            if (!casnik) {
                if (letnik > 0) {
                    g.push({beseda: `let. ${letnik}, `, lezece: false, krepko: false});
                }
                if (stevilka > 0) {
                    g.push({beseda: `št. ${stevilka}, `, lezece: false, krepko: false});
                }
            }
            if (datum_izd !== "") {
                g.push({beseda: `${datum_izd}, `, lezece: false, krepko: false});
            }
            g.push({beseda: `str. ${od_strani}`, lezece: false, krepko: false});
            if (do_strani !== od_strani && do_strani > 0) {
                g.push({beseda: `-${do_strani}`, lezece: false, krepko: false});
            }
            g.push({beseda: `.`, lezece: false, krepko: false});
        }
        g = g;
    }

    let type = "";
    let author = "";
</script>

<h1>Navajanje virov</h1>
Modul trenutno navaja po MLA9 standardu (še ni čisto končan), čeprav imam še namen vključiti druge, kot je na primer BS1.

Navajanje virov je trenutno še v zelo <b>eksperimentalni fazi</b>, deluje za večino navedkov, a bi vseeno priporočal pregled navedkov.

<p/>

Za članek iz časnika si izberite Članek iz revije, časopisa, časnika ali zbornika (če vaš časnik ni spletni vir) ali Spletna stran (če je vaš časnik spletni vir).

<p/>

<SegmentedButton segments={types} let:segment singleSelect bind:selected={type}>
    <!-- Note: the `segment` property is required! -->
    <Segment {segment}>
        <Label>{segment}</Label>
    </Segment>
</SegmentedButton>

<p/>

{#if type !== ""}
    <SegmentedButton segments={authors} let:segment singleSelect bind:selected={author}>
        <!-- Note: the `segment` property is required! -->
        <Segment {segment}>
            <Label>{segment}</Label>
        </Segment>
    </SegmentedButton>

    <p/>

    {#if author === "En avtor" || author === "Trije ali več avtorjev"}
        {#if author === "Trije ali več avtorjev"}
            V primeru treh ali večih avtorjev napišite samo prvega oziroma najpomembnejšega.
            <p/>
        {/if}
        <div class="sameline">
            <div class="inline" style="width: 50%">
                <Textfield bind:value={avtorji[0].ime} style="width: 100%" helperLine$style="width: 100%;" label="Ime avtorja">
                    <HelperText slot="helper">Ime</HelperText>
                </Textfield>
            </div>
            <div class="inline" style="width: 50%">
                <Textfield bind:value={avtorji[0].priimek} style="width: 100%" helperLine$style="width: 100%;" label="Priimek avtorja">
                    <HelperText slot="helper">Priimek</HelperText>
                </Textfield>
            </div>
        </div>
    {:else if author === "Dva avtorja"}
        <div class="sameline">
            <div class="inline" style="width: 50%">
                <Textfield bind:value={avtorji[0].ime} style="width: 100%" helperLine$style="width: 100%;" label="Ime avtorja">
                    <HelperText slot="helper">Ime</HelperText>
                </Textfield>
            </div>
            <div class="inline" style="width: 50%">
                <Textfield bind:value={avtorji[0].priimek} style="width: 100%" helperLine$style="width: 100%;" label="Priimek avtorja">
                    <HelperText slot="helper">Priimek</HelperText>
                </Textfield>
            </div>
        </div>
        <div class="sameline">
            <div class="inline" style="width: 50%">
                <Textfield bind:value={avtorji[1].ime} style="width: 100%" helperLine$style="width: 100%;" label="Ime avtorja">
                    <HelperText slot="helper">Ime</HelperText>
                </Textfield>
            </div>
            <div class="inline" style="width: 50%">
                <Textfield bind:value={avtorji[1].priimek} style="width: 100%" helperLine$style="width: 100%;" label="Priimek avtorja">
                    <HelperText slot="helper">Priimek</HelperText>
                </Textfield>
            </div>
        </div>
    {/if}

    {#if type === "Knjiga"}
        <Textfield bind:value={naslov} style="width: 100%" helperLine$style="width: 100%;" label="Naslov">
            <HelperText slot="helper">Naslov</HelperText>
        </Textfield>

        <Textfield bind:value={podnaslov} style="width: 100%" helperLine$style="width: 100%;" label="Podnaslov, če ga delo ima">
            <HelperText slot="helper">Podnaslov</HelperText>
        </Textfield>

        <Textfield bind:value={izdaja} style="width: 100%" helperLine$style="width: 100%;" type="numeric" label="Izdaja (če ni znana, pustite nič)">
            <HelperText slot="helper">Izdaja</HelperText>
        </Textfield>

        <Textfield bind:value={natis} style="width: 100%" helperLine$style="width: 100%;" type="numeric" label="Natis (če ni znan, pustite nič)">
            <HelperText slot="helper">Natis</HelperText>
        </Textfield>

        <Textfield bind:value={zalozba} style="width: 100%" helperLine$style="width: 100%;" label="Založba">
            <HelperText slot="helper">Založba</HelperText>
        </Textfield>

        <Textfield bind:value={leto_izd} style="width: 100%" helperLine$style="width: 100%;" type="numeric" label="Leto izdaje">
            <HelperText slot="helper">Leto izdaje</HelperText>
        </Textfield>

        <Textfield bind:value={zbirka} style="width: 100%" helperLine$style="width: 100%;" label="Zbirka (če ni znana, ne vpišite ničesar)">
            <HelperText slot="helper">Zbirka</HelperText>
        </Textfield>

        <Textfield bind:value={stetje} style="width: 100%" helperLine$style="width: 100%;" type="numeric" label="Zaporedna številka knjige v zbirki (štetje, če ni znano, pustite nič)">
            <HelperText slot="helper">Zaporedna številka v zbirki</HelperText>
        </Textfield>
    {:else if type === "Spletna stran"}
        <Textfield bind:value={naslov} style="width: 100%" helperLine$style="width: 100%;" label="Ime spletne strani">
            <HelperText slot="helper">Ime</HelperText>
        </Textfield>

        <div class="sameline">
            <div class="inline" style="width: 60%;">
                <Textfield bind:value={podnaslov} style="width: 100%" helperLine$style="width: 100%;" label="Naslov članka">
                    <HelperText slot="helper">Naslov</HelperText>
                </Textfield>
            </div>

            <div class="inline" style="width: 40%;">
                <Textfield bind:value={datum_izd} style="width: 100%" helperLine$style="width: 100%;" label="Datum nastanka članka (če ni znano, pustite prazno)">
                    <HelperText slot="helper">Datum nastanka (DD. MM. YYYY)</HelperText>
                </Textfield>
            </div>
        </div>

        <Textfield bind:value={spl_stran} style="width: 100%" helperLine$style="width: 100%;" label="Povezava do spletne strani">
            <HelperText slot="helper">Povezava</HelperText>
        </Textfield>
    {:else if type === "Članek iz revije, časopisa, časnika ali zbornika"}
        <Textfield bind:value={naslov} style="width: 100%" helperLine$style="width: 100%;" label="Naslov revije, časopisa, časnika ali zbornika">
            <HelperText slot="helper">Naslov revije</HelperText>
        </Textfield>

        <Textfield bind:value={podnaslov} style="width: 100%" helperLine$style="width: 100%;" label="Naslov članka">
            <HelperText slot="helper">Naslov članka</HelperText>
        </Textfield>

        <FormField>
            <Switch bind:checked={casnik} />
            <span slot="label">Časnik</span>
        </FormField>

        <p/>

        {#if !casnik}
            <div class="sameline">
                <div class="inline" style="width: 50%;">
                    <Textfield bind:value={letnik} type="numeric" style="width: 100%" helperLine$style="width: 100%;" label="Letnik (če ni znan, pustite 0)">
                        <HelperText slot="helper">Letnik</HelperText>
                    </Textfield>
                </div>

                <div class="inline" style="width: 50%;">
                    <Textfield bind:value={stevilka} type="numeric" style="width: 100%" helperLine$style="width: 100%;" label="Številka revije (če ni znana, pustite 0)">
                        <HelperText slot="helper">Številka</HelperText>
                    </Textfield>
                </div>
            </div>
        {/if}

        {#if !casnik}
            <Textfield bind:value={datum_izd} style="width: 100%" helperLine$style="width: 100%;" label="Leto izdaje (če ni znano, pustite prazno)">
                <HelperText slot="helper">YYYY</HelperText>
            </Textfield>
        {:else}
            <Textfield bind:value={datum_izd} style="width: 100%" helperLine$style="width: 100%;" label="Datum nastanka članka (če ni znano, pustite prazno)">
                <HelperText slot="helper">Datum nastanka (DD. MM. YYYY)</HelperText>
            </Textfield>
        {/if}
    {/if}

    {#if type !== "Spletna stran"}
        <div class="sameline">
            <div class="inline" style="width: 50%;">
                <Textfield bind:value={od_strani} style="width: 100%" helperLine$style="width: 100%;" type="numeric" label="Od strani">
                    <HelperText slot="helper">Od strani</HelperText>
                </Textfield>
            </div>

            <div class="inline" style="width: 50%;">
                <Textfield bind:value={do_strani} style="width: 100%" helperLine$style="width: 100%;" type="numeric" label="Do strani">
                    <HelperText slot="helper">Do strani</HelperText>
                </Textfield>
            </div>
        </div>
    {/if}
{/if}

<h2>Generiran citat</h2>
<div style="text-indent: -36px; padding-left: 36px;">
    {#each g as gc}
        {#if gc.lezece}
            <i>{gc.beseda}</i>
        {:else if gc.krepko}
            <b>{gc.beseda}</b>
        {:else}
            {gc.beseda}
        {/if}
    {/each}
</div>

<h2>Generiran sprotni citat</h2>
({spp})

