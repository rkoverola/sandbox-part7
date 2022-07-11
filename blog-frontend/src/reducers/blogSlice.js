import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

export const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      const sorted = action.payload.sort((a, b) => b.likes - a.likes);
      return sorted;
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    const sorted = blogs.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogs(sorted));
  };
};

export const { setBlogs } = blogSlice.actions;
export default blogSlice.reducer;
