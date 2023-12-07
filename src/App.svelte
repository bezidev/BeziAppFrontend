<script lang="ts">
	import {Router, Route, globalHistory, navigate} from "svelte-navigator";
	import Drawer from "./Drawer.svelte";
	import {AppContent} from "@smui/drawer";
	import Error from "./Widgets/Error.svelte";
	import {onDestroy, onMount} from "svelte";
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import isMobile from "is-mobile";
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import {enableNewTimetable, timetableDay} from "./stores";
	import * as emotion from "@emotion/css";
	const { css } = emotion;


	let open = false;

	let pathname = window.location.pathname;
	let unsub;
	let activeDay = "Ponedeljek";
	timetableDay.subscribe((value) => {
		activeDay = value;
	})

	let noviUrnik = localStorage.getItem("noviUrnik") === "true";

	let ttcss = css`
	/* ja, material je retarded */
	flex-basis: 0 !important;
	flex-grow: 1 !important;
	overflow: auto !important;
	height: calc(100vh - 64px - ${noviUrnik ? 48 : 0}px) !important;

	@media (max-width: 959px) and (orientation: landscape) {
	  height: calc(100vh - 48px - ${noviUrnik ? 48 : 0}px);
	}

	@media (max-width: 599px) {
	  height: calc(100vh - 56px - ${noviUrnik ? 48 : 0}px);
	}
	`;


	enableNewTimetable.subscribe((value) => {
		noviUrnik = value;
		ttcss = css`
		/* ja, material je retarded */
		flex-basis: 0 !important;
		flex-grow: 1 !important;
		overflow: auto !important;
		height: calc(100vh - 64px - ${noviUrnik ? 48 : 0}px) !important;

		@media (max-width: 959px) and (orientation: landscape) {
		  height: calc(100vh - 48px - ${noviUrnik ? 48 : 0}px);
		}

		@media (max-width: 599px) {
		  height: calc(100vh - 56px - ${noviUrnik ? 48 : 0}px);
		}
		`;
	});

	const mobile: boolean = isMobile();

	onMount(() => {
		let touchstartX = 0;
		let touchendX = 0;
		const distance = 110;

		function checkDirection() {
			console.log(touchstartX, touchendX)
			if (touchendX < touchstartX && distance < Math.abs(touchstartX-touchendX)) open = false
			if (touchendX > touchstartX && distance < Math.abs(touchstartX-touchendX) && touchstartX - 50 < 0) open = true
		}

		document.addEventListener('touchstart', e => {
			touchstartX = e.changedTouches[0].screenX
		})

		document.addEventListener('touchend', e => {
			touchendX = e.changedTouches[0].screenX
			checkDirection()
		})


		unsub = globalHistory.listen(({ location, action }) => {
			console.log(location, action);
			pathname = location.pathname;
		});
	});

	onDestroy(() => {
		unsub();
	});
</script>

<Router>
	<div class="flexy">
		{#if !(pathname === "/login" || pathname === "/lopolis/login")}
			<div class="top-app-bar-container flexor">
				<TopAppBar variant="static" style="background-color: rgba(0, 128, 83, 1);">
					<Row>
						<Section style="display: flex; flex-direction: row; align-items: center;">
							<IconButton style="margin: 0 0 0 0.5em;" class="material-icons" on:click={() => open=!open}>{#if open}close{:else}menu{/if}</IconButton>
							<Title>BežiApp</Title>
						</Section>
						<Section align="end" toolbar>
							<IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={() => {
								localStorage.clear();
								navigate("/login");
							}}>
								<div style="margin: 0 0 0 0.1em;">logout</div>
							</IconButton>
						</Section>
					</Row>
					{#if mobile && noviUrnik && (pathname === "/" || pathname === "")}
						<TabBar tabs={['Ponedeljek', 'Torek', 'Sreda', "Četrtek", "Petek"]} let:tab bind:active={activeDay}>
							<!-- Note: the `tab` property is required! -->
							<Tab {tab} on:click={() => {
								timetableDay.set(tab);
							}}>
								<Label>{tab}</Label>
							</Tab>
						</TabBar>
					{/if}
				</TopAppBar>
			</div>
		{/if}
		<div class="drawer-container" id="router" style="width: 100vw;">
			<Drawer open={open} statusFunction={(o) => open=o} />
				<div class={ttcss}>
					<AppContent class="app-content">
						<main class="main-content">
							<div>
								<Route path="/grades">
									{#await import("./Grades.svelte")}
									{:then Grades}
										<Grades.default />
									{:catch e}
										<Error error={e} />
									{/await}
								</Route>
								<Route path="/absences">
									{#await import("./Absences.svelte")}
									{:then Page}
										<Page.default />
									{:catch e}
										<Error error={e} />
									{/await}
								</Route>
							<Route path="/gradings">
								{#await import("./Gradings.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/teachers">
								{#await import("./Teachers.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/login">
								{#await import("./Login.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/lopolis/login">
								{#await import("./Login.svelte")}
								{:then Page}
									<Page.default loginType="lopolis" />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/lopolis">
								{#await import("./LoPolis.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/about">
								{#await import("./About.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/citing">
								{#await import("./Citing.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/tarot/contests">
								{#await import("./Tarot/Contests.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/tarot/contest/:id" let:params>
								{#await import("./Tarot/Contest.svelte")}
								{:then Page}
									<Page.default id={params.id} />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/tarot/contest/:id/games" let:params>
								{#await import("./Tarot/NewGame.svelte")}
								{:then Page}
									<Page.default id={params.id} />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/poker/contests">
								{#await import("./Poker/Contests.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/poker/contest/:id" let:params>
								{#await import("./Poker/Contest.svelte")}
								{:then Page}
									<Page.default id={params.id} />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/poker/contest/:id/games" let:params>
								{#await import("./Poker/NewGame.svelte")}
								{:then Page}
									<Page.default id={params.id} />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/tarot/rules">
								{#await import("./Tarot/Rules.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/notes">
								{#await import("./Notes.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/radio/new">
								{#await import("./NewSuggestion.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/radio">
								{#await import("./Radio.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/settings">
								{#await import("./Settings.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/developers">
								{#await import("./Developers.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/palette">
								{#await import("./Palette.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/notifications">
								{#await import("./Notifications.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/oauth2/:id" let:params>
								{#await import("./OAUTH2.svelte")}
								{:then Page}
									<Page.default id={params.id} />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/napaka">
								{#await import("./ErrorPage.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
							<Route path="/">
								{#await import("./Home.svelte")}
								{:then Page}
									<Page.default />
								{:catch e}
									<Error error={e} />
								{/await}
							</Route>
						</div>
					</main>
				</AppContent>
			</div>
		</div>
	</div>
</Router>
