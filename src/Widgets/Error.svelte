<script lang="ts">
    export let error: string;

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
</script>

<style>
    div {
        text-align: center;
    }

    .basediv {
        padding: 70px 0;
    }
</style>

<div class="basediv">
    <span style="font: 15vw Google Sans,Helvetica Neue,sans-serif;">(^-^*)</span>
    <p/>
    <span style="font: 24px/32px Google Sans,Helvetica Neue,sans-serif;">🤯 Prišlo je do napake v sistemu.</span>
    <p/>
    <span style="font: 16px/24px Google Sans,Helvetica Neue,sans-serif;">Prosimo, pošljite razvijalcem tega sistema naslednjo napako. (Večino težav se da razrešiti z osvežitvijo strani. {#if neprimerniKomentarji}Sovražim JavaScript predpomnilnik{/if})</span>
    <pre>{error}</pre>
</div>