const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  logger.error(error)
  if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })
  }
  next(error)
}

const requestLogger = (request, response, next) => {
  logger.info('Got request')
  logger.info(request.method)
  logger.info(request.path)
  logger.info(request.body)
  logger.info('-----')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    request.token = token
  }
  next()
}

// NOTE: Async middleware?
const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    if(user) {
      request.user = user
    }
  }
  next()
}

const middleware = { errorHandler, requestLogger, tokenExtractor, userExtractor }
module.exports = middleware