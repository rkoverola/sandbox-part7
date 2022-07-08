import { useSelector } from "react-redux";

const NotificationBar = () => {
  const notification = useSelector((state) => state.notification);
  console.log("Got this from store", notification);
  return <h3 className={notification.type}>{notification.message}</h3>;
};

export default NotificationBar;
