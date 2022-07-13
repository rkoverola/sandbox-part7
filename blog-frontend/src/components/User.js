import { useEffect, useState } from "react";
import userService from "../services/users";
import { Typography, List, ListItem, Box } from "@mui/material";

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
      <Box sx={{ p: 1 }}>
        <Typography variant="h4">{user.name}</Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography variant="h5">Added blogs:</Typography>
      </Box>
      <List>
        {user.blogs.map((b) => {
          return <ListItem key={b.id}>{b.title}</ListItem>;
        })}
      </List>
    </div>
  );
};

export default User;
