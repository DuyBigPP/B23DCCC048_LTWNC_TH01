import { useSyncExternalStore } from 'react'

type Listener = () => void

const DEFAULT_INTERVAL_MS = 60_000

const listeners = new Set<Listener>()
let currentTime = Date.now()
let timerId: ReturnType<typeof setInterval> | null = null

function tick(): void {
  currentTime = Date.now()
  for (const listener of listeners) listener()
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  if (timerId === null) timerId = setInterval(tick, DEFAULT_INTERVAL_MS)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }
}

function getSnapshot(): number {
  return currentTime
}

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
