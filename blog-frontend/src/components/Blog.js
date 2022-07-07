import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, removeBlog, currentUser }) => {

  const [minimized, setMinimized] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const additionalInfoStyle = minimized
    ? { display: 'none' }
    : { display: '' }

  const buttonText = minimized
    ? 'View'
    : 'Hide'

  const toggleMinimized = () => { setMinimized(!minimized) }

  const handleLikeClick = () => {
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    addLike(blogObject, blog.id)
  }

  const handleRemoveClick = () => {
    removeBlog(blog)
  }

  const addRemoveButton = () => {
    if(blog.user.username === currentUser.username) {
      return (
        <button onClick={handleRemoveClick} className='removeButton' >Remove</button>
      )
    }
  }

  return (
    <tr style={blogStyle} >
      <div className='blogInfo'>
        {blog.title} {blog.author}
        <button
          onClick={toggleMinimized}
          className='toggleMinimizedButton'
        >
          {buttonText}
        </button>
      </div>
      <div className='additionalBlogInfo' style={additionalInfoStyle} >
        <div>{blog.url}</div>
        <div>
        Likes: {blog.likes}
          <button
            onClick={handleLikeClick}
            className='likeButton'
          >
            Like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <div>{addRemoveButton()}</div>
      </div>
    </tr>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog