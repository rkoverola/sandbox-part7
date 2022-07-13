import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  Box,
} from "@mui/material";
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
    <TableContainer>
      <Box sx={{ p: 1 }}>
        <Typography variant="h4">Users</Typography>
      </Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
          {users.map((user) => {
            return (
              <TableRow key={user.name}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
