const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const user = request.user
  if(!user) {
    return response.status(401).json({ error: 'Invalid token' })
  }
  const blogObject = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  }
  const blog = new Blog(blogObject)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const populatedBlog = await savedBlog.populate('user')
  response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if(!user) {
    return response.status(401).json({ error: 'Invalid token' })
  }
  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    user.blogs = user.blogs.filter(b => b._id.toString() !== request.params.id)
    await user.save()
    return response.status(204).end()
  }
  if(blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(b => b._id.toString() !== request.params.id)
    await user.save()
    return response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Only creator of blog can delete it' })
  }
})

// FIXME: This can be done without authorization
// NOTE: FindByIdAndUpdate returns object before it was changed in response by default
blogRouter.put('/:id', async (request, response) => {
  const options = { returnDocument: 'after' }
  const result = await Blog
    .findByIdAndUpdate(request.params.id, request.body, options)
    .populate('user')
  response.json(result)
})

module.exports = blogRouter