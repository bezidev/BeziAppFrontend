<script lang="ts">
    import Autocomplete from "@smui-extra/autocomplete";
    import Button, {Icon, Label} from "@smui/button";
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import SegmentedButton, { Segment } from '@smui/segmented-button';
    import {makeRequest, saveBlob} from "./constants";
    import {onMount} from "svelte";
    import Textfield from "@smui/textfield";
    import insane from "insane";
    import {marked} from "marked";
    import CharacterCounter from "@smui/textfield/character-counter";

    const classes = [
        "1.a",
        "1.b",
        "1.c",
        "1.d",
        "1.e",
        "1.f",
        "1.g",
        "1.š",
        "2.a",
        "2.b",
        "2.c",
        "2.d",
        "2.e",
        "2.f",
        "2.g",
        "2.š",
        "3.a",
        "3.b",
        "3.c",
        "3.d",
        "3.e",
        "3.f",
        "3.g",
        "3.š",
        "3.mm",
        "4.a",
        "4.b",
        "4.c",
        "4.d",
        "4.e",
        "4.f",
        "4.g",
        "4.š",
        "4.mm",
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
        "Julija Božič",
        "Savina Brcar",
        "Marjana Brenčič Jenko",
        "Alenka Budihna",
        "Saša Cecowski",
        "Dragica Cipot",
        "Peter Cizl",
        "Irena Česnik",
        "Vilko Domajnko",
        "Ciril Dominko",
        "Andreja Dover",
        "Kristina Drnovšek Juteršek",
        "Mojca Ekart Dvorščak",
        "Nina Engelman",
        "Ajda Erjavec",
        "Špela Frantar",
        "Tanja Gabriel",
        "Karmen Goršak",
        "Marja Gričar",
        "Polona Gros Remec",
        "Ana Grozdanić Pavlin",
        "Manica Habjanič Gaberšek",
        "Hilda Hašaj Tegelj",
        "Bojan Hladnik",
        "Marjeta Hočevar",
        "Domen Hren",
        "Janja Jakončič",
        "Karin Jerman",
        "Nataša Junež",
        "Vesna Kern",
        "Katarina Klajn",
        "Viktor Klampfer",
        "Marijana Klemenčič Glavica",
        "Brane Koderman",
        "Nataša Koderman",
        "Samo Koler",
        "Jasna Kos",
        "Tanja Kovač Flisar",
        "Janko Kovačič",
        "Snežna Kožuh Mravljak",
        "Katarina Krapež",
        "Karmen Krašna Otrin",
        "Alenka Krejan",
        "Gregor Križ",
        "Samo Krušič",
        "Katja Kvas",
        "Katja Lah Majkić",
        "Veronika Lazarini",
        "Caroline Le Chatal",
        "Mojca Lebar",
        "Urška Markun",
        "Tanja Mastnak",
        "Valentina Maver",
        "Mirko Mrčela",
        "Gabi Novak",
        "Natalija Novak",
        "Darinka Novak Jerman",
        "Jure Okršlar",
        "Mojca Osvald",
        "Barbara Ovsenik Dolinar",
        "Ana Pavlič",
        "Marino Pavletič",
        "Gašper Pernek",
        "Maja Petričić Štritof",
        "Anja Pirc",
        "Jernej Pirnat",
        "Andreja Piškur Vodopivec",
        "Tjaša Poznanovič Omers",
        "Gregor Potokar",
        "Monika Rebernišek",
        "Urška Rihtaršič",
        "Sabina Sovinc",
        "Nives Syed Mihelič",
        "Špela Ševerkar",
        "Breda Škedelj",
        "Viljenka Škorjanec Šnuderl",
        "Metka Škornik",
        "Mateja Špacapan",
        "Marko Štempihar",
        "Andrej Šuštaršič",
        "Špela Tola",
        "Tomaž Tomažin",
        "William Tomford",
        "Barbara Vencelj",
        "Marjeta Vidmar",
        "Monika Vidmar",
        "Sonja Vindiš",
        "Daniela Vlačić",
        "Nika Zadravec",
        "Žužana Zajtl",
        "Kitty Zalokar Hafner",
        "Sebastjan Zamuda",
        "Angelika Zinner",
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
        "francoščina (nadaljevalna)",
        "francoščina (začetna)",
        "španščina (nadaljevalna)",
        "španščina (začetna)",
        "zgodovina",
        "geografija",
        "športna vzgoja",
        "glasba",
        "likovna umetnost",
        "umetnostna zgodovina (matura)",
        "biologija (vaje)",
        "biologija (pouk)",
        "kemija (vaje)",
        "kemija (pouk)",
        "fizika (vaje)",
        "fizika (pouk)",
        "psihologija",
        "sociologija",
        "filozofija",
        "informatika (vaje)",
        "informatika (pouk)",
        "ostalo",
    ];

    const types = [
        "Zapiski",
        "Prezentacije",
        "Testi",
    ];

    const years = [
        "2017/2018",
        "2018/2019",
        "2019/2020",
        "2020/2021",
        "2021/2022",
        "2022/2023",
        "2023/2024",
    ];

    let file;
    let teacher;
    let subject;
    let class_name;
    let class_year;
    let description = "";
    let type;
    let open = false;

    let teacher_filter = "";
    let subject_filter = "";
    let class_name_filter = "";
    let class_year_filter = "";
    let type_filter = [...types];
    let valueTypeFiles: FileList | null = null;

    let notes = [];
    let files = [];

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
            for (let i = 0; i < l; i++) if (ns[i-removed].teacher.toLowerCase() !== teacher_filter.toLowerCase()) {
                ns.splice(i - removed, 1);
                removed++;
            }
        }
        if (!(subject_filter === undefined || subject_filter === "")) {
            let removed = 0;
            let l = ns.length;
            for (let i = 0; i < l; i++) if (ns[i-removed].subject.toLowerCase() !== subject_filter.toLowerCase()) {
                ns.splice(i - removed, 1);
                removed++;
            }
        }
        let removed = 0;
        let l = ns.length;
        for (let i = 0; i < l; i++) if (!type_filter.includes(ns[i-removed].type)) {
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
            for (let i = 0; i < l; i++) if (ns[i-removed].class_year.toLowerCase() !== class_year_filter.toLowerCase()) {
                ns.splice(i - removed, 1);
                removed++;
            }
        }
        notes = [...ns];
    }

    let view_contents = "";
    let md_view_open = false;

    async function uploadFile() {
        let fd = new FormData();
        fd.append('file', file);
        fd.append("subject", subject);
        fd.append("teacher", teacher);
        fd.append("class_name", class_name);
        fd.append("class_year", class_year);
        fd.append("description", description);
        fd.append("type", type);
        await makeRequest(`/notes/upload`, "POST", fd)
        await getFiles();
    }

    async function deleteFile(id: string) {
        let fd = new FormData();
        fd.append('id', id);
        await makeRequest(`/notes`, "DELETE", fd);
        await getFiles();
    }

    async function getFiles() {
        files = await makeRequest(`/notes`)
        filter();
    }

    async function downloadFile(id: string) {
        await saveBlob(await makeRequest(`/notes/get?id=${id}`, "GET", null, false, true))
    }

    async function viewFile(id: string) {
        view_contents = await (await makeRequest(`/notes/get?id=${id}`, "GET", null, false, true)).text()
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
>
    <Title id="simple-title">Nov zapisek</Title>
    <Content id="simple-content">
        <div class="hide-file-ui">
            <!--
              Note: the change and input events fire
              before the `files` prop is updated.
            -->
            <Textfield helperLine$style="width: 100%;" style="width: 100%;" bind:files={valueTypeFiles} on:change={handleFileSelect} label="Datoteka" type="file" />
        </div>

        <br>

        <Textfield textarea style="width: 100%;" input$maxlength={200} bind:value={description} label="Neobvezen (a priporočljiv) opis datoteke. Podpira Markdown.">
            <CharacterCounter slot="internalCounter">0 / 200</CharacterCounter>
        </Textfield>

        {#if description !== ""}
            <h3>Predogled</h3>
            {@html insane(marked(description))}
        {/if}

        <Autocomplete options={classes} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_name} label="Izberite razred" />
        <Autocomplete combobox options={subjects} textfield$style="width: 100%;" style="width: 100%;" bind:value={subject} label="Izberite ali vpišite ime predmeta" />
        <Autocomplete combobox options={teachers} textfield$style="width: 100%;" style="width: 100%;" bind:value={teacher} label="Izberite ali vpišite učitelja, ki vas je učil ta predmet" />
        <Autocomplete options={years} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_year} label="Izberite šolsko leto" />

        <SegmentedButton segments={types} let:segment singleSelect bind:selected={type}><Segment {segment}><Label>{segment}</Label></Segment></SegmentedButton>

        {#if type === "Zapiski"}
            <br>
            Zapiski podpirajo tudi predogled, ob uporabi Markdown formata.
        {/if}

        <br>
        Z nalaganjem se strinjate s <a href="/tos.html">Pogoji uporabe</a>.
    </Content>
    <Actions>
        <Button on:click={async () => await uploadFile()} variant="raised">
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
        <Button on:click={async () => await uploadFile()} variant="raised">
            <Label>OK</Label>
        </Button>
    </Actions>
</Dialog>

<Button on:click={() => (open = true)}>
    <Icon class="material-icons">upload</Icon>
    <Label>Naloži datoteko</Label>
</Button>

<h3>Filtri</h3>
<Autocomplete options={extended_classes} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_name_filter} label="Izberite razred ali letnik" />
<Autocomplete combobox options={subjects} textfield$style="width: 100%;" style="width: 100%;" bind:value={subject_filter} label="Izberite ali vpišite ime predmeta" />
<Autocomplete combobox options={teachers} textfield$style="width: 100%;" style="width: 100%;" bind:value={teacher_filter} label="Izberite ali vpišite učitelja, ki vas je učil ta predmet" />
<Autocomplete options={years} textfield$style="width: 100%;" style="width: 100%;" bind:value={class_year_filter} label="Izberite šolsko leto" />
<SegmentedButton segments={types} let:segment bind:selected={type_filter}><Segment {segment}><Label>{segment}</Label></Segment></SegmentedButton>
<p/>
<Button on:click={filter}>
    <Icon class="material-icons">sort</Icon>
    <Label>Filtrirajte</Label>
