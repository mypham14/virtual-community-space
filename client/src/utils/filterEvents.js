import { isPast, formatDate } from './dates'

export const defaultEventFilters = {
    search: '',
    locationId: 'all',
    status: 'all',
    sortBy: 'date-asc'
}

// everything about an event that the search box can match
const searchText = (event) =>
    [
        event.title,
        event.location_name,
        event.address,
        event.city,
        event.state,
        event.zip,
        formatDate(event.date),
        isPast(event.date) ? 'past passed' : 'upcoming'
    ].join(' ').toLowerCase()

export const filterEvents = (events, filters) => {
    const terms = filters.search.toLowerCase().split(/\s+/).filter(Boolean)

    return events
        .filter(event => filters.locationId === 'all' || event.location_id === Number(filters.locationId))
        .filter(event => filters.status === 'all' || (filters.status === 'past') === isPast(event.date))
        .filter(event => terms.every(term => searchText(event).includes(term)))
        .sort((a, b) => {
            if (filters.sortBy === 'title') return a.title.localeCompare(b.title)
            const diff = new Date(a.date) - new Date(b.date)
            return filters.sortBy === 'date-desc' ? -diff : diff
        })
}
