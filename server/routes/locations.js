import express from 'express'
import LocationsController from '../controllers/locations.js'
import EventsController from '../controllers/events.js'


// Create a new router instance
const router = express.Router()

// Define a route to get all locations
router.get('/', LocationsController.getLocations)

// Define a route to get all events at one location (joins events with locations)
router.get('/:locationId/events', EventsController.getEventsByLocation)

// Define a route to get a specific location by its ID
router.get('/:locationId', LocationsController.getLocationById)

export default router
