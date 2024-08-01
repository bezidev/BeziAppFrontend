<script lang="ts">
    import Drawer, {
        Content,
        Scrim,
    } from '@smui/drawer';
    import List, {Item, Text, Graphic} from '@smui/list';
    import {navigate as nvgt} from "svelte-routing";
    import isMobile from "is-mobile";

    import {useLocation} from "svelte-routing";
    import {handleRejection} from "./constants";
    import {svelteLoc} from "./stores";
    import type {ErrorRequest} from "./ts/error";

    const location = useLocation();
    let active = "";
    let allPaths = {};
    let lastUrl = "";
    let showDrawer = false;

    function navigate(to: string) {
        open = false;
        statusFunction(open);
        nvgt(to);
    }

    $: (async () => {
        statusFunction(open);

        console.log("loc", $location)
        svelteLoc.set($location.pathname);

        if (!($location.pathname === "/login" || $location.pathname === "/reset")) {
            showDrawer = true;

            const username = localStorage.getItem("account_username");
            const password = localStorage.getItem("account_password");
            if (username == null || username === "" || password == null || password === "") {
                let j: ErrorRequest = {
                    message: "Token cookie is either null or undefined",
                    fileName: `Drawer.svelte/onMount()`,
                    lineNumber: 0,
                    columnNumber: 0,
                };
                await handleRejection(j);
                navigate("/login");
                return;
            }

            let path = $location.pathname;
            if (path === lastUrl) {
                return
            }

            lastUrl = path;
            allPaths = {
                "/": "pregled",
                "/gradings": "ocenjevanja",
                "/absences": "izostanki",
                "/grades": "ocene",
                "/teachers": "ucitelji",
                "/bikes": "kolesarnica",
                "/food": "prehrana",
                "/notes": "notes",
                "/about": "about",
                "/radio": "radio",
                "/settings": "settings",
                "/palette": "palette",
                "/citing": "citing",
                "/developers": "developers",
                "/notifications": "notifications",
            }
            active = allPaths[path]
            return
        }

        showDrawer = false;
    })()

    const mobile = isMobile();
    export let open: boolean;
    export let statusFunction;
</script>

{#if showDrawer}
    <div>
        <Drawer variant="modal" fixed={false} bind:open>
            <Content>
                <List>
                    <Item
                            on:click={() => navigate('/')}
                            activated={active === 'pregled'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">home</Graphic>
                        <Text>Pregled</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/gradings')}
                            activated={active === 'ocenjevanja'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">grading</Graphic>
                        <Text>Ocenjevanja</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/grades')}
                            activated={active === 'ocene'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">grade</Graphic>
                        <Text>Ocene</Text>
                    </Item>
                    <!--<Item
                            on:click={() => navigate('/absences')}
                            activated={active === 'izostanki'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">rule</Graphic>
                        <Text>Izostanki</Text>
                    </Item>-->
                    <!--<Item
                            on:click={() => navigate('/teachers')}
                            activated={active === 'ucitelji'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">school</Graphic>
                        <Text>Učitelji</Text>
                    </Item>-->
                    <Item
                            on:click={() => navigate('/bikes')}
                            activated={active === 'kolesarnica'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">directions_bike</Graphic>
                        <Text>Kolesarnica</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/food')}
                            activated={active === 'prehrana'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">lunch_dining</Graphic>
                        <Text>Šolska prehrana</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/notes')}
                            activated={active === 'notes'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">note</Graphic>
                        <Text>Testi in zapiski</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/radio')}
                            activated={active === 'radio'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">speaker</Graphic>
                        <Text>Šolski radio</Text>
                    </Item>
                    <!--<Item
                            on:click={() => navigate('/citing')}
                            activated={active === 'citing'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">format_quote</Graphic>
                        <Text>Navajanje virov</Text>
                    </Item>-->
                    <Item
                            on:click={() => window.open("https://ucenje-nem.beziapp.si")}
                    >
                        <Graphic class="material-icons" aria-hidden="true">language</Graphic>
                        <Text>Učenje nemščine</Text>
                    </Item>
                    <Item
                            on:click={() => window.open("https://umetnost.beziapp.si")}
                    >
                        <Graphic class="material-icons" aria-hidden="true">brush</Graphic>
                        <Text>Umetnostna zgodovina</Text>
                    </Item>
                    <Item
                            on:click={() => window.open("https://smp.beziapp.si")}
                    >
                        <Graphic aria-hidden="true" style="height: 24px;"><img src="/mc.svg" alt="Minecraft server"
                                                                               style="height: 24px; color: rgba(255, 255, 255, 0.6);">
                        </Graphic>
                        <Text>BežiSMP</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/palette')}
                            activated={active === 'palette'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">palette</Graphic>
                        <Text>Barvne palete</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/settings')}
                            activated={active === 'settings'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">settings</Graphic>
                        <Text>Nastavitve</Text>
                    </Item>
                    <Item
                            on:click={() => navigate('/developers')}
                            activated={active === 'developers'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">code</Graphic>
                        <Text>BežiApp za razvijalce</Text>
                    </Item>
                    {#if localStorage.getItem("account_username") === "mitja.severkar"}
                        <Item
                                on:click={() => navigate('/notifications')}
                                activated={active === 'notifications'}
                        >
                            <Graphic class="material-icons" aria-hidden="true">notifications</Graphic>
                            <Text>Obvestila razvijalcev</Text>
                        </Item>
                    {/if}
                    <Item
                            on:click={() => navigate('/about')}
                            activated={active === 'about'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">info</Graphic>
                        <Text>O nas</Text>
                    </Item>
                </List>
            </Content>
        </Drawer>
        <Scrim fixed={false}/>
    </div>
{/if}
