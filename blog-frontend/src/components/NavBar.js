const NavBar = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <nav>
      <a href="/" style={padding}>
        Blogs
      </a>
      <a href="/users" style={padding}>
        Users
      </a>
      <a>
        {user.name} is logged in <button onClick={handleLogout}>Logout</button>
      </a>
    </nav>
  );
};

export default NavBar;
