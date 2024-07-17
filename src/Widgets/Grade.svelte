<script lang="ts">
    import isMobile from "is-mobile";
    import BottomSheet from "./BottomSheet.svelte";
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import {gradeColors} from "../constants";
    import type {Grade} from "../ts/grades";
    import {formatDate} from "date-fns";

    export let grade: Grade;

    //export let isSurpassed: boolean = false;

    const mobile = isMobile();

    let open = false;
</script>

<style>
    .old-grade {
        color: gray;
    }
</style>

<div class="inline">
    <Wrapper>
        <div style="color: {gradeColors[grade.grade_num]}; display:inline-block; font-size: 1.25rem; font-weight: 600;" on:click={(e) => {
            if (mobile) {
                open = true;
            }
        }}>
            <span class="{!grade.GradeImproved ? '' : 'zacasna'} {grade.GradeImproved ? 'old-grade' : ''}">
                {grade.grade_num}
            </span>
        </div>

        {#if !mobile}
            <Tooltip unbounded hideDelay={0}>
                <h1>{grade.SubjectName} – {grade.grade_num}</h1>
                Nazadnje posodobljeno: <b>{formatDate(new Date(grade.LastUpdated * 1000), "d. M. yyyy")}</b><br>
                Profesor: <b>{grade.TeacherName}</b><br>
                Tip ocenjevanja: <b>{grade.GradeType === 0 ? "Pisna ocena" : grade.GradeType === 1 ? "Ustna ocena" : "Druga ocena"}</b><br>
                Opis ocenjevanja: <b>{grade.description_decrypted}</b><br>
                Oceno je vpisal: <b>{grade.InsertedBy === "user" ? "Uporabnik" : grade.InsertedBy}</b>
                <hr>
                {#if grade.GradeImproved}
                    <b>Ocena je bila izboljšana.</b>
                {/if}
                {#if grade.ManuallyUpdated}
                    <b>Ocena je bila ročno vpisana v BežiApp sistem. Ocena se ne posodablja več avtomatsko.</b>
                {/if}
            </Tooltip>
        {/if}
    </Wrapper>
    {#if mobile && open}
        <BottomSheet open={open} callback={(value) => open=value}>
            <main class="body fill">
                <h1>{grade.SubjectName} – {grade.grade_num}</h1>
                Nazadnje posodobljeno: <b>{formatDate(new Date(grade.LastUpdated * 1000), "d. M. yyyy")}</b><br>
                Profesor: <b>{grade.TeacherName}</b><br>
                Tip ocenjevanja: <b>{grade.GradeType === 0 ? "Pisna ocena" : grade.GradeType === 1 ? "Ustna ocena" : "Druga ocena"}</b><br>
                Opis ocenjevanja: <b>{grade.description_decrypted}</b><br>
                Oceno je vpisal: <b>{grade.InsertedBy === "user" ? "Uporabnik" : grade.InsertedBy}</b>
                <hr>
                {#if grade.GradeImproved}
                    <b>Ocena je bila izboljšana.</b>
                {/if}
                {#if grade.ManuallyUpdated}
                    <b>Ocena je bila ročno vpisana v BežiApp sistem. Ocena se ne posodablja več avtomatsko.</b>
                {/if}
            </main>
        </BottomSheet>
    {/if}
    <!--{#each grade.popravljane_ocene as g}
        <svelte:self grade={g} stalne={stalne} isSurpassed={true} />
    {/each}-->
</div>
