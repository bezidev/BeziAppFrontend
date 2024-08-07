<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {gradeColors, makeRequest} from "./constants";
    import Grade from "./Widgets/Grade.svelte";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import Select, {Option} from "@smui/select";
    import type {GradeSubject} from "./ts/grades";
    import Dialog, {Title, Content, Actions} from "@smui/dialog";
    import Button, {Label} from "@smui/button";
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import Textfield from "@smui/textfield";
    import CharacterCounter from "@smui/textfield/character-counter";
    import type {GenericResponse} from "./ts/generic-response";
    import {gradeEditStore} from "./stores";
    import type {Grade as GradeType} from "./ts/grades";
    import isMobile from "is-mobile";

    const mobile = isMobile();

    const ALLOWED_YEARS = ["2024/2025", "2023/2024", "2022/2023", "2021/2022", "2020/2021"];

    let grades: GradeSubject[] = [];
    let total_average = 0.0;
    let stalne = true;
    let selectedYear = "2023/2024";
    let consent = false;

    let dialogOpen = false;
    let selectedGrade: string = "5";
    let selectedSubject: GradeSubject | null = null;
    let newGrade = true;
    let gradeImproved = false;
    let gradeType = "Pisna ocena";
    let description = "";
    let gradeEditId = "";
    let selectedTerm = 1;

    let izpitniRoki = localStorage.getItem("izpitniRoki") === "true";

    async function getGrades() {
        let r: GradeSubject[] = await makeRequest(`/grades?year=${selectedYear}`);
        grades = r.sort((a,b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));

        let avg = 0;
        let total = 0;
        for (let i = 0; i < grades.length; i++) {
            if (grades[i].final !== null) {
                avg += (<number>grades[i].final?.grade_num);
                total++;
                continue;
            }
            avg += grades[i].average;
            if (grades[i].average !== 0.0) {
                total++;
            }
        }
        if (total === 0) {
            total_average = 0.0;
            return;
        }
        total_average = avg / total;
    }

    async function getApeiroederConsent() {
        let r: GenericResponse = await makeRequest(`/apeiroeder/consent`);
        consent = r.data === true;
    }

    async function setApeiroederConsent() {
        let fd = new FormData();
        fd.append("apeiroeder_consent", consent.toString());
        await makeRequest(`/apeiroeder/consent`, "POST", fd);
        await getApeiroederConsent();
    }

    gradeEditStore.subscribe((grade: GradeType | undefined) => {
        if (grade === undefined) {
            selectedSubject = null;
            description = "";
            newGrade = false;
            dialogOpen = false;
            gradeEditId = "";
            return;
        }
        gradeEditId = grade.GradeID;
        description = grade.description_decrypted;
        gradeImproved = grade.GradeImproved;
        gradeType = grade.GradeType === 0 ? "Pisna ocena" : grade.GradeType === 1 ? "Ustna ocena" : "Druga ocena";
        selectedSubject = {ID: grade.SubjectID, Name: grade.SubjectName};
        selectedGrade = grade.grade_num.toString();
        newGrade = false;
        dialogOpen = true;
    });

    getGrades();
    getApeiroederConsent();
</script>

