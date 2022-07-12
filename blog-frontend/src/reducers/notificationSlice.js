import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    type: "none",
  },
  reducers: {
    setNotification: (state, action) => {
      console.log("Setting notification");
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});

export const flashNotification = (message, type) => {
  return async (dispatch) => {
    const notif = { message, type };
    dispatch(setNotification(notif));
    setTimeout(() => {
      dispatch(
        setNotification({
          message: "",
          type: "none",
        })
      );
    }, 5000);
  };
};

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
