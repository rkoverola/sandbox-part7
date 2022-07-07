const LoginForm = ({ handleLoginSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <form onSubmit={handleLoginSubmit} >
      <div>
        Username
        <input
          type={'text'}
          value={username}
          onChange={handleUsernameChange}
          data-cy="username"
        />
      </div>
      <div>
        Password
        <input
          type={'password'}
          value={password}
          onChange={handlePasswordChange}
          data-cy="password"
        />
      </div>
      <div>
        <button type='submit'>Login</button>
      </div>
    </form>
  )
}

export default LoginForm