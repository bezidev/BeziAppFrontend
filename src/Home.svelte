<script lang="ts">
    import Timetable from "./Widgets/Timetable.svelte";
    import {handleRejection} from "./constants";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined || token === "") {
        let j = {
            message: "Token is either null or undefined",
            fileName: `Home.svelte`,
            lineNumber: 5,
            columnNumber: 0,
            stack: token,
        };
        await handleRejection(j);
        localStorage.removeItem("key");
        window.location.href = "/login";
    }
</script>

<Timetable />

