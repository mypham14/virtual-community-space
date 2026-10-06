import { pool } from '../config/database.js'

// events joined with the location they belong to
const EVENTS_WITH_LOCATION = `
    SELECT events.*,
           locations.name AS location_name,
           locations.address,
           locations.city,
           locations.state,
           locations.zip
    FROM events
    JOIN locations ON events.location_id = locations.id`

const getEvents = async (req, res) => {
    try {
        const results = await pool.query(EVENTS_WITH_LOCATION + ' ORDER BY events.id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const getEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId
        const results = await pool.query('SELECT * FROM events WHERE id = $1', [eventId])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const getEventsByLocation = async (req, res) => {
    try {
        const locationId = req.params.locationId
        const results = await pool.query(
            EVENTS_WITH_LOCATION + ' WHERE locations.id = $1 ORDER BY events.date ASC',
            [locationId]
        )
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

export default {
  getEvents,
  getEventById,
  getEventsByLocation
}
