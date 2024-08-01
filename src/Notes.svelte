<script lang="ts">
    import Autocomplete from "@smui-extra/autocomplete";
    import Button, {Icon, Label} from "@smui/button";
    import Dialog, {Title, Content, Actions} from '@smui/dialog';
    import LayoutGrid, {Cell} from '@smui/layout-grid';
    import SegmentedButton, {Segment} from '@smui/segmented-button';
    import {baseurl, makeRequest} from "./constants";
    import {onMount} from "svelte";
    import Textfield from "@smui/textfield";
    import insane from "insane";
    import {marked} from "marked";
    import CharacterCounter from "@smui/textfield/character-counter";
    import type {Upload} from "./ts/uploads";
    import Card from '@smui/card';

    const isModuleAdministrator = localStorage.getItem("is_global_administrator") === "true" || localStorage.getItem("is_upload_moderator") === "true";

    // MM nima dostopa do eAsistenta, posledično BežiAppa, kar pomeni, da je mednarodno šolo vključevati enostavno brez zveze.
    const classes = [
        "1. A",
        "1. B",
        "1. C",
        "1. D",
        "1. E",
        "1. F",
        "1. G",
        "1. H", // nekoč je bil na Bežigradu tudi H. Puščam tu za legacy razloge
        "1. Š",
        "2. A",
        "2. B",
        "2. C",
        "2. D",
        "2. E",
        "2. F",
        "2. G",
        "2. H",
        "2. Š",
        "3. A",
        "3. B",
        "3. C",
        "3. D",
        "3. E",
        "3. F",
        "3. G",
        "3. H",
        "3. Š",
        "4. A",
        "4. B",
        "4. C",
        "4. D",
        "4. E",
        "4. F",
        "4. G",
        "4. H",
        "4. Š",
    ];

    const extended_classes = [
        "1. letnik",
        "2. letnik",
        "3. letnik",
        "4. letnik",
        ...classes,
    ]

    const teachers = [
        "Gregor Anželj",
        "Milan Bahar",
        "Marjana Benedik",
        "Milan Bizjan",
        "Tamara Bosnič",
        "Savina Brcar",
        "Alenka Budihna",
        "Saša Cecowski",
        "Dragica Cipot",
        "Peter Cizl",
        "Irena Česnik",
        "Vilko Domajnko",
        "Andreja Dover",
        "Kristina Drnovšek Juteršek",
        "Mojca Ekart Dvorščak",
        "Nina Engelman",
        "Špela Frantar",
        "Tanja Gabriel",
        "Karmen Goršak",
        "Marja Gričar",
        "Polona Gros Remec",
        "Ana Grozdanić Pavlin",
        "Manica Habjanič Gaberšek",
        "Hilda Hašaj Tegelj",
        "Urška Haule Feguš",
        "Bojan Hladnik",
        "Marjeta Hočevar",
        "Domen Hren",
        "Janja Jakončič",
        "Karin Jerman",
        "Vesna Kern",
        "Katarina Klajn",
        "Viktor Klampfer",
        "Marijana Klemenčič Glavica",
        "Nataša Koderman",
        "Samo Koler",
        "Žanna Korošec",
        "Andreja Kos",
        "Jasna Kos",
        "Tanja Kovač Flisar",
        "Snežna Kožuh Mravljak",
        "Robert Kralj",
        "Katarina Krapež",
        "Alenka Krejan",
        "Gregor Križ",
        "Samo Krušič",
        "Luka Kukovica",
        "Jesika Kustec",
        "Katja Kvas",
        "Katja Lah Majkić",
        "Veronika Lazarini",
        "Caroline Le Chatal",
        "Mojca Lebar",
        "Marko Levačić",
        "Urška Markun",
        "Tanja Mastnak",
        "Valentina Maver",
        "Mirko Mrčela",
        "Darinka Novak Jerman",
        "Jure Okršlar",
        "Mojca Osvald",
        "Barbara Ovsenik Dolinar",
        "Ana Pavlič",
        "Marino Pavletič",
        "Brigita Peklaj",
        "Gašper Pernek",
        "Maja Petričić Štritof",
        "Anja Pirc",
        "Jernej Pirnat",
        "Andreja Piškur Vodopivec",
        "Tjaša Poznanovič Omers",
        "Gregor Potokar",
        "Monika Rebernišek",
        "Urška Rihtaršič",
        "mag. Marko Savić",
        "Sabina Sovinc",
        "Michael Steber",
        "Nives Syed Mihelič",
        "Špela Ševerkar",
        "Breda Škedelj",
        "Andreja Šolar",
        "Viljenka Škorjanec Šnuderl",
        "Metka Škornik",
        "Mateja Špacapan",
        "Marko Štempihar",
        "Igor Kristian Štern",
        "Andrej Šuštaršič",
        "Špela Tola",
        "Tomaž Tomažin",
        "William Tomford",
        "Špela Tršek",
        "Barbara Vencelj",
        "Marjeta Vidmar",
        "Sonja Vindiš",
        "Daniela Vlačić",
        "Nika Zadravec",
        "Žužana Zajtl",
        "Sebastjan Zamuda",
        "Jurij Železnik",
        "Aleksandra Žerjav",
    ];

    const subjects = [
        "matematika (matematični razred)",
        "matematika",
        "slovenščina",
        "angleščina",
        "nemščina (nadaljevalna)",
        "nemščina (začetna)",
        "nemščina (matura)",
        "francoščina (nadaljevalna)",
        "francoščina (začetna)",
        "francoščina (matura)",
        "španščina (nadaljevalna)",
        "španščina (začetna)",
        "španščina (matura)",
        "zgodovina",
        "zgodovina (matura)",
        "geografija",
        "geografija (matura)",
        "športna vzgoja",
        "glasba",
        "likovna umetnost",
        "umetnostna zgodovina (matura)",
        "biologija (vaje)",
        "biologija (pouk)",
        "biologija (pouk) (matura)",
        "biologija (vaje) (matura)",
        "kemija (vaje)",
        "kemija (pouk)",
        "kemija (pouk) (matura)",
        "kemija (vaje) (matura)",
        "fizika (vaje)",
        "fizika (pouk)",
        "fizika (pouk) (matura)",
        "fizika (vaje) (matura)",
        "psihologija",
        "psihologija (matura)",
        "sociologija",
        "sociologija (matura)",
        "filozofija",
        "filozofija (matura)",
        "informatika (vaje)",
        "informatika (pouk)",
        "informatika (matura)",
        "ostalo",
    ];

    const types = [
        "Zapiski",
        "Prezentacije",
        "Testi",
        "Preverjanja",
    ];

    const years = [
        "2017/2018",
        "2018/2019",
        "2019/2020",
        "2020/2021",
        "2021/2022",
        "2022/2023",
        "2023/2024",
        "2024/2025",
    ];

    const allowed_gradings = [
        "1. šolska naloga (esej)",
        "2. šolska naloga (esej)",
        "3. šolska naloga (esej)",
        "4. šolska naloga (esej)",
        "1. šolska naloga (tvorba neumetnostnega besedila)",
        "2. šolska naloga (tvorba neumetnostnega besedila)",
        "3. šolska naloga (tvorba neumetnostnega besedila)",
        "4. šolska naloga (tvorba neumetnostnega besedila)",
        "1. test",
        "2. test",
        "3. test",
        "4. test",
        "5. test",
        "6. test",
        "1. ustno ocenjevanje",
        "2. ustno ocenjevanje",
        "3. ustno ocenjevanje",
        "Govorni nastop ali referat",
        "Drugo",
    ];

    const allowed_terms = [
        1,
        2,
        3,
    ];

    let file: Blob | undefined;
    let teacher: string | undefined;
    let subject: string | undefined;
    let class_name: string | undefined;
    let class_year: string | undefined;
    let description: string = "";
    let type: string | undefined;
    let open: boolean = false;
    let term: number | undefined;
    let grading: string | undefined;

    let editId: string | undefined;

    let teacher_filter = "";
    let subject_filter = "";
    let class_name_filter = "";
    let class_year_filter = "";
    let type_filter = [...types];
    let valueTypeFiles: FileList | null = null;

    let notes: Upload[] = [];
    let files: Upload[] = [];

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length < 1) {
            return;
        }
        file = files[0];
    }

    function filter() {
        let ns = JSON.parse(JSON.stringify(files));
        console.log(ns, files);
        console.log(subject_filter, teacher_filter, type_filter, class_name_filter, class_year_filter)
        if (!(teacher_filter === undefined || teacher_filter === "")) {
            let removed = 0;
            let l = ns.length;
            for (let i = 0; i < l; i++) if (ns[i - removed].teacher.toLowerCase() !== teacher_filter.toLowerCase()) {
                ns.splice(i - removed, 1);
                removed++;
            }
        }
        if (!(subject_filter === undefined || subject_filter === "")) {
            let removed = 0;
            let l = ns.length;
            for (let i = 0; i < l; i++) if (ns[i - removed].subject.toLowerCase() !== subject_filter.toLowerCase()) {
                ns.splice(i - removed, 1);
                removed++;
            }
        }
        let removed = 0;
        let l = ns.length;
        for (let i = 0; i < l; i++) if (!type_filter.includes(ns[i - removed].type)) {
            ns.splice(i - removed, 1);
            removed++;
        }
        if (!(class_name_filter === undefined || class_name_filter === "")) {
            let removed = 0;
            let l = ns.length;
            for (let i = 0; i < l; i++) {
                if (class_name_filter.includes("letnik")) {
                    if (!ns[i - removed].class_name.toLowerCase().includes(class_name_filter[0])) {
                        ns.splice(i - removed, 1);
                        removed++;
                    }
                } else {
                    if (ns[i - removed].class_name.toLowerCase() !== class_name_filter.toLowerCase()) {
                        ns.splice(i - removed, 1);
                        removed++;
                    }
                }
            }
        }
        if (!(class_year_filter === undefined || class_year_filter === "")) {
            let removed = 0;
            let l = ns.length;
            for (let i = 0; i < l; i++) if (ns[i - removed].class_year.toLowerCase() !== class_year_filter.toLowerCase()) {
                ns.splice(i - removed, 1);
                removed++;
            }
        }
        notes = [...ns];
    }

    let view_contents = "";
    let md_view_open = false;

    function clearVariables() {
        editId = undefined;
        file = undefined;
        subject = undefined;
        teacher = undefined;
        class_name = undefined;
        class_year = undefined;
        description = "";
        type = undefined;
        term = undefined;
        grading = undefined;
    }

    async function uploadFile() {
        if (file === undefined || subject === undefined || teacher === undefined || class_name === undefined || class_year === undefined || type === undefined || term === undefined || grading === undefined) {
            return;
        }
        let fd = new FormData();
        fd.append('file', file);
        fd.append("subject", subject);
        fd.append("teacher", teacher);
        fd.append("class_name", class_name);
        fd.append("class_year", class_year);
        fd.append("description", description);
        fd.append("type", type);
        fd.append("term", term.toString());
        fd.append("grading", grading);
        let r = await makeRequest(`/uploads`, "POST", fd, false, false, false, true);
        if (r.status_code === 200) {
            clearVariables();
        }
        await getFiles();
    }

    async function editFileDialog(file: Upload) {
        clearVariables();
        editId = file.id;
        subject = file.subject;
        teacher = file.teacher;
        class_name = file.class_name;
        class_year = file.class_year;
        description = file.description;
        type = file.type;
        term = file.term;
        grading = file.grading;
        open = true;
    }

    async function editFile() {
        if (editId === undefined || subject === undefined || teacher === undefined || class_name === undefined || class_year === undefined || type === undefined || term === undefined || grading === undefined) {
            return;
        }
        let fd = new FormData();
        fd.append("subject", subject);
        fd.append("teacher", teacher);
        fd.append("class_name", class_name);
        fd.append("class_year", class_year);
        fd.append("description", description);
        fd.append("type", type);
        fd.append("term", term.toString());
        fd.append("grading", grading);
        let r = await makeRequest(`/upload/${editId}`, "PATCH", fd, false, false, false, true);
        if (r.status_code === 200) {
            clearVariables();
        }
        await getFiles();
    }

    async function deleteFile(id: string) {
        await makeRequest(`/upload/${id}`, "DELETE");
        await getFiles();
    }

    async function getFiles() {
        files = await makeRequest(`/uploads`)
        filter();
    }

    async function downloadFile(file: Upload) {
        window.open(`${baseurl}/upload/${file.id}/${file.filename}`);
    }

    async function viewFile(id: string) {
        view_contents = await (await makeRequest(`/upload/${id}`, "GET", null, false, true)).text()
        md_view_open = true;
    }

    onMount(async () => {
        await getFiles()
    })

