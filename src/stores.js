import { writable, derived } from 'svelte/store'

export const isAriel = writable(true)
export const isAri = writable(false)
export const isYGRG = writable(false)
export const isText = writable(false)
export const showAbout = writable(false)
export const showProgram = writable(false)
export const showEvents = writable(false)
export const showReadings = writable(false)
export const loggedInUser = writable(false)

export const activeSection = derived(
    [isAriel, isAri, isYGRG], ([$isAriel, $isAri, $isYGRG]) => {
        if ($isAriel) return "ariel";
        if ($isAri) return "ari";
        if ($isYGRG) return "ygrg";
    }
)

export const postType = derived(
    [isAriel, isAri, isYGRG], ([$isAriel, $isAri, $isYGRG]) => {
        if ($isAriel) return "program";
        if ($isAri) return "readings";
        if ($isYGRG) return "events";
    }
)