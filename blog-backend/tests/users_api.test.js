const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./api_helper')

const api = supertest(app)

describe('given empty database', () => {

  beforeEach( async () => {
    await User.deleteMany({})
  })

  test('then should be able to post valid user', async () => {
    const validUser = {
      username: 'jtest',
      password: 'testisbest',
      name: 'Juha Test'
    }
    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    const names = usersAtEnd.map(u => u.username)
    expect(names).toContain('jtest')
  })

  test('then posting too short username should throw 400', async () => {
    const usersAtStart = await helper.usersInDb()
    const invalidUser = {
      username: 'li',
      password: 'pleasedontberacist',
      name: 'Chun Li'
    }
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('then posting too short password should throw 400', async () => {
    const usersAtStart = await helper.usersInDb()
    const invalidUser = {
      username: 'jtest',
      password: 'p',
      name: 'Jaska Test'
    }
    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('then posting duplicate username should throw 400', async () => {
    const validUser = {
      username: 'darian',
      password: 'darianisbest',
      name: 'Darian Test'
    }
    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/users')
      .send(validUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const dariansInDb = await User.find({ username:'darian' })
    expect(dariansInDb).toHaveLength(1)
  })
})