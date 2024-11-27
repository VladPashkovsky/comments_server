const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { Client } = require('pg')
const cors = require('cors')
const errorMiddleware = require('./middlewares/error-middleware')
require('dotenv').config()

const PORT = process.env.PORT || 8000

const client = new Client({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DBNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  port: process.env.POSTGRESQL_PORT,
})

const usersRouter = require('./routes/users')
const commentsRouter = require('./routes/comments')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.BASE_URL,
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_PREVIEW,
      process.env.COMMENTS_URL
    ],
  })
)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
app.use(errorMiddleware)

app.get('/api', (req, res) => {
  res.send('Hello SERVER Comments')
})

const start = async (req, res) => {
  try {
    await client.connect()
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
