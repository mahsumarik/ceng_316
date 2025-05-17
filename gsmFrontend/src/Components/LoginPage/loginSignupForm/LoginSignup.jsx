import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import logo from "../../../assets/iyteLogo.png";

import { registerUser, loginUser } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

import { toast } from "react-toastify";
import ForgotPasswordModal from "./ForgotPasswordModal";

function LoginSignup() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      // Sadece email ve password gönderiyoruz
      await registerUser(formData);
      toast.success("Registration successful — now you can log in");
      setActiveTab("login");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser(formData.email, formData.password);
      login(res.data.token); // JWT token'ı authContext'e kaydediyoruz
      toast.success("You are logged in successfully!");

      // Backend'den gelen role'ye göre yönlendirme yapıyoruz
      const { role } = res.data; // Backend'den gelen role bilgisini alıyoruz
      if (role === "STUDENT") {
        navigate("/student", { replace: true });
      } else if (role === "DEAN") {
        navigate("/dean", { replace: true });
      } else if (role === "ADVISOR") {
        navigate("/advisor", { replace: true });
      } else if (role === "SECRETARY") {
        navigate("/secretary", { replace: true });
      } else if (role === "STUDENT_AFFAIRS") {
        navigate("/studentAffairs", { replace: true });
      }
    } catch (err) {
      toast.error("Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = (email) => {
    setShowModal(false);
  };

  return (
    <div className="login-signup-container">
      <div className="login-signup-form">
        <div className="form-header">
          <img src={logo} alt="IYTE Logo" className="form-logo" />
          <h2 className="form-title">
            Iztech Online Graduation Management System
          </h2>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "…" : "Login"}
            </button>
            <div className="forgot-password">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="forgot-password-link"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form className="signup-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "…" : "Sign Up"}
            </button>
          </form>
        )}
      </div>

      {/* Modal çağırımı */}
      {showModal && <ForgotPasswordModal onClose={() => setShowModal(false)} onSend={handleSendReset} />}
    </div>
  );
}

export default LoginSignup;
