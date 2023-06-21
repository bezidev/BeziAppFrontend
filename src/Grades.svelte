<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {gradeColors, makeRequest} from "./constants";
    import Grade from "./Widgets/Grade.svelte";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {navigate} from "svelte-navigator";

    let grades = [];
    let total_average = 0.0;
    let stalne = false;

    let izpitniRoki = localStorage.getItem("izpitniRoki") === "true";

    async function getGrades() {
        let r = await makeRequest("/grades");
        let ttotal_average = r["grades"]["average"];
        if (ttotal_average === undefined) {
            navigate(`/napaka?error=Neuspešna prijava v GimSIS. Če ste si spremenili geslo za GimSIS, ga morate spremeniti tudi v BežiAppu v zavihku Nastavitve. V nasprotnem primeru kontaktirajte strežniškega administratorja.`);
        }
        grades = r["grades"]["subjects"];
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
Učni uspeh: <span style="color: rgba(255, 255, 255, 0.5); display:inline-block;">{total_average.toFixed(2)}</span>
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
                            <span style="color: {gradeColors[parseInt(subject.final) - 1]}; display:inline-block; font-size: 1.25rem; font-weight: 600;">
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
                    <div class="meta inline grades-center">{stalne ? subject[0]["perm_average"].toFixed(2) : subject[0]["average"].toFixed(2)}</div>
                </Cell>
                <Cell class="sameline">
                    {#each subject[1]["grades"] as grade}
                        <Grade grade={grade} stalne={stalne} />
                    {/each}
                    <div class="meta inline grades-center">{stalne ? subject[1]["perm_average"].toFixed(2) : subject[1]["average"].toFixed(2)}</div>
                </Cell>
                {#if izpitniRoki}
                    <Cell class="sameline">
                        {#each subject[2]["grades"] as grade}
                            <Grade grade={grade} stalne={stalne} />
                        {/each}
                        <div class="meta inline grades-center">{stalne ? subject[2]["perm_average"].toFixed(2) : subject[2]["average"].toFixed(2)}</div>
                    </Cell>
                    <Cell class="sameline">
                        {#each subject[3]["grades"] as grade}
                            <Grade grade={grade} stalne={stalne} />
                        {/each}
                        <div class="meta inline grades-center">{stalne ? subject[3]["perm_average"].toFixed(2) : subject[3]["average"].toFixed(2)}</div>
                    </Cell>
                {/if}
            </Row>
        {/each}
    </Body>
</DataTable>
