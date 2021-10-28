import { derived, Writable, writable } from "svelte/store"

export const sessionID = writable("")
export const clientJoined = writable(false)
export const gameStarted = writable(false)
export const gameOver = writable(false)
export const winner = writable("Nobody yet?")

export const clients = writable([])

export const readyToStart = derived(
  [clients, gameStarted],
  ([$clients, $gameStarted]) => $clients.length === 2 && !$gameStarted,
  false
)

export const ante = writable(0)
export const round = writable(0)

export const players = writable<Map<string, Writable<PlayerData>>>(new Map())

/**
 * Who won this round
 */
export const battleOutcome = writable("")
