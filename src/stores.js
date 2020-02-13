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