<script lang="ts">
    import isMobile from "is-mobile";
    import Tooltip, {Wrapper} from "@smui/tooltip";

    let mobile = isMobile();
</script>

{#if mobile}
    <slot name="torender"></slot>
    <slot name="tooltip"></slot>
{:else}
    <Wrapper>
        <slot name="torender"></slot>
        <Tooltip unbounded hideDelay={0}>
            <slot name="tooltip"></slot>
        </Tooltip>
    </Wrapper>
{/if}