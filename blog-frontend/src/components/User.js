import { useEffect, useState } from "react";
import userService from "../services/users";
import { Typography, List, ListItem } from "@mui/material";

const User = (id) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService
      .getAll()
      .then((response) => {
        console.log("Got users", response);
        const users = response;
        console.log("Got id", id.id);
        const userById = users.find((u) => u.id === id.id);
        console.log("Got user", userById);
        setUser(userById);
      })
      .catch((error) => {
        console.log("Got error", error);
      });
  }, []);

  if (!user) {
    return null;
  }
  return (
    <div>
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="h5">Added blogs:</Typography>
      <List>
        {user.blogs.map((b) => {
          return <ListItem key={b.id}>{b.title}</ListItem>;
        })}
      </List>
    </div>
  );
};

export default User;