</Button>

<h3>Datoteke</h3>
{#if notes.length === 0 || notes.length > 4}Najdenih{:else if notes.length === 1}Najden{:else if notes.length === 2}Najdena{:else}Najdeni{/if} <b>{notes.length}</b> {#if notes.length === 0 || notes.length > 4}zadetkov{:else if notes.length === 1}zadetek{:else if notes.length === 2}zadetka{:else}zadetki{/if} za določene filtre.

<LayoutGrid>
    {#each notes as note}
        <Cell>
            <div class="demo-cell">
                <div style="margin: 0 10px 10px">
                    <h3>{note.filename}</h3>
                    <div class="break" />
                    Profesor: <b>{note.teacher}</b>
                    <div class="break" />
                    Predmet: <b>{note.subject}</b>
                    <div class="break" />
                    Razred: <b>{note.class_name}</b>
                    <div class="break" />
                    Šolsko leto: <b>{note.class_year}</b>
                    <div class="break" />
                    Tip: <b>{note.type}</b>
                    <div class="break" />
                    Opis:
                    <div class="break" />
                    {@html insane(marked(note.description))}
                    <div class="big-break" />
                    {#if note.filename.endsWith(".md")}
                        <Button on:click={async () => await viewFile(note.id)} variant="raised">
                            <Icon class="material-icons">preview</Icon>
                            <Label>Oglej si datoteko</Label>
                        </Button>
                        <div class="break" />
                    {/if}
                    <Button on:click={async () => await downloadFile(note.id)} variant="raised">
                        <Icon class="material-icons">download</Icon>
                        <Label>Prenesi datoteko</Label>
                    </Button>
                    {#if note.uploaded_by_me}
                        <div class="break" />
                        <Button on:click={async () => await deleteFile(note.id)} variant="raised">
                            <Icon class="material-icons">delete</Icon>
                            <Label>Izbriši datoteko</Label>
                        </Button>
                    {/if}
                </div>
            </div>
        </Cell>
    {/each}
</LayoutGrid>
