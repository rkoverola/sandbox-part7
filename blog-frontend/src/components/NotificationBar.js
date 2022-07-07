const NotificationBar = ({ message, type }) => {
  return (
    <h3 className={type}>{message}</h3>
  )
}

export default NotificationBar