</script>

<Dialog
        bind:open
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
        style="overflow: visible;"
>
    <Title id="simple-title">
        {#if editId === undefined}Nov zapisek{:else}Urejanje zapiska{/if}
    </Title>
    <Content id="simple-content" style="overflow: visible;">
        {#if editId === undefined}
            <div class="hide-file-ui">
                <Textfield helperLine$style="width: 100%;" style="width: 100%;" bind:files={valueTypeFiles}
                           on:change={handleFileSelect} label="Datoteka" type="file"/>
            </div>

            <br>
        {/if}

        <Textfield textarea style="width: 100%;" input$maxlength={200} bind:value={description}
                   label="Neobvezen (a priporočljiv) opis datoteke. Podpira Markdown.">
            <CharacterCounter slot="internalCounter">0 / 200</CharacterCounter>
        </Textfield>

        {#if description !== ""}
            <h3>Predogled</h3>
            {@html insane(marked(description))}
        {/if}

        <Autocomplete options={classes} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_name}
                      label="Izberite razred"/>
        <Autocomplete combobox options={subjects} textfield$style="width: 100%;" style="width: 100%;"
                      bind:value={subject} label="Izberite ali vpišite ime predmeta"/>
        <Autocomplete combobox options={teachers} textfield$style="width: 100%;" style="width: 100%;"
                      bind:value={teacher} label="Izberite ali vpišite učitelja, ki vas je učil ta predmet"/>
        <Autocomplete options={years} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_year}
                      label="Izberite šolsko leto"/>
        <Autocomplete options={allowed_gradings} textfield$style="width: 100%;" style="width: 100%;"
                      bind:value={grading} label="Izberite vrsto ocenjevanja"/>
        <Autocomplete options={allowed_terms} textfield$style="width: 100%;" style="width: 100%;" bind:value={term}
                      label="Izberite rok (1. ali 2. rok, 3. rok je izredni rok)"/>

        <SegmentedButton segments={types} let:segment singleSelect bind:selected={type}>
            <Segment {segment}><Label>{segment}</Label></Segment>
        </SegmentedButton>

        {#if type === "Zapiski"}
            <br>
            Zapiski podpirajo tudi predogled v primeru uporabe Markdown formata.
        {/if}

        <p/>
        Z nalaganjem se strinjate s <a href="/tos.html">Pogoji uporabe</a>.
    </Content>
    <Actions>
        <Button on:click={async () => {
            if (editId === undefined) await uploadFile();
            else await editFile();
        }} variant="raised">
            <Icon class="material-icons">upload</Icon>
            <Label>Naloži</Label>
        </Button>
    </Actions>
</Dialog>

<Dialog
        bind:open={md_view_open}
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <Content id="simple-content">
        {@html insane(marked(view_contents))}
    </Content>
    <Actions>
        <Button variant="raised">
            <Label>OK</Label>
        </Button>
    </Actions>
</Dialog>

<Button on:click={() => {
    if (editId !== undefined) clearVariables();
    open = true
}} variant="raised">
    <Icon class="material-icons">upload</Icon>
    <Label>Naloži datoteko</Label>
</Button>

<h3>Filtri</h3>
<Autocomplete options={extended_classes} textfield$style="width: 100%;" style="width: 100%;"
              bind:value={class_name_filter} label="Izberite razred ali letnik"/>
<Autocomplete combobox options={subjects} textfield$style="width: 100%;" style="width: 100%;"
              bind:value={subject_filter} label="Izberite ali vpišite ime predmeta"/>
<Autocomplete combobox options={teachers} textfield$style="width: 100%;" style="width: 100%;"
              bind:value={teacher_filter} label="Izberite ali vpišite učitelja, ki vas je učil ta predmet"/>
<Autocomplete options={years} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_year_filter}
              label="Izberite šolsko leto"/>
<SegmentedButton segments={types} let:segment bind:selected={type_filter}>
    <Segment {segment}><Label>{segment}</Label></Segment>
</SegmentedButton>
<p/>
<Button on:click={filter}>
    <Icon class="material-icons">sort</Icon>
    <Label>Filtrirajte</Label>
</Button>

<h3>Datoteke</h3>
{#if notes.length === 0 || notes.length > 4}Najdenih
{:else if notes.length === 1}Najden
{:else if notes.length === 2}Najdena
{:else}Najdeni
{/if} <b>{notes.length}</b>
{#if notes.length === 0 || notes.length > 4}zadetkov
{:else if notes.length === 1}zadetek
{:else if notes.length === 2}zadetka
{:else}zadetki
{/if} za določene filtre.
<LayoutGrid>
    {#each notes as note}
        <Cell span={4}>
            <Card variant="outlined" padded>
                <span class="sameline" style="text-wrap: auto; width: 100%;">
                    <span class="inline uppercase-first-letter" style="font-size: 24px; width: 95%; text-wrap: auto;">
                        {note.subject}
                    </span>
                    <div class="big-break"/>
                    <span class="inline" style="width: 100%; text-wrap: auto;">
                        {#if note.type === "Testi"}
                            <b>Test</b>
                        {:else if note.type === "Preverjanja"}
                            <b>Preverjanje</b>
                        {:else if note.type === "Zapiski"}
                            <b>Zapiski</b>
                        {:else if note.type === "Prezentacije"}
                            <b>Prezentacija</b>
                        {:else}
                            <b>Drugo</b>
                        {/if}
                        – {note.grading} ({note.term}. rok)
                    </span>
                    <div class="big-break"/>
                    <hr>
                    <span class="inline" style="top: 5px; right: 5px; position: absolute;">
                        {#if note.type === "Testi"}
                            <Icon class="material-icons inline" style="float: right; font-size: 35px;">grading</Icon>
                        {:else if note.type === "Preverjanja"}
                            <Icon class="material-icons inline" style="float: right; font-size: 35px;">fact_check</Icon>
                        {:else if note.type === "Zapiski"}
                            <Icon class="material-icons inline"
                                  style="float: right; font-size: 35px;">description</Icon>
                        {:else if note.type === "Prezentacije"}
                            <Icon class="material-icons inline" style="float: right; font-size: 35px;">co_present</Icon>
                        {/if}
                    </span>
                </span>
                <span class="sameline">

                </span>
                <br>
                {note.filename}
                <span class="sameline">Profesor: <b>{note.teacher}</b></span>
                <span class="sameline">Razred: <b>{note.class_name}</b></span>
                <span class="sameline">Šolsko leto: <b>{note.class_year}</b></span>
                Opis:
                {@html insane(marked(note.description))}
                {#if note.description === ""}<p/>{/if}
                {#if note.filename.endsWith(".md")}
                    <Button on:click={async () => await viewFile(note.id)} variant="raised">
                        <Icon class="material-icons">preview</Icon>
                        <Label>Oglej si datoteko</Label>
                    </Button>
                    <div style="height: 5px;"/>
                {/if}
                <Button on:click={async () => await downloadFile(note)} variant="raised">
                    <Icon class="material-icons">download</Icon>
                    <Label>Prenesi datoteko</Label>
                </Button>
                <div style="height: 5px;"/>
                {#if note.uploaded_by_user || isModuleAdministrator}
                    <div class="break"/>
                    <Button on:click={async () => await editFileDialog(note)} variant="outlined">
                        <Icon class="material-icons">edit</Icon>
                        <Label>Uredi metapodatke datoteke</Label>
                    </Button>
                    <div style="height: 5px;"/>
                {/if}
                {#if note.uploaded_by_user || isModuleAdministrator}
                    <div class="break"/>
                    <Button on:click={async () => await deleteFile(note.id)} variant="outlined">
                        <Icon class="material-icons">delete</Icon>
                        <Label>Izbriši datoteko</Label>
                    </Button>
                    <div style="height: 5px;"/>
                {/if}
            </Card>
        </Cell>
    {/each}
</LayoutGrid>
