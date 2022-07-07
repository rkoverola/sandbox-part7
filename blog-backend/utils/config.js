require('dotenv').config()

const mongodb_uri = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const config = {
  'MONGODB_URI': mongodb_uri,
  'PORT': process.env.PORT
}

module.exports = config
