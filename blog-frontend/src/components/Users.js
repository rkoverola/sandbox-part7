import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/users";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService
      .getAll()
      .then((response) => {
        console.log(response);
        setUsers(response);
      })
      .catch((error) => {
        console.log("Got error", error);
      });
  }, []);

  console.log("Drawing table for", users);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>
              <b>Blogs created</b>
            </td>
          </tr>
          {users.map((user) => {
            return (
              <tr key={user.name}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
