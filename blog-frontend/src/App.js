import { useState, useEffect, useRef } from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import { Typography, Box } from "@mui/material";

import LoginForm from "./components/LoginForm";
import NotificationBar from "./components/NotificationBar";
import Users from "./components/Users";
import User from "./components/User";
import Blog from "./components/Blog";
import BlogPage from "./components/BlogPage";
import NavBar from "./components/NavBar";

import { flashNotification } from "./reducers/notificationSlice";
import { initializeBlogs, setBlogs } from "./reducers/blogSlice";
import { setUser } from "./reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const blogCreationFormRef = useRef();

  const blogs = useSelector((state) => state.blog);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userMatch = useMatch("/users/:id");
  const userPageId = userMatch ? userMatch.params.id : null;

  const blogMatch = useMatch("/blogs/:id");
  const blog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

  // console.log("Got blog", blog);

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
      dispatch(flashNotification("Invalid username or password", "error"));
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
        dispatch(flashNotification("Blog creation successful", "success"));
      })
      .catch((error) => {
        console.log("Got error", error);
        dispatch(flashNotification("Blog creation failed", "error"));
      });
  };

  const removeBlog = (blog) => {
    const confirm = window.confirm(`Remove blog "${blog.title}"?`);
    if (confirm) {
      blogService
        .remove(blog.id)
        .then(() => {
          sortByLikesAndSet(blogs.filter((b) => b.id !== blog.id));
          dispatch(flashNotification("Blog removed successfully", "success"));
        })
        .catch((error) => {
          console.log("Got error", error);
          dispatch(flashNotification("Blog could not be removed", "error"));
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
        dispatch(flashNotification("Like operation failed", "error"));
      });
  };

  const addComment = (blogObject, id) => {
    console.log("Adding comment to", blogObject);
    blogService
      .leaveComment(blogObject, id)
      .then((updatedBlog) => {
        console.log("Added, got response", updatedBlog);
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
        <Box sx={{ p: 1 }}>
          <Typography variant="h4">Log into the application</Typography>
        </Box>
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
      <Box sx={{ p: 1 }}>
        <Typography variant="h4">Blogs</Typography>
      </Box>
      <NotificationBar />
      <NavBar user={user} handleLogout={handleLogout} />
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
        <Route
          path="blogs/:id"
          element={
            <Blog
              blog={blog}
              addLike={addLike}
              addComment={addComment}
              removeBlog={removeBlog}
              currentUser={user}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
