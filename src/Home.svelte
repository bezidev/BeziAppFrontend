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
    Kot ste nekateri že lahko videli, se s prihodnjim šolskim letom poslavlja šolski sistem GimSIS. Nadomestil ga bo eAsistent.

    <p/>

    Ja, ta eAsistent, ki je mnogim poznan že iz osnovnih šol. Točno ta eAsistent, ki zahteva premium paket za vpogled v vaše ocene, ocenjevanja in druge osnovne informacije. Ta eAsistent, ki ima grozno aplikacijo s povprečno oceno aplikacija 1,3 na Google Play trgovini (zelo slabo).

    <p/>

    Ker je BežiApp direktno odvisen od podatkov iz GimSISa, imam dve možnosti – ga ali zapreti ali pa prilagoditi za eAsistent.

    <p/>

    Ker tudi mene grozljivo skrbi kvaliteta eAsistentove aplikacije mojAsistent, sem se odločil za slednje. BežiApp bo ostal v taki obliki, v kakršni ga poznate zdaj, v ozadju pa se bo vse spremenilo ... na žalost na slabše za vas, a temu se lahko zahvalite zgolj eŠoli – matičnemu podjetju eAsistenta.

    <p/>

    Potrebna bo ponovna registracija uporabniškega računa, k čemu vas bo v prihodnjem letu pozval tudi BežiApp. Za zdaj pa uživajte v zadnjih dneh GimSISa, preden na našo šolo vstopi požrešna alternativa.

    <p/>

    Hvala za vse. Lepe počitnice vam želi

    <p/>

    Mitja, 2. A (kmalu 3. A)

    <p/>
</div>

<p/>

<Timetable />

