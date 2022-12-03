<script lang="ts">
	import {Router, Route, globalHistory} from "svelte-navigator";
	import Drawer from "./Drawer.svelte";
	import {AppContent, Scrim} from "@smui/drawer";
	import Error from "./Widgets/Error.svelte";
	import {Icon, Label} from "@smui/button";
	import isMobile from "is-mobile";
	import Button from "@smui/button";
	import {onDestroy, onMount} from "svelte";

	const mobile = isMobile();
	let open = !mobile;

	let pathname = window.location.pathname;
	let unsub;
	onMount(() => {
		unsub = globalHistory.listen(({ location, action }) => {
			console.log(location, action);
			pathname = location.pathname;
		});
	});
	onDestroy(() => {
		unsub();
	});
</script>

<div class="drawer-container">
	<Router let:location>
		<Drawer open={open} statusFunction={(o) => open=o} />
		<AppContent class="app-content">
			<main class="main-content">
				{#if mobile && !(pathname === "/login")}
					<Button on:click={() => open = !open}>
						<Icon class="material-icons">menu_open</Icon>
						{#if open}
							<Label>Zapri navigacijo</Label>
						{:else}
							<Label>Odpri navigacijo</Label>
						{/if}
					</Button>
				{/if}
				<div>
					<Route path="/grades">
						{#await import('./Grades.svelte') then Grades}
							<Grades.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/absences">
						{#await import('./Absences.svelte') then Absences}
							<Absences.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/gradings">
						{#await import('./Gradings.svelte') then Gradings}
							<Gradings.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/login">
						{#await import('./Login.svelte') then Login}
							<Login.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/lopolis/login">
						{#await import('./Login.svelte') then Login}
							<Login.default loginType="lopolis" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/lopolis">
						{#await import('./LoPolis.svelte') then LoPolis}
							<LoPolis.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/about">
						{#await import('./About.svelte') then About}
							<About.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/notes">
						{#await import('./Notes.svelte') then Notes}
							<Notes.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/napaka">
						{#await import('./ErrorPage.svelte') then ErrorPage}
							<ErrorPage.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/">
						{#await import('./Home.svelte') then Home}
							<Home.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
				</div>
			</main>
		</AppContent>
	</Router>
</div>
