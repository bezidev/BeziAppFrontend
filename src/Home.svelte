<script lang="ts">
    import Timetable from "./Widgets/Timetable.svelte";
    import {handleRejection} from "./constants";
    import {marked} from "marked";
    import {navigate} from "svelte-routing";

    const username = localStorage.getItem("account_username");
    const password = localStorage.getItem("account_password");
    if (username == null || username === "" || password == null || password === "") {
        console.log("Home")
        let j = {
            message: "Token is either null or undefined",
            fileName: `Home.svelte`,
            lineNumber: 5,
            columnNumber: 0,
        };
        handleRejection(j);
        navigate("/login");
    }
</script>

<div style="padding: 10px; background-color: darkorange; border-radius: 10px;">
    <h2>BežiApp Evolved</h2>
    Ste na straneh BežiApp Evolved projekta. Ta je trenutno še v zelo zgodnji alfa fazi. Pričakujte hrošče.
    <p/>
</div>

<p/>

<Timetable />

