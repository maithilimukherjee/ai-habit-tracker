import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

import "../styles/auth.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const data = await loginUser(formData);

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>welcome back!</h1>

        <p>
          build habits with AI-powered consistency.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit">

            {
              loading
                ? "signing in..."
                : "sign in"
            }

          </button>

        </form>

        <div className="auth-footer">

          <span>new user?</span>

          <Link to="/register">
            signup
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;