const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })

  const passwordIsCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash.toString())

  if(!passwordIsCorrect) {
    return response.status(401).json({ error: 'Incorrect username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)
  return response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter