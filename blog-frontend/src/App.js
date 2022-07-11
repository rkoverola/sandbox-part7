import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import BlogCreationForm from "./components/BlogCreationForm";
import LoginForm from "./components/LoginForm";
import NotificationBar from "./components/NotificationBar";
import { setNotification } from "./reducers/notificationSlice";
import { setBlogs } from "./reducers/blogSlice";
import { setUser } from "./reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  // TODO: Move most of this logic to the blogReducer?
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogCreationFormRef = useRef();

  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getData() {
      const blogs = await blogService.getAll();
      sortByLikesAndSet(blogs);
    }
    getData();
  }, []);

  useEffect(() => {
    const existingLoggedUserJson = window.localStorage.getItem("loggedUser");
    if (existingLoggedUserJson) {
      const parsedUser = JSON.parse(existingLoggedUserJson);
      dispatch(setUser(parsedUser));
      blogService.setToken(parsedUser.token);
    }
  }, []);

  const flashNotification = (message, type) => {
    const notif = { message, type };
    dispatch(setNotification(notif));
    setTimeout(() => {
      dispatch(
        setNotification({
          message: "",
          type: "Info",
        })
      );
    }, 5000);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    dispatch(setUser(null));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log("Got error", error);
      flashNotification("Invalid username or password", "Error");
    }
  };

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((addedBlog) => {
        console.log("Adding", addedBlog);
        console.log("To", blogs);
        sortByLikesAndSet(blogs.concat(addedBlog));
        blogCreationFormRef.current.toggleVisibility();
        flashNotification("Blog creation successful", "Info");
      })
      .catch((error) => {
        console.log("Got error", error);
        flashNotification("Blog creation failed", "Error");
      });
  };

  const removeBlog = (blog) => {
    const confirm = window.confirm(`Remove blog "${blog.title}"?`);
    if (confirm) {
      blogService
        .remove(blog.id)
        .then(() => {
          sortByLikesAndSet(blogs.filter((b) => b.id !== blog.id));
          flashNotification("Blog removed successfully", "Info");
        })
        .catch((error) => {
          console.log("Got error", error);
          flashNotification("Blog could not be removed", "Error");
        });
    }
  };

  const addLike = (blogObject, id) => {
    console.log("Adding like to", blogObject);
    blogService
      .update(blogObject, id)
      .then((updatedBlog) => {
        const blogsCopy = blogs.slice();
        const replaceIndex = blogsCopy.findIndex((b) => b.id === id);
        const modifiedBlogs = blogsCopy.fill(
          updatedBlog,
          replaceIndex,
          replaceIndex + 1
        );
        sortByLikesAndSet(modifiedBlogs);
      })
      .catch((error) => {
        console.log("Got error", error);
        flashNotification("Like operation failed", "Error");
      });
  };

  const sortByLikesAndSet = (blogs) => {
    const sorted = blogs.sort((a, b) => b.likes - a.likes);
    const action = setBlogs(sorted);
    console.log("Dispatching setBlogs", action);
    dispatch(action);
  };

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value);
  };
  const handlePasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <NotificationBar />
        <LoginForm
          handleLoginSubmit={handleLoginSubmit}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      </div>
    );
  }
  return (
    <div>
      <h2>Blogs</h2>
      <NotificationBar />
      <div>
        {user.name} is logged in
        <button onClick={handleLogout}>Log out</button>
      </div>
      <h2>Create new</h2>
      <div>
        <Togglable buttonText={"Create new"} ref={blogCreationFormRef}>
          <BlogCreationForm addBlog={addBlog} />
        </Togglable>
      </div>
      <table>
        <tbody>
          {blogs.map((blog) => {
            return (
              <Blog
                key={blog.id}
                blog={blog}
                addLike={addLike}
                removeBlog={removeBlog}
                currentUser={user}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
