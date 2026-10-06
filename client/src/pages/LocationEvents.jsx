import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Event from '../components/Event'
import EventFilterBar from '../components/EventFilterBar'
import LocationsAPI from '../services/LocationsAPI'
import EventsAPI from '../services/EventsAPI'
import { filterEvents, defaultEventFilters } from '../utils/filterEvents'
import '../css/LocationEvents.css'

const LocationEvents = () => {
    const { id } = useParams()
    const locationId = Number(id)

    const [location, setLocation] = useState({})
    const [events, setEvents] = useState([])
    const [filters, setFilters] = useState(defaultEventFilters)

    useEffect(() => {
        (async () => {
            try {
                const locationData = await LocationsAPI.getLocationById(locationId)
                setLocation(locationData)

                setEvents(await EventsAPI.getEventsByLocation(locationId))
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [locationId])

    const visibleEvents = filterEvents(events, filters)

    return (
        <div className='location-events'>
            <header>
                <div className='location-image'>
                    <img src={location.image} />
                </div>

                <div className='location-info'>
                    <h2>{location.name}</h2>
                    <p>{location.address}, {location.city}, {location.state} {location.zip}</p>
                </div>
            </header>

            <div className='location-filters'>
                <EventFilterBar filters={filters} setFilters={setFilters} />
                <p className='results-count'>
                    Showing {visibleEvents.length} of {events.length} events
                </p>
            </div>

            <main>
                {
                    visibleEvents.length > 0 ? visibleEvents.map((event) =>
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            image={event.image}
                        />
                    ) : <h2><i className="fa-regular fa-calendar-xmark fa-shake"></i> {events.length > 0 ? 'No events match your filters!' : 'No events scheduled at this location yet!'}</h2>
                }
            </main>
        </div>
    )
}

export default LocationEvents
