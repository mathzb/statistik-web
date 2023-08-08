import React from "react";
import { useBookStore } from "../bookStore.js";
import { method } from "lodash";

const Login = () => {
  const { username, password } = useBookStore((state) => ({
    username: state.username,
    password: state.password,
  }));

  const { updateUsername, updatePassword } = useBookStore((state) => ({
    updateUsername: state.updateUsername,
    updatePassword: state.updatePassword,
  }));

  const handleLogin = async () => {
    try {
      const response = await fetch("https://identity.ipnordic.dk/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
          WlOperatorId: 1,
          ClientSecret: "33B52EB1-9FAC-4787-85A6-772571684FFD",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem("token", token);
        console.log(data);
        // Redirect to the desired page or update the login state in your application
      } else {
        // Handle login error, e.g., display an error message
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error, e.g., display an error message
    }
  };

  return (
    <div>
      <label>
        Username:
        <input
          type="text"
          onChange={(e) => updateUsername(e.target.value)}
          value={username}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          onChange={(e) => updatePassword(e.target.value)}
          value={password}
        />
      </label>
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
