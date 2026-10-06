export const isPast = (date, now = Date.now()) => new Date(date).getTime() < now

const pad = (n) => String(n).padStart(2, '0')

// "3d 04h 12m 09s" until the event
export const formatCountdown = (date, now = Date.now()) => {
    const total = Math.max(0, Math.floor((new Date(date).getTime() - now) / 1000))
    const days = Math.floor(total / 86400)
    const hours = Math.floor((total % 86400) / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60

    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
}

// "Ended 3 days ago"
export const formatTimeSince = (date, now = Date.now()) => {
    const seconds = Math.max(0, Math.floor((now - new Date(date).getTime()) / 1000))
    const days = Math.floor(seconds / 86400)

    if (days >= 1) return `Ended ${days} day${days === 1 ? '' : 's'} ago`
    const hours = Math.floor(seconds / 3600)
    if (hours >= 1) return `Ended ${hours} hour${hours === 1 ? '' : 's'} ago`
    return 'Ended just now'
}

export const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export const formatTime = (date) =>
    new Date(date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
