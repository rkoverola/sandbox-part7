const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./api_helper')

const api = supertest(app)

describe('given database with existing blogs', () => {

  beforeEach( async () => {
    await Blog.deleteMany({})
    for(let blog of helper.initialBlogs) {
      const blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('when getting all then should return all blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('when getting all then id property should be defined for all', async () => {
    const blogs = await helper.blogsInDb()
    for(let blog of blogs) {
      const processedBlog = JSON.parse(JSON.stringify(blog))
      expect(processedBlog.id).toBeDefined()
    }
  })

})

// NOTE: These tests are dependent on other functionality working
// TODO: Use mocking or something?
describe('given empty database with valid user', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const aliceUser = {
      username: 'alice',
      password: 'aliceisbest',
      name: 'Alice'
    }
    await api
      .post('/api/users')
      .send(aliceUser)
      .expect(201)

  })

  test('when posting a valid blog by valid user then should add blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const validBlog = {
      title: 'Testing is fun',
      author: 'Supertest',
      url: 'www.test.com',
      likes: 150
    }

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'alice', password: 'aliceisbest' })
      .expect(200)
    const token = loginResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Testing is fun')
  })

  test('when posting a blog with missing likes then should save with default 0', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const invalidBlog = {
      title: 'This post has no likes',
      author: 'Supertest',
      url: 'www.test.com'
    }

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'alice', password: 'aliceisbest' })
      .expect(200)
    const token = loginResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    const addedBlog = blogsAtEnd.find(b => b.title === 'This post has no likes')
    expect(addedBlog.likes).toBe(0)
  })

  test('when posting a blog with missing title and url then yields code 400', async () => {
    const invalidBlog = {
      author: 'Dumbass',
    }

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'alice', password: 'aliceisbest' })
      .expect(200)
    const token = loginResponse.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(invalidBlog)
      .expect(400)
  })

  test('when deleting a specific post with valid user then should delete from database', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'alice', password: 'aliceisbest' })
      .expect(200)
    const token = loginResponse.body.token

    const validBlog = {
      title: 'Testing is fun',
      author: 'Supertest',
      url: 'www.test.com',
      likes: 150
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validBlog)
      .expect(201)
    const idToDelete = postResponse.body.id

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(idToDelete)
  })

  test('when updating a specific post then should update in database', async () => {

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'alice', password: 'aliceisbest' })
      .expect(200)
    const token = loginResponse.body.token

    const validBlog = {
      title: 'Testing is fun',
      author: 'Supertest',
      url: 'www.test.com',
      likes: 150
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(validBlog)
      .expect(201)

    // NOTE: This test was changed because post now populates response
    const blogToUpdate = {
      id: postResponse.body.id,
      title: postResponse.body.title,
      author: postResponse.body.author,
      url: postResponse.body.url,
      likes: 69,
      user: postResponse.body.user.id
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogAtEnd = await Blog.findById(blogToUpdate.id)
    expect(blogAtEnd.likes).toBe(69)
  })

  test('when posting valid blog with invalid token then should throw 401', async () => {
    const validBlog = {
      title: 'Testing is fun',
      author: 'Supertest',
      url: 'www.test.com',
      likes: 150
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'invalid token')
      .send(validBlog)
      .expect(401)
  })
})

afterAll( () => {
  mongoose.connection.close()
})