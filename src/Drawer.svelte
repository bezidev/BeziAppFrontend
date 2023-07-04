<script lang="ts">
    import Drawer, {
        Content,
        Header,
        Title,
        Scrim,
    } from '@smui/drawer';
    import List, {Item, Text, Graphic} from '@smui/list';
    import { navigate as nvgt } from "svelte-navigator";
    import IconButton from "@smui/icon-button";
    import isMobile from "is-mobile";

    import {useLocation} from "svelte-navigator";
    import {handleRejection} from "./constants";

    const location = useLocation();

    let active = "";
    let meetingActive: string = undefined;
    let communicationActive: string = undefined;
    let communications = [];
    let communicationUnread = {};
    let unreadMessages;

    let allPaths = {};

    let lastUrl = "";
    let showDrawer = false;
    let hasRequested = false;

    function navigate(to: string) {
        open = false;
        statusFunction(open);
        nvgt(to);
    }

    $: (async () => {
        statusFunction(open);
        if (!($location.pathname === "/login" || $location.pathname === "/register")) {
            showDrawer = true;

            const token = localStorage.getItem("key");
            if (token === null || token === undefined || token === "") {
                let j = {
                    message: "Token cookie is either null or undefined",
                    fileName: `Drawer.svelte/onMount()`,
                    lineNumber: 0,
                    columnNumber: 0,
                    stack: token,
                };
                await handleRejection(j);
                navigate("/login");
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
                "/lopolis": "lopolis",
                "/notes": "notes",
                "/about": "about",
                "/tarot/contests": "contests",
                "/radio": "radio",
                "/settings": "settings",
                "/developers": "developers",
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
    <Drawer variant="modal" fixed={false} style="position: absolute; top: 0;" bind:open>
        <Content>
            <List>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/')}
                        activated={active === 'pregled'}
                >
                    <Graphic class="material-icons" aria-hidden="true">home</Graphic>
                    <Text>Pregled</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/gradings')}
                        activated={active === 'ocenjevanja'}
                >
                    <Graphic class="material-icons" aria-hidden="true">grading</Graphic>
                    <Text>Ocenjevanja</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/grades')}
                        activated={active === 'ocene'}
                >
                    <Graphic class="material-icons" aria-hidden="true">grade</Graphic>
                    <Text>Ocene</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/absences')}
                        activated={active === 'izostanki'}
                >
                    <Graphic class="material-icons" aria-hidden="true">rule</Graphic>
                    <Text>Izostanki</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/lopolis')}
                        activated={active === 'lopolis'}
                >
                    <Graphic class="material-icons" aria-hidden="true">lunch_dining</Graphic>
                    <Text>Lo.Polis</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/notes')}
                        activated={active === 'notes'}
                >
                    <Graphic class="material-icons" aria-hidden="true">note</Graphic>
                    <Text>Testi in zapiski</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/radio')}
                        activated={active === 'radio'}
                >
                    <Graphic class="material-icons" aria-hidden="true">speaker</Graphic>
                    <Text>Šolski radio</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/tarot/contests')}
                        activated={active === 'contests'}
                >
                    <Graphic class="material-icons" aria-hidden="true">casino</Graphic>
                    <Text>Tarok</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => window.open("https://umetnost.beziapp.si")}
                >
                    <Graphic class="material-icons" aria-hidden="true">brush</Graphic>
                    <Text>Umetnostna zgodovina</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => window.open("https://smp.beziapp.si")}
                >
                    <Graphic aria-hidden="true" style="height: 24px;"><img src="/mc.svg" alt="Minecraft server" style="height: 24px; color: rgba(255, 255, 255, 0.6);"></Graphic>
                    <Text>BežiSMP</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/settings')}
                        activated={active === 'settings'}
                >
                    <Graphic class="material-icons" aria-hidden="true">settings</Graphic>
                    <Text>Nastavitve</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/developers')}
                        activated={active === 'developers'}
                >
                    <Graphic class="material-icons" aria-hidden="true">code</Graphic>
                    <Text>BežiApp za razvijalce</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/about')}
                        activated={active === 'about'}
                >
                    <Graphic class="material-icons" aria-hidden="true">info</Graphic>
                    <Text>O nas</Text>
                </Item>
            </List>
        </Content>
    </Drawer>
    <Scrim fixed={false} />
{/if}
