const { MONGODB_URI } = require('./utils/config')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { errorHandler, requestLogger, tokenExtractor, userExtractor } = require('./utils/middleware')
const testingRouter = require('./controllers/testing')

// NOTE: Do not log url because it contains password
const destination = MONGODB_URI.includes('testBlogDB')
  ? 'TEST MongoDB'
  : 'PRODUCTION MongoDB'

logger.info('Connecting to', destination)
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to', destination)
  })
  .catch(error => {
    logger.error('ERROR: ', error)
  })

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

module.exports = app