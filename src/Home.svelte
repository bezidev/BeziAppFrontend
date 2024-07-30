<script lang="ts">
    import Timetable from "./Widgets/Timetable.svelte";
    import {handleRejection} from "./constants";
    import {marked} from "marked";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined || token === "") {
        let j = {
            message: "Token is either null or undefined",
            fileName: `Home.svelte`,
            lineNumber: 5,
            columnNumber: 0,
            stack: token,
        };
        handleRejection(j);
        localStorage.removeItem("key");
        window.location.href = "/login";
    }
</script>

<div style="padding: 10px; background-color: darkorange; border-radius: 10px;">
    <h2>Pomembno obvestilo</h2>
    Projekt BežiApp Evolved, ki bo podpiral eAsistent, je že v razvoju. Sistem za nalaganje zapiskov in testov ne bo na voljo vsaj do 21. 8. zaradi nadgradenj.

    <p/>

    Hvala za razumevanje. Lepe počitnice vam želi

    <p/>

    Mitja

    <p/>
</div>

<p/>

<Timetable />

