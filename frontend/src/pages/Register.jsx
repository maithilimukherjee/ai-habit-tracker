import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

import "../styles/auth.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      return setError(
        "passwords do not match"
      );

    }

    try {

      setLoading(true);
      setError("");

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      const data = await registerUser(userData);

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
        "registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>create account.</h1>

        <p>
          begin your journey towards
          smarter habits and consistency.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="full name"
            value={formData.name}
            onChange={handleChange}
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            value={formData.confirmPassword}
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
                ? "creating..."
                : "create account"
            }

          </button>

        </form>

        <div className="auth-footer">

          <span>already have an account?</span>

          <Link to="/">
            sign in
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;