<script lang="ts">
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import BottomSheet from "./BottomSheet.svelte";
    import isMobile from "is-mobile";

    let mobile = isMobile();

    export let open = true;
    export let changeOpen = (v) => {}
</script>

{#if !mobile}
    <slot></slot>
{/if}
{#if mobile}
    {#if open}
        <BottomSheet open={true} callback={(value) => {
            open = value;
            changeOpen(value);
        }}>
            <main class="body fill">
                <slot></slot>
            </main>
        </BottomSheet>
    {/if}
{/if}
