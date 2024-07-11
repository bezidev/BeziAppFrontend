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
    <h2>BežiApp Evolved</h2>
    Ste na straneh BežiApp Evolved projekta. Ta je trenutno še v zelo zgodnji alfa fazi. Pričakujte hrošče.
    <p/>
</div>

<p/>

<Timetable />

