import React from "react";
import Login from "../components/Login";
import "./LoginPage.css";

const LoginPage = ({ setToken }) => {
  return (
    <div className="login-container">
      <Login setToken={setToken} />
    </div>
  );
};

export default LoginPage;
