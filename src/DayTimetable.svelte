<script lang="ts">
    import MeetingCard from "./MeetingCard.svelte";
    import Warning from "./Warning.svelte";

    export let date;
    export let warn;
    export let today;
    export let tomorrow;
    export let day;

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

    let m = Math.max(today[0] === undefined ? Object.keys(today).length + 1 : Object.keys(today).length, tomorrow[0] === undefined ? Object.keys(tomorrow).length + 1 : Object.keys(tomorrow).length);
</script>

<table class="coolTable">
    <tr>
        <th style="text-align: left;">URA</th>
        <th><b>{dnevi[day].toUpperCase()}</b>, {date[0]} {#if warn[0] === true}<Warning/>{/if}</th>
        {#if Object.keys(tomorrow).length !== 0}<th><b>{dnevi[tom].toUpperCase()}</b>, {date[1]} {#if warn[1] === true}<Warning/>{/if}</th>{/if}
    </tr>
    {#each {length: m} as _, i}
        <tr>
            <td style="text-align: left;"><b>{i}</b>.<br><span style="font-size: 14px;">{ure[i]}</span></td>
            <td>
                {#each Array(today[i]) as m}
                    {#if m}
                        <MeetingCard n={m} />
                    {:else}
                        <div style="height: 10px;"></div>
                    {/if}
                {/each}
            </td>
            <td>
                {#each Array(tomorrow[i]) as m}
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