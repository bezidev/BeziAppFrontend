<script lang="ts">
    import MeetingCard from "./MeetingCard.svelte";
    import Warning from "./Warning.svelte";
    import {format, parse} from "date-fns";

    export let date;
    export let today;
    export let tomorrow;
    export let day;
    export let hours: number[];

    const ure = [
        "7.10–7.55",
        "8.00–8.45",
        "8.50–9.35",
        "9.40–10.25",
        // glavni odmor
        "10.55–11.40",
        "11.45–12.30",
        "12.35–13.20",
        "13.25–14.10",
        "14.15–15.00",
        "15.05–15.50",
        "15.55–16.40",
    ]

    const dnevi = {
        "PON": "Ponedeljek",
        "TOR": "Torek",
        "SRE": "Sreda",
        "CET": "Četrtek",
        "PET": "Petek",
    }

    let tom = Object.keys(dnevi)[Object.keys(dnevi).findIndex((element) => element === day)+1];
    console.log("aaaa", tom);
</script>

<table class="coolTable">
    <tr>
        <th style="text-align: left;">URA</th>
        <th><b>{dnevi[day].toUpperCase()}</b>, {format(parse(date[0], "yyyy-mm-dd", new Date()), "dd. mm. yyyy")}</th>
        {#if Object.keys(tomorrow).length !== 0}<th><b>{dnevi[tom].toUpperCase()}</b>, {format(parse(date[1], "yyyy-mm-dd", new Date()), "dd. mm. yyyy")}</th>{/if}
    </tr>
    {#each hours as h}
        <tr>
            <td style="text-align: left;"><b>{h}</b>.<br><span style="font-size: 14px;">{ure[h]}</span></td>
            <td>
                {#each Array(today[h]) as m}
                    {#if m}
                        <MeetingCard n={m} />
                    {:else}
                        <div style="height: 10px;"></div>
                    {/if}
                {/each}
            </td>
            <td>
                {#each Array(tomorrow[h]) as m}
                    {#if m}
                        <MeetingCard n={m} />
                    {:else}
                        <div style="height: 10px;"></div>
                    {/if}
                {/each}
            </td>
        </tr>
    {/each}
</table>