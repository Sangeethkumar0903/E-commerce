import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "CUSTOMER"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    setIsLoading(true);
    try {
      await api.post("accounts/register/", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setForm({...form, [field]: e.target.value});
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <div className="login-header">
          <h2 className="login-title">Create your account</h2>
          <p className="login-subtitle">Fill in your details to get started</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="full_name" className="form-label">Full Name</label>
            <input
              id="full_name"
              placeholder="John Doe"
              value={form.full_name}
              onChange={handleInputChange("full_name")}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleInputChange("email")}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              id="phone"
              placeholder="+1 (123) 456-7890"
              value={form.phone}
              onChange={handleInputChange("phone")}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleInputChange("password")}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Account Type</label>
            <select
              id="role"
              value={form.role}
              onChange={handleInputChange("role")}
              className="form-input"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>

          <div>
            <button
              onClick={submit}
              disabled={isLoading}
              className={`login-btn btn ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner-small"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="login-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}