import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import BlogCreationForm from './components/BlogCreationForm'
import LoginForm from './components/LoginForm'
import NotificationBar from './components/NotificationBar'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const blogCreationFormRef = useRef()

  useEffect( () => {
    async function getData() {
      const blogs = await blogService.getAll()
      sortByLikesAndSet(blogs)
    }
    getData()
  }, [])

  useEffect(() => {
    const existingLoggedUserJson = window.localStorage.getItem('loggedUser')
    if(existingLoggedUserJson) {
      const parsedUser = JSON.parse(existingLoggedUserJson)
      setUser(parsedUser)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  const flashNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => { setNotification('') }, 5000)
    setTimeout(() => { setNotificationType('') }, 5000)
  }

  const handleLogout = () => {
    console.log('Logging out')
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      console.log('Got user', user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.log('Got error', error)
      flashNotification('Invalid username or password','Error')
    }
  }

  const addBlog = (blogObject) => {
    blogService.create(blogObject)
      .then((addedBlog) => {
        console.log('Adding', addedBlog)
        console.log('To', blogs)
        sortByLikesAndSet(blogs.concat(addedBlog))
        blogCreationFormRef.current.toggleVisibility()
        flashNotification('Blog creation successful', 'Info')
      })
      .catch((error) => {
        console.log('Got error', error)
        flashNotification('Blog creation failed', 'Error')
      })
  }

  const removeBlog = (blog) => {
    const confirm = window.confirm(`Remove blog "${blog.title}"?`)
    if(confirm) {
      blogService.remove(blog.id)
        .then(() => {
          sortByLikesAndSet(blogs.filter(b => b.id !== blog.id))
          flashNotification('Blog removed successfully', 'Info')
        })
        .catch((error) => {
          console.log('Got error', error)
          flashNotification('Blog could not be removed', 'Error')
        })
    }
  }

  const addLike = (blogObject, id) => {
    console.log('Adding like to', blogObject)
    blogService.update(blogObject, id)
      .then(updatedBlog => {
        const blogsCopy = blogs.slice()
        const replaceIndex = blogsCopy.findIndex(b => b.id === id)
        const modifiedBlogs = blogsCopy.fill(updatedBlog, replaceIndex, replaceIndex + 1)
        sortByLikesAndSet(modifiedBlogs)
      })
      .catch((error) => {
        console.log('Got error', error)
        flashNotification('Like operation failed', 'Error')
      })
  }

  const sortByLikesAndSet = (blogs) => {
    const sorted = blogs.sort((a, b) => b.likes - a.likes)
    setBlogs(sorted)
  }

  const handleUsernameChange = ({ target }) => { setUsername(target.value) }
  const handlePasswordChange = ({ target }) => { setPassword(target.value) }

  if(user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <NotificationBar message={notification} type={notificationType} />
        <LoginForm
          handleLoginSubmit={handleLoginSubmit}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <NotificationBar message={notification} type={notificationType} />
      <div>
        {user.name} is logged in
        <button onClick={handleLogout} >Log out</button>
      </div>
      <h2>Create new</h2>
      <div>
        <Togglable buttonText={'Create new'} ref={blogCreationFormRef} >
          <BlogCreationForm addBlog={addBlog} />
        </Togglable>
      </div>
      <table>
        {blogs.map(blog => {
          return <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
            currentUser={user}
          />
        } )}
      </table>
    </div>
  )
}

export default App
