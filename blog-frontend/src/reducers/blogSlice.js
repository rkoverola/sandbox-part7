import { createSlice } from "@reduxjs/toolkit";

export const blogSlice = createSlice({
  name: "blog",
  initialState: {},
  reducers: {
    dummy: () => {},
  },
});

export const { dummy } = blogSlice.actions;
export default blogSlice.reducer;
