<script lang="ts">
    import List, {PrimaryText, SecondaryText, Item, Text} from "@smui/list";
    import AboutPerson from "./Widgets/AboutPerson.svelte";

    const developers = [
        {
            name: "Mitja Ševerkar",
            social: [
                {id: "github", name: "mytja"},
                {id: "discord", name: "@mytja (mytja#4761)", uuid: "761599472454205531"},
                {id: "mail", name: "mitja.severkar@gimb.org"},
                {id: "mail", name: "mitja@severkar.eu"},
            ],
            pfp: "https://avatars.githubusercontent.com/u/52399966?v=4",
            desc: "Razvijalec prenovljene verzije",
        },
        {
            name: "Anton Luka Šijanec",
            social: [
                {id: "mail", name: "anton@sijanec.eu"},
            ],
            pfp: "/asijanec.png",
            desc: "Razvijalec stare verzije & beta tester nove verzije",
        },
        {
            name: "Rok Štular",
            social: [
                {id: "instagram", name: "rstular"},
            ],
            pfp: "/rstular.png",
            desc: "Razvijalec stare verzije",
        },
    ];

    const betaTesters = [

    ];

    const thanks = [

    ];

    const repos = [
        {
            name: "Frontend (spletna aplikacija)",
            desc: "Frontend je spisan v Svelte frameworku",
            url: "https://github.com/bezidev/BeziAppFrontend",
        },
        {
            name: "Backend (zaledni del)",
            desc: "Backend je spisan v Pythonu s FastAPI enginom",
            url: "https://github.com/bezidev/BeziAppBackend",
        },
        {
            name: "docker-compose",
            desc: "docker-compose skrbi zato, da je vzdrževanje izjemno lahko",
            url: "https://github.com/bezidev/BeziAppDocker",
        },
        {
            name: "GimSisAPI",
            desc: "Knjižica za pridobivanje podatkov iz GimSIS sistema Gimnazije Bežigrad. Napisano v Pythonu.",
            url: "https://github.com/bezidev/GimSisAPI",
        },
        {
            name: "Lo.Polis API",
            desc: "Knjižica za pridobivanje in pošiljanje podatkov o naročilih in odjavah iz Lo.Polis sistema. Napisano v Pythonu.",
            url: "https://github.com/bezidev/lopolis-api",
        },
    ];

    let neprimerniKomentarji = localStorage.getItem("komentarji") === "true";
</script>

<h1>Razvijalci</h1>
<List class="demo-list" twoLine avatarList>
    {#each developers as developer}
        <AboutPerson developer={developer}/>
    {/each}
</List>
<h1>Beta testerji</h1>
Vsi ti so mi pomagali pri testiranju zgodnjih različic BežiAppa in predlagali nove stvari.
<List class="demo-list" twoLine avatarList>
    {#each betaTesters as developer}
        <AboutPerson developer={developer}/>
    {/each}
</List>
<h1>Razne zahvale</h1>
<List class="demo-list" twoLine avatarList>
    {#each thanks as developer}
        <AboutPerson developer={developer}/>
    {/each}
</List>
<h1>Koda in repozitoriji</h1>
Koda je prosto dostopna, saj je ta sistem odprtokoden. Večina glavnih repozitorijev je licencirana pod AGPLv3 licenco.
<List class="demo-list" twoLine>
    {#each repos as repo}
        <Item on:click={() => window.open(repo.url, "_blank")}>
            <Text>
                <PrimaryText>{repo.name}</PrimaryText>
                <SecondaryText>{repo.desc}</SecondaryText>
            </Text>
        </Item>
    {/each}
</List>

{#if neprimerniKomentarji}
    <h1>Zanimiva dejstva</h1>
    <li>BežiApp je spisan v Svelte JavaScript frameworku</li>
    <li>Na strani z nastavitvami so namenoma nastavljene Fluent (Microsoftovi) ikone namesto Material (Googlove) ikone za odkritje gesla, saj se s tem posmehujemo Microsoftu in dizajnu GimSIS-a.</li>
{/if}
