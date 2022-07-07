let _ = require('lodash')

const dummy = () => {
  return 1
}

// NOTE: It was a stupid idea to do this with higher order functions tbh, you like that readability?
const mostBlogs = (blogs) => {
  const grouped = _.groupBy(blogs, b => b.author)
  const blogsByAuthor = _.mapValues(grouped, v => v.length)
  const blogsByAuthorArray = Object.entries(blogsByAuthor)
  const rankedAuthors = blogsByAuthorArray.sort((a, b) => b[1] - a[1])
  const bestAuthor = _.head(rankedAuthors)
  return { author: bestAuthor[0], blogs: bestAuthor[1] }
}

// NOTE: You will pay for this sinful implementation
const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs, b => b.author)
  const likesByAuthor = _.mapValues(grouped, v => _.sum(v.map(o => o.likes)))
  const likesByAuthorArray = Object.entries(likesByAuthor)
  const rankedAuthors = likesByAuthorArray.sort((a, b) => b[1] - a[1])
  const bestAuthor = _.head(rankedAuthors)
  return { author: bestAuthor[0], likes: bestAuthor[1] }
}

const totalLikes = (blogs) => {
  const likes = blogs.map(b => b.likes)
  const sum = _.sum(likes)
  return sum
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    throw new TypeError('Cannot find favorite in empty list')
  }
  let blogCopy = [...blogs]
  blogCopy.sort((a, b) => b.likes - a.likes)
  return blogCopy[0]
}

const listHelper = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
module.exports = listHelper