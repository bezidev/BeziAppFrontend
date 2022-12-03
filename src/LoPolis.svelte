<script lang="ts">
    import {makeRequest} from "./constants";
    import IconButton from "@smui/icon-button";
    import {onMount} from "svelte";
    import {navigate} from "svelte-navigator";
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Select, { Option } from '@smui/select';
    import Button, {Icon, Label} from "@smui/button";
    import insane from "insane";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";

    let selectedMonth = (new Date()).getMonth() + 1;
    let selectedYear = (new Date()).getFullYear();

    let meals;
    let open = {};

    for (let i = 0; i < 100; i++) {
        open[i] = false;
    }

    let selectedMeals = {};
    let checkouts = {};

    async function selected_meals() {
        await sleep(20);
        selectedMeals = {};
        const keys = Object.keys(meals);
        for (let i in keys) {
            for (let m in meals[keys[i]]) {
                const meal = meals[keys[i]][m];
                for (let k in meal.menu_options) {
                    if (meal.menu_options[k].selected) {
                        selectedMeals[meal.local_id] = meal.menu_options[k].value;
                    }
                }
            }
        }
        await sleep(20);
        console.log(selectedMeals);
    }

    function assemble_meals() {
        for (let i in Object.keys(selectedMeals)) {
            let meal_id = Object.keys(selectedMeals)[i]
            let selected_meal = selectedMeals[meal_id];
            for (let n in meals) {
                let date = meals[n]
                for (let x in date) {
                    if (date[x].local_id.toString() !== meal_id.toString()) {
                        continue;
                    }
                    for (let y in date[x].menu_options) {
                        meals[n][x].menu_options[y].selected = date[x].menu_options[y].value === selected_meal;
                    }
                }
            }
        }
        console.log(meals);
    }

    async function sleep(millisec = 0) {
        return await new Promise(r => setTimeout(r, millisec));
    }

    async function getMeals() {
        meals = await makeRequest(`/lopolis/meals?year=${selectedYear}&month=${selectedMonth}`)
        await selected_meals();
    }

    async function getCheckouts() {
        checkouts = await makeRequest(`/lopolis/checkouts?year=${selectedYear}&month=${selectedMonth}`)
    }

    async function setMeals() {
        let fd = new FormData();
        fd.append("lopolis_response", JSON.stringify(meals));
        await makeRequest(`/lopolis/meals?year=${selectedYear}&month=${selectedMonth}`, "POST", fd)
        await getMeals();
    }

    async function setCheckouts() {
        let fd = new FormData();
        fd.append("lopolis_response", JSON.stringify(checkouts));
        await makeRequest(`/lopolis/checkouts?year=${selectedYear}&month=${selectedMonth}`, "POST", fd)
        await getCheckouts();
    }

    async function fetchData() {
        await getMeals();
        await getCheckouts();
    }

    onMount(async () => {
        try {
            await fetchData();
        } catch (e) {
            console.log(e)
            navigate("/lopolis/login")
        }
    })
</script>

<IconButton class="material-icons" on:click={async () => {
    if (selectedMonth === 1) {
        selectedMonth = 12;
        selectedYear--;
    } else {
        selectedMonth--;
    }
    await getMeals();
    await getCheckouts();
}}>
    arrow_back
</IconButton>
<IconButton class="material-icons" on:click={async () => {
    if (selectedMonth === 12) {
        selectedMonth = 1;
        selectedYear++;
    } else {
        selectedMonth++;
    }
    await getMeals();
    await getCheckouts();
}}>
    arrow_forward
</IconButton><br>

Izbran mesec: <b>{selectedMonth}/{selectedYear}</b><p/>

{#if meals}
    <Button on:click={async () => {
        assemble_meals();
        await setMeals();
        await setCheckouts();
    }}>
        <Icon class="material-icons">save_alt</Icon>
        <Label>Shrani spremembe</Label>
    </Button>
    <Accordion>
        {#each Object.entries(meals) as [k, day]}
            {#if day.length !== 0}
                <h1>{k.split("T")[0]}</h1>
                {#each day as meal}
                    <Panel bind:open={open[meal.local_id]}>
                        <Header>
                            <div style="display: flex; flex-direction: row; align-items: center;">
                                {meal.meal}
                                {#if selectedMeals[meal.local_id] !== undefined && selectedMeals[meal.local_id] !== ""}
                                    <Icon class="material-icons" style="margin: 0 0 0 0.5em;" on>done</Icon>
                                {/if}
                            </div>
                            <IconButton style="margin: auto 0;" slot="icon" toggle pressed={open[meal.local_id]}>
                                <Icon class="material-icons" on>expand_less</Icon>
                                <Icon class="material-icons">expand_more</Icon>
                            </IconButton>
                        </Header>
                        <Content>
                            <h3>Odjave</h3>
                            {#each Object.entries(checkouts) as [k2, checkout]}
                                {#each checkout as c, i}
                                    {#if c.full_date === k && c.checkout_local_id.toString() === meal.local_id.toString()}
                                        {#if c.disabled}
                                            <h5>Odjave so že potekle.</h5>
                                        {:else}
                                            <FormField>
                                                <Switch bind:checked={checkouts[k2][i].cancelled} />
                                                <span slot="label">Je odjavljeno</span>
                                            </FormField>
                                        {/if}
                                    {/if}
                                {/each}
                            {/each}
                            <h3>Meni</h3>
                            <Select bind:value={selectedMeals[meal.local_id]} label="Izberite meni" style="width: 100%;">
                                <Option value=""></Option>
                                {#each meal.menu_options as m}
                                    <Option value={m.value} style="height: 125%;">{insane(m.text)}</Option>
                                {/each}
                            </Select>
                        </Content>
                    </Panel>
                {/each}
            {/if}
        {/each}
    </Accordion>
{/if}