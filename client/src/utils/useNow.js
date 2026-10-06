import { useSyncExternalStore } from 'react'

// one shared 1-second timer for every component that shows a countdown,
// instead of one setInterval per event card
let now = Date.now()
let timer = null
const listeners = new Set()

const subscribe = (listener) => {
    listeners.add(listener)

    if (!timer) {
        now = Date.now()
        timer = setInterval(() => {
            now = Date.now()
            listeners.forEach(notify => notify())
        }, 1000)
    }

    return () => {
        listeners.delete(listener)

        if (listeners.size === 0) {
            clearInterval(timer)
            timer = null
        }
    }
}

export const useNow = () => useSyncExternalStore(subscribe, () => now)
