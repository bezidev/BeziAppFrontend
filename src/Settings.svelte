<script lang="ts">
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
</script>

<h1>BežiApp nastavitve</h1>

<FormField>
    <Switch bind:checked={neprimerniKomentarji} on:click={() => {
        setTimeout(() => {
            localStorage.setItem("komentarji", neprimerniKomentarji.toString());
            neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
        }, 50);
    }}/>

    <span slot="label">Vklopite komentarje razvijalcev. Ker to zna razburiti marsikoga (večina teh komentarjev je zelo družbeno kritičnih), vas ne prisilim, da imate to vključeno.</span>
</FormField>