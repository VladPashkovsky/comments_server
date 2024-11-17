const express = require('express')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 8000

const app = express()

app.use(cors({
  credentials: true,
  origin: [
    process.env.BASE_URL,
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_PREVIEW,
    process.env.CLIENT_LOCALHOST,
    process.env.DATABASE_URL,
    process.env.WD_HTTP,
    process.env.WD_HTTPS,
    process.env.WD_HTTP_PORT,
    process.env.WD_HTTPS_PORT,
    process.env.VITE_SERVER_ONE,
    process.env.VITE_SERVER_TWO,
  ],
}))

app.get('/', (req, res) => {
  res.send('Hello SERVER Comments')
})

const start = async (req, res) => {
  try {
    // await client.connect()
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()