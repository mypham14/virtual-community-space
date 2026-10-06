const getAllLocations = async () => {
    try {
        const response = await fetch(`/api/locations`)
        return await response.json()
    } catch (error) {
        console.error('⚠️ error fetching locations', error)
        throw error
    }
}

const getLocationById = async (id) => {
    try {
        const response = await fetch(`/api/locations/${id}`)
        return await response.json()
    } catch (error) {
        console.error('⚠️ error fetching location', error)
        throw error
    }
}

export default { getAllLocations, getLocationById }
