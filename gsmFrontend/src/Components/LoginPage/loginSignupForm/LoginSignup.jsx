// ======================== LoginSignup.jsx (form) =====================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import logo from "../../../assets/iyteLogo.png";

import { registerStudent, loginStudent } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

import { toast } from "react-toastify";
import ForgotPasswordModal from "./ForgotPasswordModal";

const ROLE = {
  STUDENT: "STUDENT",
  ADVISOR: "ADVISOR",
  DEAN: "DEAN",
  SECRETARY: "SECRETARY",
  STUDENT_AFFAIRS: "STUDENT_AFFAIRS",
};

function LoginSignup() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLE.STUDENT,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await registerStudent(formData);
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
      const res = await loginStudent(formData.email, formData.password);
      login(res.data.token);
      toast.success("You are logged in successfully!");
      navigate("/student", { replace: true });
    } catch (err) {
      toast.error("Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama işlemi burada yapılabilir
  const handleSendReset = (email) => {
    // Burada API çağrısı veya toastify ile bildirim ekleyebilirsin
    // Örnek: toast.success(`Reset link sent to: ${email}`);
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
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-group select"
              >
                <option value={ROLE.STUDENT}>Student</option>
                <option value={ROLE.ADVISOR}>Advisor</option>
                <option value={ROLE.DEAN}>Dean</option>
                <option value={ROLE.SECRETARY}>Secretary</option>
                <option value={ROLE.STUDENT_AFFAIRS}>Student Affairs</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Surname</label>
              <input
                type="text"
                id="surname"
                placeholder="Enter your surname"
                value={formData.surname}
                onChange={handleInputChange}
              />
            </div>
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
