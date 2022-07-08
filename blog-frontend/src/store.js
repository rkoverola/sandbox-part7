import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./reducers/blogSlice";
import notificationReducer from "./reducers/notificationSlice";

export default configureStore({
  reducer: {
    blog: blogReducer,
    notification: notificationReducer,
  },
});
