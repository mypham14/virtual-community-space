import './dotenv.js' // must load first so process.env is set before the pool is created
import { pool } from './database.js'
import locationData from '../data/locations.js'
import eventData from '../data/events.js'

const createTables = async () => {
    const createTablesQuery = `
        DROP TABLE IF EXISTS events;
        DROP TABLE IF EXISTS locations;

        CREATE TABLE locations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            state VARCHAR(2) NOT NULL,
            zip VARCHAR(10) NOT NULL,
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL,
            image VARCHAR(255) NOT NULL
        );

        CREATE TABLE events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            date TIMESTAMP NOT NULL,
            image VARCHAR(255) NOT NULL,
            location_id INTEGER NOT NULL REFERENCES locations(id)
        );

        CREATE INDEX idx_events_location_id ON events(location_id);
    `

    try {
        await pool.query(createTablesQuery)
        console.log('🎉 locations and events tables created successfully')
    } catch (err) {
        console.error('⚠️ error creating tables', err)
        throw err
    }
}

const seedLocationsTable = async () => {
    for (const location of locationData) {
        const insertQuery = {
            text: 'INSERT INTO locations (name, address, city, state, zip, latitude, longitude, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [
                location.name,
                location.address,
                location.city,
                location.state,
                location.zip,
                location.latitude,
                location.longitude,
                location.image
            ]
        }

        try {
            await pool.query(insertQuery)
            console.log(`✅ ${location.name} added successfully`)
        } catch (err) {
            console.error('⚠️ error inserting location', err)
        }
    }
}

const seedEventsTable = async () => {
    for (const event of eventData) {
        const insertQuery = {
            text: 'INSERT INTO events (title, date, image, location_id) VALUES ($1, $2, $3, $4)',
            values: [
                event.title,
                event.date,
                event.image,
                event.location_id
            ]
        }

        try {
            await pool.query(insertQuery)
            console.log(`✅ ${event.title} added successfully`)
        } catch (err) {
            console.error('⚠️ error inserting event', err)
        }
    }
}

const resetDatabase = async () => {
    try {
        await createTables()
        // locations first: events.location_id references locations(id)
        await seedLocationsTable()
        await seedEventsTable()
    } finally {
        await pool.end()
    }
}

resetDatabase()
