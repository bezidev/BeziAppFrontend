<script lang="ts">
    import {makeRequest} from "./constants";
    import IconButton from "@smui/icon-button";
    import {onMount} from "svelte";
    import {navigate} from "svelte-navigator";
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import {Icon} from "@smui/button";

    let gradings;
    let open = [];

    async function getGradings() {
        gradings = await makeRequest(`/gradings`)
    }

    onMount(async () => {
        try {
            await getGradings();
        } catch (e) {
            console.log(e)
            navigate("/login")
        }
    })
</script>

{#if gradings}
    <Accordion>
        {#each gradings.gradings as grading, i}
            <Panel bind:open={open[i]}>
                <Header>
                    {grading.predmet} - {grading.datum}
                    <IconButton slot="icon" toggle pressed={open[i]}>
                        <Icon class="material-icons" on>expand_less</Icon>
                        <Icon class="material-icons">expand_more</Icon>
                    </IconButton>
                </Header>
                <Content>
                    {grading.opis}
                </Content>
            </Panel>
        {/each}
    </Accordion>
{/if}
