import { useState, useEffect } from 'react'
import Event from '../components/Event'
import EventFilterBar from '../components/EventFilterBar'
import EventsAPI from '../services/EventsAPI'
import LocationsAPI from '../services/LocationsAPI'
import { filterEvents, defaultEventFilters } from '../utils/filterEvents'
import '../css/Events.css'

const Events = () => {
    const [events, setEvents] = useState([])
    const [locations, setLocations] = useState([])
    const [filters, setFilters] = useState(defaultEventFilters)

    useEffect(() => {
        (async () => {
            try {
                setEvents(await EventsAPI.getAllEvents())
                setLocations(await LocationsAPI.getAllLocations())
            }
            catch (error) {
                throw error
            }
        }) ()
    }, [])

    const visibleEvents = filterEvents(events, filters)

    return (
        <div className='all-events'>
            <EventFilterBar filters={filters} setFilters={setFilters} locations={locations} />

            <p className='results-count'>
                Showing {visibleEvents.length} of {events.length} events
            </p>

            <main>
                {
                    visibleEvents.length > 0 ? visibleEvents.map(event =>
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            image={event.image}
                            locationName={event.location_name}
                        />
                    ) : <h2><i className="fa-regular fa-calendar-xmark fa-shake"></i> {'No events match your filters!'}</h2>
                }
            </main>
        </div>
    )
}

export default Events
