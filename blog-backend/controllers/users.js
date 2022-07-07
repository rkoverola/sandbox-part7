const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs')
  return response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
  if(!username || !password || username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password are required to be at least three characters long' })
  }
  const existingUser = await User.findOne({ username })
  if(existingUser) {
    return response.status(400).json({ error: 'Username is already in use' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash
  })
  const result = await newUser.save()
  return response.status(201).json(result)
})

module.exports = usersRouter