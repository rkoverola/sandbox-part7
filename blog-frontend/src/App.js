import { useState, useEffect, useRef } from "react";
import { Routes, Route, useMatch } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import NotificationBar from "./components/NotificationBar";
import Users from "./components/Users";
import User from "./components/User";

import { flashNotification } from "./reducers/notificationSlice";
import { initializeBlogs, setBlogs } from "./reducers/blogSlice";
import { setUser } from "./reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";

import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogPage from "./components/BlogPage";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogCreationFormRef = useRef();

  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // TODO: Get users in app to pass to users and user component, or move to store
  const userMatch = useMatch("/users/:id");
  const userPageId = userMatch ? userMatch.params.id : null;

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const existingLoggedUserJson = window.localStorage.getItem("loggedUser");
    if (existingLoggedUserJson) {
      const parsedUser = JSON.parse(existingLoggedUserJson);
      dispatch(setUser(parsedUser));
      blogService.setToken(parsedUser.token);
    }
  }, []);

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
      dispatch(flashNotification("Invalid username or password", "Error"));
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
        dispatch(flashNotification("Blog creation successful", "Info"));
      })
      .catch((error) => {
        console.log("Got error", error);
        dispatch(flashNotification("Blog creation failed", "Error"));
      });
  };

  const removeBlog = (blog) => {
    const confirm = window.confirm(`Remove blog "${blog.title}"?`);
    if (confirm) {
      blogService
        .remove(blog.id)
        .then(() => {
          sortByLikesAndSet(blogs.filter((b) => b.id !== blog.id));
          dispatch(flashNotification("Blog removed successfully", "Info"));
        })
        .catch((error) => {
          console.log("Got error", error);
          dispatch(flashNotification("Blog could not be removed", "Error"));
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
        dispatch(flashNotification("Like operation failed", "Error"));
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
      <Routes>
        <Route
          path="/"
          element={
            <BlogPage
              blogCreationFormRef={blogCreationFormRef}
              addBlog={addBlog}
              addLike={addLike}
              removeBlog={removeBlog}
            />
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User id={userPageId} />} />
      </Routes>
    </div>
  );
};

export default App;
