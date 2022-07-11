import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./reducers/blogSlice";
import notificationReducer from "./reducers/notificationSlice";
import userReducer from "./reducers/userSlice";

export default configureStore({
  reducer: {
    blog: blogReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});
