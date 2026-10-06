import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import LocationsAPI from '../services/LocationsAPI'
import EventsAPI from '../services/EventsAPI'
import { isPast } from '../utils/dates'
import '../css/FilterBar.css'
import '../css/Locations.css'

const US_CENTER = [39.5, -98.35]

// re-zoom the map to whatever locations are currently shown
const FitToLocations = ({ locations }) => {
    const map = useMap()

    useEffect(() => {
        if (locations.length === 0) return
        const points = locations.map(location => [location.latitude, location.longitude])
        map.fitBounds(points, { padding: [60, 60], maxZoom: 11 })
    }, [locations, map])

    return null
}

const Locations = () => {
    const navigate = useNavigate()
    const [locations, setLocations] = useState([])
    const [events, setEvents] = useState([])

    const [search, setSearch] = useState('')
    const [state, setState] = useState('all')
    const [onlyUpcoming, setOnlyUpcoming] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                setLocations(await LocationsAPI.getAllLocations())
                setEvents(await EventsAPI.getAllEvents())
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [])

    const upcomingCount = (location) =>
        events.filter(event => event.location_id === location.id && !isPast(event.date)).length

    const states = [...new Set(locations.map(location => location.state))].sort()
    const terms = search.toLowerCase().split(/\s+/).filter(Boolean)

    const visibleLocations = locations
        .filter(location => state === 'all' || location.state === state)
        .filter(location => !onlyUpcoming || upcomingCount(location) > 0)
        .filter(location => {
            const text = [location.name, location.address, location.city, location.state, location.zip].join(' ').toLowerCase()
            return terms.every(term => text.includes(term))
        })

    const clearFilters = () => {
        setSearch('')
        setState('all')
        setOnlyUpcoming(false)
    }

    return (
        <div className='available-locations'>
            <div className='filter-bar'>
                <input
                    type='search'
                    placeholder='Search venue, city, state, address...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={state} onChange={(e) => setState(e.target.value)}>
                    <option value='all'>All states</option>
                    {states.map(code => <option key={code} value={code}>{code}</option>)}
                </select>

                <label>
                    <input
                        type='checkbox'
                        checked={onlyUpcoming}
                        onChange={(e) => setOnlyUpcoming(e.target.checked)}
                    />
                    Has upcoming events
                </label>

                <button className='secondary' onClick={clearFilters}>Clear</button>
            </div>

            <p className='results-count'>
                Showing {visibleLocations.length} of {locations.length} locations - click a pin to see its events
            </p>

            <MapContainer className='locations-map' center={US_CENTER} zoom={4} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />

                <FitToLocations locations={visibleLocations} />

                {visibleLocations.map(location =>
                    <CircleMarker
                        key={location.id}
                        center={[location.latitude, location.longitude]}
                        radius={12}
                        pathOptions={{ color: 'white', weight: 3, fillColor: '#d91df2', fillOpacity: 0.95 }}
                        eventHandlers={{ click: () => navigate(`/locations/${location.id}`) }}
                    >
                        <Tooltip direction='top' offset={[0, -10]}>
                            <strong>{location.city}, {location.state}</strong><br />
                            {location.name}<br />
                            {upcomingCount(location)} upcoming event{upcomingCount(location) === 1 ? '' : 's'}
                        </Tooltip>
                    </CircleMarker>
                )}
            </MapContainer>
        </div>
    )
}

export default Locations
