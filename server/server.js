import express from 'express'
import './config/dotenv.js'
import eventsRouter from './routes/events.js'
import locationsRouter from './routes/locations.js'
import cors from 'cors'

// Initialize the Express application
const app = express()

app.use(cors())

// Add the events and locations endpoints to the app 
app.use('/api/events', eventsRouter)
app.use('/api/locations', locationsRouter)

// Define a route for the root URL
app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">TechTrail API</h1>')
})

// Start the server and listen on port 3002
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})

