import { useEffect, useState } from "react";
import userService from "../services/users";

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
      <h2>{user.name}</h2>
      <h3>Added blogs:</h3>
      <ul>
        {user.blogs.map((b) => {
          return <li key={b.id}>{b.title}</li>;
        })}
      </ul>
    </div>
  );
};

export default User;
