<script lang="ts">
    import {makeRequest} from "./constants";
    import insane from "insane";
    import {marked} from "marked";
    import Button, {Label} from "@smui/button";
    import Icon from "@smui/textfield/icon";
    import Textfield from "@smui/textfield";
    import CharacterCounter from "@smui/textfield/character-counter";
    import Select, {Option} from "@smui/select";

    let notifications = [];

    const NOTIFICATION_TYPES = [
        "general",
        "gimsis_closed",
        "login",
    ];

    let name = "";
    let description = "";
    let notification_type = "";

    async function getNotifications() {
        notifications = await makeRequest("/developers/notifications");
    }

    async function newNotification() {
        let fd = new FormData();
        fd.append("name", name);
        fd.append("description", description);
        fd.append("notification_type", notification_type);
        await makeRequest("/developers/notifications", "POST", fd);
        name = "";
        description = "";
        notification_type = "";
        await getNotifications();
    }

    async function deleteNotification(id: string) {
        await makeRequest(`/developers/notification/${id}`, "DELETE");
        await getNotifications();
    }

    getNotifications();
</script>

<h1>Sistemska obvestila (na voljo samo administratorjem)</h1>

<h2>Novo sistemsko obvestilo</h2>
<Textfield bind:value={name} helperLine$style="width: 100%;" style="width: 100%;" label="Ime obvestila" />

<p/>

<Textfield textarea style="width: 100%;" input$maxlength={50_000} bind:value={description} label="Opis obvestila">
    <CharacterCounter slot="internalCounter">0 / 50.000</CharacterCounter>
</Textfield>

<p/>

{#if description !== ""}
    <h3>Predogled</h3>
    {@html insane(marked(description))}
{/if}

<p/>

<Select bind:value={notification_type} label="Tip obvestila">
    {#each NOTIFICATION_TYPES as not}
        <Option value={not}>{not}</Option>
    {/each}
</Select>

<p/>

<Button variant="raised" on:click={async () => {await newNotification()}}>
    <Icon class="material-icons">add</Icon>
    <Label>Objavi obvestilo</Label>
</Button>

<h2>Sistemska obvestila</h2>

{#each notifications as notification}
    <h3>{notification.name}</h3>
    {@html insane(marked(notification.description))}

    <p/>

    <h4>Metapodatki</h4>

    Ustvaril <b>{notification.created_by}</b> ob času <b>{notification.created_on}</b>.
    Obvestilo je tipa <b>{notification.notification_type}</b>.

    <p/>

    <Button variant="raised" on:click={async () => {await deleteNotification(notification.id)}}>
        <Icon class="material-icons">delete</Icon>
        <Label>Odstrani obvestilo</Label>
    </Button>
{/each}