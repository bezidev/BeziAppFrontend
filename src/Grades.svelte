<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {gradeColors, makeRequest} from "./constants";
    import Grade from "./Widgets/Grade.svelte";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {navigate} from "svelte-routing";
    import Select, {Option} from "@smui/select";

    let grades = [];
    let total_average_perm = 0.0;
    let total_average = 0.0;
    let stalne = false;
    let selectedYear = "";
    let years = [];

    let izpitniRoki = localStorage.getItem("izpitniRoki") === "true";

    async function getGrades() {
        let r = await makeRequest(`/grades?year=${selectedYear}`);
        let ttotal_average_perm = r["grades"]["average_perm"];
        if (ttotal_average_perm === undefined) {
            navigate(`/napaka?error=Neuspešna prijava v GimSIS. Če ste si spremenili geslo za GimSIS, ga morate spremeniti tudi v BežiAppu v zavihku Nastavitve. V nasprotnem primeru kontaktirajte strežniškega administratorja.`);
        }
        let ttotal_average = r["grades"]["average"];
        grades = r["grades"]["subjects"];
        years = r["school_years"];
        total_average_perm = ttotal_average_perm;
        total_average = ttotal_average;
    }

    getGrades();
</script>

<FormField>
    <Switch bind:checked={stalne} />
    <span slot="label">Stalne ocene</span>
</FormField>
<FormField on:click={() => {
    let value = (izpitniRoki).toString();
    localStorage.setItem("izpitniRoki", value);
    setTimeout(() => izpitniRoki = localStorage.getItem("izpitniRoki") === "true", 20);
}}>
    <Switch bind:checked={izpitniRoki} />
    <span slot="label">Izpitni roki</span>
</FormField>
<p/>
Učni uspeh: <span style="color: rgba(255, 255, 255, 0.5); display:inline-block;">{stalne ? total_average_perm.toFixed(2) : total_average.toFixed(2)}</span>
<p/>
<DataTable table$aria-label="People list" style="width: 100%;">
    <Head>
        <Row>
            <Cell>Predmet</Cell>
            <Cell>1. ocenjevalno obdobje</Cell>
            <Cell>2. ocenjevalno obdobje</Cell>
            {#if izpitniRoki}
                <Cell>Spomladanski izpitni rok</Cell>
                <Cell>Jesenski izpitni rok</Cell>
            {/if}
        </Row>
    </Head>
    <Body>
        {#each grades as subject}
            <Row>
                <Cell class="sameline">
                    <div class="inline">{subject.name}</div>
                    <div class="meta inline grades-center">
                        {#if (subject["final"] === undefined || subject["final"] === null)}
                            {stalne ? subject["perm_average"].toFixed(2) : subject["average"].toFixed(2)}
                        {:else}
                            <span style="color: {gradeColors[subject.final]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                {subject.final}
                            </span>
                            <span class="zacasna">({stalne ? subject["perm_average"].toFixed(2) : subject["average"].toFixed(2)})</span>
                        {/if}
                    </div>
                </Cell>
                <Cell class="sameline">
                    {#each subject[0]["grades"] as grade}
                        <Grade grade={grade} stalne={stalne} />
                    {/each}
                    <div class="meta inline grades-center">
                        {#if subject[0].final === ""}
                            {stalne ? subject[0]["perm_average"].toFixed(2) : subject[0]["average"].toFixed(2)}
                        {:else}
                            <span style="color: {gradeColors[subject[0].final]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                {subject[0].final}
                            </span>
                            <span class="zacasna">({stalne ? subject[0]["perm_average"].toFixed(2) : subject[0]["average"].toFixed(2)})</span>
                        {/if}
                    </div>
                </Cell>
                <Cell class="sameline">
                    {#each subject[1]["grades"] as grade}
                        <Grade grade={grade} stalne={stalne} />
                    {/each}
                    <div class="meta inline grades-center">
                        {#if subject[1].final === ""}
                            {stalne ? subject[1]["perm_average"].toFixed(2) : subject[1]["average"].toFixed(2)}
                        {:else}
                            <span style="color: {gradeColors[subject[1].final]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                {subject[1].final}
                            </span>
                            <span class="zacasna">({stalne ? subject[1]["perm_average"].toFixed(2) : subject[1]["average"].toFixed(2)})</span>
                        {/if}
                    </div>
                </Cell>
                {#if izpitniRoki}
                    <Cell class="sameline">
                        {#each subject[2]["grades"] as grade}
                            <Grade grade={grade} stalne={stalne} />
                        {/each}
                        <div class="meta inline grades-center">
                            {#if subject[2].final === ""}
                                {stalne ? subject[2]["perm_average"].toFixed(2) : subject[2]["average"].toFixed(2)}
                            {:else}
                                <span style="color: {gradeColors[subject[2].final]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                    {subject[2].final}
                                </span>
                                <span class="zacasna">({stalne ? subject[2]["perm_average"].toFixed(2) : subject[2]["average"].toFixed(2)})</span>
                            {/if}
                        </div>
                    </Cell>
                    <Cell class="sameline">
                        {#each subject[3]["grades"] as grade}
                            <Grade grade={grade} stalne={stalne} />
                        {/each}
                        <div class="meta inline grades-center">
                            {#if subject[3].final === ""}
                                {stalne ? subject[3]["perm_average"].toFixed(2) : subject[3]["average"].toFixed(2)}
                            {:else}
                                <span style="color: {gradeColors[subject[3].final]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
                                    {subject[3].final}
                                </span>
                                <span class="zacasna">({stalne ? subject[3]["perm_average"].toFixed(2) : subject[3]["average"].toFixed(2)})</span>
                            {/if}
                        </div>
                    </Cell>
                {/if}
            </Row>
        {/each}
    </Body>
</DataTable>

<p/>

<Select key={(fruit) => `${fruit ? fruit.value : ''}`} bind:value={selectedYear} label="Šolsko leto">
    {#each years as fruit}
        <Option value={fruit.value} on:click={async () => {setTimeout(getGrades, 50)}}>{fruit.text}</Option>
    {/each}
</Select>
