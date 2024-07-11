<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {gradeColors, makeRequest} from "./constants";
    import Grade from "./Widgets/Grade.svelte";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {navigate} from "svelte-routing";
    import Select, {Option} from "@smui/select";
    import type {GradeSubject} from "./ts/grades";
    import Dialog, {Title, Content, Actions} from "@smui/dialog";
    import Button, {Label} from "@smui/button";
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import Textfield from "@smui/textfield";
    import CharacterCounter from "@smui/textfield/character-counter";

    let grades: GradeSubject[] = [];
    let total_average = 0.0;
    let stalne = true;
    let selectedYear = "2023/2024";

    let dialogOpen = false;
    let selectedGrade: string = "5";
    let selectedSubject: GradeSubject | null = null;
    let newGrade = true;
    let gradeImproved = false;
    let gradeType = "Pisna ocena";
    let description = "";
    let gradeEditId = "";

    let izpitniRoki = localStorage.getItem("izpitniRoki") === "true";

    async function getGrades() {
        let r: GradeSubject[] = await makeRequest(`/grades?year=${selectedYear.split("/")[0]}`);
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

    getGrades();
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
                await makeRequest("/grades", "POST", fd);
                await getGrades();
            }}>
                <Label>Vpiši</Label>
            </Button>
        {/if}
    </Actions>
</Dialog>

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
            <Cell>Ocene</Cell>
            <!--<Cell>2. ocenjevalno obdobje</Cell>-->
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
                                {subject.final}
                            </span>
                            <span class="zacasna">({subject.average.toFixed(2)})</span>
                        {/if}
                    </div>
                </Cell>
                <Cell class="sameline hover-td" on:click={() => {
                    selectedSubject = subject;
                    description = "";
                    newGrade = true;
                    dialogOpen = true;
                }}>
                    {#each subject.grades as grade}
                        <div on:click={(e) => {
                            //e.preventDefault();
                            e.stopPropagation();
                            gradeEditId = grade.GradeID;
                            description = grade.description_decrypted;
                            gradeImproved = grade.GradeImproved;
                            gradeType = grade.GradeType === 0 ? "Pisna ocena" : grade.GradeType === 1 ? "Ustna ocena" : "Druga ocena";
                            selectedSubject = subject;
                            selectedGrade = grade.grade_num.toString();
                            newGrade = false;
                            dialogOpen = true;
                        }} on:keydown={() => {}} class="inline" role="toolbar" tabindex="0">
                            <Grade grade={grade} />
                            <div style="width: 17px;" />
                        </div>
                    {/each}
                    <!--<div class="meta inline grades-center">
                        {#if subject.grades === ""}
                            {stalne ? subject[0]["perm_average"].toFixed(2) : subject[0]["average"].toFixed(2)}
                        {:else}
                            <span style="color: {gradeColors[subject[0].final]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                {subject[0].final}
                            </span>
                            <span class="zacasna">({stalne ? subject[0]["perm_average"].toFixed(2) : subject[0]["average"].toFixed(2)})</span>
                        {/if}
                    </div>-->
                </Cell>
            </Row>
        {/each}
    </Body>
</DataTable>

<p/>

Ne vidite predmeta, ki je na urniku? Je mogoče kakšna ocena preveč ali premalo? To je težava z BežiAppom. Kontaktirajte razvijalca na <a href="mailto:mitja.severkar@gimb.org">mitja.severkar@gimb.org</a>, da pogleda, kaj je narobe.

<p/>

<Select key={(fruit) => `${fruit ? fruit.value : ''}`} bind:value={selectedYear} label="Šolsko leto">
    {#each [/*{value: "2024/2025", text: "2024/2025"}, */{value: "2023/2024", text: "2023/2024"}] as fruit}
        <Option value={fruit.value} on:click={async () => {setTimeout(getGrades, 50)}}>{fruit.text}</Option>
    {/each}
</Select>
