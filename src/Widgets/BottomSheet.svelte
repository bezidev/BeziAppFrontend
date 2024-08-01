<!-- Copyright (c) 2022  Ivan Teplov
     Copyright (c) 2022- Mitja Ševerkar
-->

<style>
    :root {
        --background: #000;
        --foreground: #fff;
        --divider: #333;
        --overlay: #888;
    }

    body {
        background: var(--background);
        color: var(--foreground);

        overflow: hidden;
        line-height: 1.5;

        -webkit-tap-highlight-color: transparent;
    }

    button {
        padding: 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        border: 0.0625rem solid var(--divider);

        background: var(--background);
        color: var(--foreground);
        cursor: pointer;
    }

    #sheet {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        visibility: visible;
        transition: opacity 0.5s, visibility 0.5s;
    }

    #sheet[aria-hidden="true"] {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    #sheet .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background: var(--overlay);
        opacity: 0.5;
    }

    #sheet .contents {
        border-radius: 1rem 1rem 0 0;

        background: var(--background);

        position: relative;
        overflow-y: hidden;

        --default-transitions: transform 0.5s, border-radius 0.5s;

        transition: var(--default-transitions);
        transform: translateY(0);

        max-height: 100vh;
        height: 50vh;

        width: 100vw;

        box-sizing: border-box;
        padding: 1rem;
        padding-top: 3rem;
    }

    #sheet .contents:not(.not-selectable) {
        transition: var(--default-transitions), height 0.5s;
    }

    #sheet .contents.fullscreen {
        border-radius: 0;
    }

    #sheet[aria-hidden="true"] .contents {
        transform: translateY(100%);
    }

    #sheet .draggable-area {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 3rem;
        margin: auto;
        padding: 1rem;
        cursor: grab;
    }

    #sheet .draggable-thumb {
        width: inherit;
        height: 0.25rem;
        background: var(--divider);
        border-radius: 0.125rem;
    }

    #sheet .close-sheet {
        position: absolute;
        right: 0;
        top: 0;
        border: none;
    }

    #sheet .body {
        height: 100%;
        overflow-y: auto;
        gap: 1rem;
    }
</style>

<main>
    <div id="sheet" class="column items-center justify-end" aria-hidden="true">
        <div class="overlay"></div>

        <div class="contents column">
            <header class="controls">
                <div class="draggable-area">
                    <div class="draggable-thumb"></div>
                </div>
                <button class="close-sheet" type="button" title="Close the sheet">&times;</button>
            </header>
            <slot style="width: 100vw;"></slot>
        </div>
    </div>
</main>

<script defer lang="ts">
    import {onMount} from "svelte";

    export let open;
    export let callback;

    const timer = ms => new Promise(res => setTimeout(res, ms))

    onMount(() => {
        console.log(document.children, document.getElementById("open-sheet"), document.getElementById("sheet"))
        const sheet = document.getElementById("sheet")
        const sheetContents = sheet.querySelector(".contents")
        const draggableArea = sheet.querySelector(".draggable-area")

        let sheetHeight // in vh

        const setSheetHeight = (value) => {
            sheetHeight = Math.max(0, Math.min(100, value))
            sheetContents.style.height = `calc(${sheetHeight}vh - 56px)`

            if (sheetHeight === 100) {
                sheetContents.classList.add("fullscreen")
            } else {
                sheetContents.classList.remove("fullscreen")
            }
        }

        const setIsSheetShown = (value) => {
            callback(value);
            sheet.setAttribute("aria-hidden", String(!value))
        }

        // Hide the sheet when clicking the 'close' button
        sheet.querySelector(".close-sheet").addEventListener("click", async () => {
            // let height = parseInt(sheetContents.style.height.toString().replace("vh", ""));
            // while (height > 0) {
            //     height = height - 2;
            //     setSheetHeight(height);
            //     await timer(20);
            // }
            // await timer(100);
            setIsSheetShown(false)
        })

        // Hide the sheet when clicking the background
        sheet.querySelector(".overlay").addEventListener("click", () => {
            setIsSheetShown(false)
        })

        const touchPosition = (event) =>
            event.touches ? event.touches[0] : event

        let dragPosition

        const onDragStart = (event) => {
            dragPosition = touchPosition(event).pageY
            sheetContents.classList.add("not-selectable")
            draggableArea.style.cursor = document.body.style.cursor = "grabbing"
        }

        const onDragMove = (event) => {
            if (dragPosition === undefined) return

            const y = touchPosition(event).pageY
            const deltaY = dragPosition - y
            const deltaHeight = deltaY / window.innerHeight * 100

            setSheetHeight(sheetHeight + deltaHeight)
            dragPosition = y
        }

        const onDragEnd = () => {
            dragPosition = undefined
            sheetContents.classList.remove("not-selectable")
            draggableArea.style.cursor = document.body.style.cursor = ""

            if (sheetHeight < 25) {
                setIsSheetShown(false)
            } else if (sheetHeight > 75) {
                setSheetHeight(100)
            } else {
                setSheetHeight(75)
            }
        }

        draggableArea.addEventListener("mousedown", onDragStart)
        draggableArea.addEventListener("touchstart", onDragStart)

        window.addEventListener("mousemove", onDragMove)
        window.addEventListener("touchmove", onDragMove)

        window.addEventListener("mouseup", onDragEnd)
        window.addEventListener("touchend", onDragEnd)

        setIsSheetShown(true);

        $: (() => {
            setIsSheetShown(open);
        })()
    })
</script>
