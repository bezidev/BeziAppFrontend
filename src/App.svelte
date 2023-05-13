<script lang="ts">
	import {Router, Route, globalHistory, navigate} from "svelte-navigator";
	import Drawer from "./Drawer.svelte";
	import {AppContent, Scrim} from "@smui/drawer";
	import Error from "./Widgets/Error.svelte";
	import {onDestroy, onMount} from "svelte";
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Grades from "./Grades.svelte";
	import Absences from "./Absences.svelte";
	import Gradings from "./Gradings.svelte";
	import Login from "./Login.svelte";
	import LoPolis from "./LoPolis.svelte";
	import About from "./About.svelte";
	import Contests from "./Tarot/Contests.svelte";
	import Contest from "./Tarot/Contest.svelte";
	import NewGame from "./Tarot/NewGame.svelte";
	import Rules from "./Tarot/Rules.svelte";
	import Notes from "./Notes.svelte";
	import Radio from "./Radio.svelte";
	import ErrorPage from "./ErrorPage.svelte";
	import Home from "./Home.svelte";
	import NewSuggestion from "./NewSuggestion.svelte";

	let open = false;

	let pathname = window.location.pathname;
	let unsub;
	onMount(() => {
		let touchstartX = 0;
		let touchendX = 0
		const distance = 110;

		function checkDirection() {
			console.log(touchstartX, touchendX)
			if (touchendX < touchstartX && distance < Math.abs(touchstartX-touchendX)) open = false
			if (touchendX > touchstartX && distance < Math.abs(touchstartX-touchendX) && touchstartX - 20 < 0) open = true
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
	{#if !(pathname === "/login" || pathname === "/lopolis/login")}
		<TopAppBar variant="static" style="background-color: rgba(0, 128, 83, 1);">
			<Row>
				<Section style="display: flex; flex-direction: row; align-items: center;">
					<IconButton style="margin: 0 0 0 0.5em;" class="material-icons" on:click={() => open=!open}>{#if open}close{:else}menu{/if}</IconButton>
					<Title>BežiApp</Title>
				</Section>
				<Section align="end" toolbar>
					<IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={() => {
						document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
						localStorage.clear();
						navigate("/login");
					}}>
						<div style="margin: 0 0 0 0.1em;">logout</div>
					</IconButton>
				</Section>
			</Row>
		</TopAppBar>
	{/if}
	<div class="drawer-container" id="router">
		<Drawer open={open} statusFunction={(o) => open=o} />
		<AppContent class="app-content">
			<main class="main-content">
				<div>
					<Route path="/grades">
						<Grades />
					</Route>
					<Route path="/absences">
						<Absences />
					</Route>
					<Route path="/gradings">
						<Gradings />
					</Route>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/lopolis/login">
						<Login loginType="lopolis" />
					</Route>
					<Route path="/lopolis">
						<LoPolis />
					</Route>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/tarot/contests">
						<Contests />
					</Route>
					<Route path="/tarot/contest/:id" let:params>
						<Contest id={params.id} />
					</Route>
					<Route path="/tarot/contest/:id/games" let:params>
						<NewGame id={params.id} />
					</Route>
					<Route path="/tarot/rules">
						<Rules />
					</Route>
					<Route path="/notes">
						<Notes />
					</Route>
					<Route path="/radio/new">
						<NewSuggestion />
					</Route>
					<Route path="/radio">
						<Radio />
					</Route>
					<Route path="/napaka">
						<ErrorPage />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</div>
			</main>
		</AppContent>
	</div>
</Router>
