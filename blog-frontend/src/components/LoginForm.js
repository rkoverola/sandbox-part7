import { TextField, Button } from "@mui/material";

const LoginForm = ({
  handleLoginSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <form onSubmit={handleLoginSubmit}>
      <div>
        <TextField
          type={"text"}
          value={username}
          onChange={handleUsernameChange}
          data-cy="username"
          label="username"
        />
      </div>
      <div>
        <TextField
          type={"password"}
          value={password}
          onChange={handlePasswordChange}
          data-cy="password"
          label="password"
        />
      </div>
      <div>
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
