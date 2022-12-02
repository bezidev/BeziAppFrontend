<script lang="ts">
    import Drawer, {
        Content,
        Header,
        Title,
        Scrim,
    } from '@smui/drawer';
    import List, {Item, Text, Graphic} from '@smui/list';
    import { navigate } from "svelte-navigator";
    import IconButton from "@smui/icon-button";
    import isMobile from "is-mobile";

    import {useLocation} from "svelte-navigator";
    import Cookies from "js-cookie";

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

    $: (async () => {
        statusFunction(open);
        if (!($location.pathname === "/login" || $location.pathname === "/register")) {
            showDrawer = true;

            const token = Cookies.get("key");
            if (token === null || token === undefined) {
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
                "/about": "about",
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
    <Drawer variant={mobile ? "modal" : "dismissible"} fixed={false} style="position: absolute; top: 0;" bind:open>
        <Header class="sameline">
            <Title style="display:inline-block;">BežiApp</Title>
            <div style="display:inline-block; float:right;">
                <IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={() => {
                    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
                    localStorage.clear()
                    navigate("/login")
                }}><div style="margin: 0 0 0 0.1em;">logout</div></IconButton>
            </div>
        </Header>
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
                        on:click={() => navigate('/about')}
                        activated={active === 'about'}
                >
                    <Graphic class="material-icons" aria-hidden="true">info</Graphic>
                    <Text>O nas</Text>
                </Item>
            </List>
        </Content>
    </Drawer>
    {#if mobile}
        <Scrim fixed={false} />
    {/if}
{/if}
