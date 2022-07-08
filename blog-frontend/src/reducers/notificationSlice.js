import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    type: "Info",
  },
  reducers: {
    setNotification: (state, action) => {
      console.log("Setting notification");
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
