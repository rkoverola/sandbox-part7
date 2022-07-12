import { Alert } from "@mui/material";
import { useSelector } from "react-redux";

const NotificationBar = () => {
  const notification = useSelector((state) => state.notification);
  if (notification.type === "none") {
    return null;
  }
  return <Alert severity={notification.type}>{notification.message}</Alert>;
};

export default NotificationBar;
