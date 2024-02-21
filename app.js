require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./routes/user-routes')
const errorMiddleware = require('./middlewares/error-middleware')

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
)
app.use('/api', router)
app.use(errorMiddleware)

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db Connected'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
