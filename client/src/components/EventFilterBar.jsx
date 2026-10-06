import { defaultEventFilters } from '../utils/filterEvents'
import '../css/FilterBar.css'

// locations is optional: pass it to show the "location" dropdown
const EventFilterBar = ({ filters, setFilters, locations }) => {
    const update = (field) => (e) => setFilters({ ...filters, [field]: e.target.value })

    return (
        <div className='filter-bar'>
            <input
                type='search'
                placeholder='Search title, venue, city, date...'
                value={filters.search}
                onChange={update('search')}
            />

            {locations &&
                <select value={filters.locationId} onChange={update('locationId')}>
                    <option value='all'>All locations</option>
                    {locations.map(location =>
                        <option key={location.id} value={location.id}>{location.city} - {location.name}</option>
                    )}
                </select>
            }

            <select value={filters.status} onChange={update('status')}>
                <option value='all'>Upcoming &amp; past</option>
                <option value='upcoming'>Upcoming only</option>
                <option value='past'>Past only</option>
            </select>

            <select value={filters.sortBy} onChange={update('sortBy')}>
                <option value='date-asc'>Date: soonest first</option>
                <option value='date-desc'>Date: latest first</option>
                <option value='title'>Title: A to Z</option>
            </select>

            <button className='secondary' onClick={() => setFilters(defaultEventFilters)}>Clear</button>
        </div>
    )
}

export default EventFilterBar
