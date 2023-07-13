<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {gradeColors, makeRequest} from "./constants";
    import Grade from "./Widgets/Grade.svelte";

    let teachers = [];

    async function getTeachers() {
        let r = await makeRequest("/teachers");
        teachers = r["teachers"];
    }

    getTeachers();
</script>

<DataTable table$aria-label="People list" style="width: 100%;">
    <Head>
        <Row>
            <Cell>Učitelj</Cell>
            <Cell>Predmeti</Cell>
            <Cell>Govorilne ure za starše</Cell>
        </Row>
    </Head>
    <Body>
    {#each teachers as teacher}
        <Row>
            <Cell class="sameline">
                {#if teacher.lahko_pise}
                    <b>{teacher.ime}</b>
                {:else}
                    {teacher.ime}
                {/if}
            </Cell>
            <Cell class="sameline">
                <p/>
                {#each teacher.predmeti as predmet}
                    {#if predmet === "Razrednik"}
                        <b>{predmet}</b>
                    {:else}
                        {predmet}
                    {/if}
                    <br>
                {/each}
                <p/>
            </Cell>
            <Cell class="sameline">
                {teacher.govorilna_ura}
            </Cell>
        </Row>
    {/each}
    </Body>
</DataTable>
