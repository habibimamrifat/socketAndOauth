// Login.jsx
const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/oauth/google";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
