import {writable} from "svelte/store";
import isMobile from "is-mobile";

export const svelteLoc = writable("/");
export const timetableDay = writable("Ponedeljek");
export const enableNewTimetable = writable(isMobile() && localStorage.getItem("noviUrnik") === "true");

