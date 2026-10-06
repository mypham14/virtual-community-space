const getAllEvents = async () => {
    try {
        const response = await fetch(`/api/events`)
        return await response.json()
    } catch (error) {
        console.error('⚠️ error fetching events', error)
        throw error
    }
}

const getEventById = async (id) => {
    try {
        const response = await fetch(`/api/events/${id}`)
        return await response.json()
    } catch (error) {
        console.error('⚠️ error fetching event', error)
        throw error
    }
}

const getEventsByLocation = async (locationId) => {
    try {
        const response = await fetch(`/api/locations/${locationId}/events`)
        return await response.json()
    } catch (error) {
        console.error('⚠️ error fetching events for location', error)
        throw error
    }
}

export default { getAllEvents, getEventById, getEventsByLocation }
