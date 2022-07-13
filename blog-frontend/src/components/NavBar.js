import { Link } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";

const NavBar = ({ user, handleLogout }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button onClick={handleLogout} variant="outlined" color="inherit">
            Logout
          </Button>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <a>{user.name} is logged in </a>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
