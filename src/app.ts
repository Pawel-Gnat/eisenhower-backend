import express from 'express'
import cors from 'cors'
import compression from 'compression'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import router from './router'

const MONGO_URL = `${process.env.DATABASE_URL}`
const PORT = `${process.env.PORT}` || 8080
const ORIGIN_URL = `${process.env.ORIGIN_URL}` || `http://localhost:${PORT}`

if (!process.env.ACCESS_TOKEN_SECRET) {
	throw new Error('Token is not defined')
}

const app = express()

app.use(
	cors({
		origin: `${ORIGIN_URL}`,
		credentials: true,
	})
)

app.use(compression())
app.use(cookieParser())
app.use(express.json())

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
})

mongoose
	.connect(MONGO_URL)
	.then(() => {
		console.log('Connected to MongoDB - on connect')
	})
	.catch(error => {
		console.error('Error connecting to MongoDB:', error)
	})

const db = mongoose.connection

db.on('error', error => {
	console.error('MongoDB connection error:', error)
})

db.once('open', () => {
	console.log('Connected to MongoDB - on open, once')
})

db.on('disconnected', () => {
	console.log('Disconnected from MongoDB')
})

app.use('/', router())