<Dialog
        bind:open={dialogOpen}
        surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
    <Title>{#if newGrade}Ročno vpisujete novo oceno za predmet {selectedSubject === null ? "" : selectedSubject.Name}{:else}Ročno popravljate oceno pri predmetu {selectedSubject === null ? "" : selectedSubject.Name}{/if}</Title>
    <Content>
        <SegmentedButton segments={["1", "2", "3", "4", "5"]} let:segment singleSelect bind:selected={selectedGrade}>
            <!-- Note: the `segment` property is required! -->
            <Segment {segment}>
                <Label>{segment}</Label>
            </Segment>
        </SegmentedButton>
        <p/>
        <FormField>
            <Switch bind:checked={gradeImproved} />
            <span slot="label">{#if gradeImproved}Ocena je bila izboljšana{:else}Ocena (še) ni bila izboljšana{/if}</span>
        </FormField>
        <p/>
        <SegmentedButton segments={["Pisna ocena", "Ustna ocena", "Druga ocena"]} let:segment singleSelect bind:selected={gradeType}>
            <Segment {segment}>
                <Label>{segment}</Label>
            </Segment>
        </SegmentedButton>
        <p/>
        <Textfield textarea input$maxlength={500} bind:value={description} label="Neobvezen opis ocene" style="width: 100%;">
            <CharacterCounter slot="internalCounter">0 / 500</CharacterCounter>
        </Textfield>
        <p/>
        Ocena se ne vpiše v eAsistent, tako da ne morete kar pričarati ocen. <br>
        Vse ocene ostanejo šifrirane znotraj BežiApp sistema. <br>
        Kadarkoli lahko zahtevate izbris ocen. Več o tem v <a href="https://beziapp.si/tos.html">pogojih uporabe</a>.
    </Content>
    <Actions>
        <Button>
            <Label>Prekliči</Label>
        </Button>
        {#if !newGrade}
            <Button on:click={async () => {
                if (gradeEditId === null || gradeEditId === "") return;
                await makeRequest(`/grade/${gradeEditId}`, "DELETE");
                await getGrades();
            }}>
                <Label>Izbriši</Label>
            </Button>
            <Button on:click={async () => {
                if (selectedSubject === null) return;
                if (gradeEditId === null || gradeEditId === "") return;
                let fd = new FormData();
                fd.append("grade", selectedGrade);
                fd.append("grade_improved", gradeImproved.toString());
                fd.append("grade_type", (gradeType === "Pisna ocena" ? 0 : gradeType === "Ustna ocena" ? 1 : 2).toString());
                fd.append("description", description);
                fd.append("subject_id", selectedSubject.ID);
                fd.append("subject_name", selectedSubject.Name);
                await makeRequest(`/grade/${gradeEditId}`, "PATCH", fd);
                await getGrades();
            }}>
                <Label>Popravi</Label>
            </Button>
        {/if}
        {#if newGrade}
            <Button on:click={async () => {
                if (selectedSubject === null) return;
                let fd = new FormData();
                fd.append("grade", selectedGrade);
                fd.append("grade_improved", gradeImproved.toString());
                fd.append("grade_type", (gradeType === "Pisna ocena" ? 0 : gradeType === "Ustna ocena" ? 1 : 2).toString());
                fd.append("description", description);
                fd.append("subject_id", selectedSubject.ID);
                fd.append("subject_name", selectedSubject.Name);
                fd.append("school_year", selectedYear);
                fd.append("term", selectedTerm.toString());
                await makeRequest("/grades", "POST", fd);
                await getGrades();
            }}>
                <Label>Vpiši</Label>
            </Button>
        {/if}
    </Actions>
</Dialog>

{#if !consent}
    Ocene se lahko vpisujejo samo ročno, ker nimate vključenega modula Apeiroeder. Modul vključite malo nižje na tej strani.
{/if}

<!--<FormField>
    <Switch bind:checked={stalne} />
    <span slot="label">Stalne ocene</span>
</FormField>-->
<p/>
Učni uspeh: <span style="color: rgba(255, 255, 255, 0.5); display:inline-block;">{total_average.toFixed(2)}</span>
<p/>
<DataTable table$aria-label="People list" style="width: 100%;" id="grades-table">
    <Head>
        <Row>
            <Cell>Predmet</Cell>
            <Cell>1. ocenjevalno obdobje</Cell>
            <Cell>2. ocenjevalno obdobje</Cell>
        </Row>
    </Head>
    <Body>
        {#each grades as subject}
            <Row>
                <Cell class="sameline">
                    <div class="inline">{subject.Name}</div>
                    <div class="meta inline grades-center">
                        {#if subject.final === null}
                            {subject.average.toFixed(2)}
                        {:else}
                            <span style="color: {gradeColors[subject.final.grade_num]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                {subject.final.grade_num}
                            </span>
                            <span class="zacasna">({subject.average.toFixed(2)})</span>
                        {/if}
                    </div>
                </Cell>
                {#each {length: 2} as _, i}
                    <Cell class="sameline hover-td" on:click={() => {
                        selectedSubject = subject;
                        selectedTerm = i + 1;
                        description = "";
                        newGrade = true;
                        dialogOpen = true;
                        gradeEditId = "";
                    }}>
                        {#each subject.terms[i].grades as grade}
                            <div on:click={(e) => {
                                e.stopPropagation();
                                if (!mobile) {
                                    //e.preventDefault();
                                    gradeEditId = grade.GradeID;
                                    description = grade.description_decrypted;
                                    gradeImproved = grade.GradeImproved;
                                    gradeType = grade.GradeType === 0 ? "Pisna ocena" : grade.GradeType === 1 ? "Ustna ocena" : "Druga ocena";
                                    selectedSubject = subject;
                                    selectedGrade = grade.grade_num.toString();
                                    newGrade = false;
                                    dialogOpen = true;
                                }
                            }} on:keydown={() => {}} class="inline" role="toolbar" tabindex="0">
                                <Grade grade={grade} />
                                <div style="width: 17px;" />
                            </div>
                        {/each}
                        <div class="meta inline grades-center">{subject.terms[i].average.toFixed(2)}</div>
                    </Cell>
                {/each}
            </Row>
        {/each}
    </Body>
</DataTable>

<p/>

<h4>Apeiroeder – modul za avtomatizirano vpisovanje ocen</h4>
eAsistent v zastonjski varianti ponuja bolj skope informacije glede ocen. BežiApp lahko pridobi nekoliko več ocen, samo ni zagotovil, da bo karkoli pravilno.

<br>

BežiApp bo, če vklopite modul Apeiroeder, vsakih 30 minut, ko odprete urnik, poskušal pridobiti nove ocene iz eAsistenta, jih shranil v podatkovno bazo BežiApp sistema in hkrati šifriral, da se obdržijo tudi, če izginejo iz eAsistenta.

<br>

<b>Če nimate vključenega modula, se ocene ne prenašajo iz eAsistenta, ne glede na to ali ste plačljiv uporabnik ali zastonjski uporabnik, posledično lahko ta razpredelnica ocen izgleda bolj prazna.</b>

<p/>

<FormField>
    <Switch bind:checked={consent} on:click={() => {
            setTimeout(() => {
                setApeiroederConsent();
            }, 50);
        }}/>

    <span slot="label">{#if consent}Apeiroeder je vključen in pridobiva ocene iz eAsistenta.{:else}Apeiroeder je izključen. Ocene se <b>NE</b> pridobivajo iz eAsistenta.{/if}</span>
</FormField>

{#if consent}
    <p/>
    Če se nove ocene ne pokažejo po eni uri, kontaktirajte razvijalca
{/if}

<p/>

<h4>Prikaz ocen za pretekla šolska leta</h4>
<Select bind:value={selectedYear} label="Šolsko leto">
    {#each ALLOWED_YEARS as year}
        <Option value={year} on:click={async () => {setTimeout(getGrades, 50)}}>{year}</Option>
    {/each}
</Select>
