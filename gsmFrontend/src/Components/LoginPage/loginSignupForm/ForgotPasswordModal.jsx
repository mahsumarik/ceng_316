import React, { useState } from "react";
import { toast } from "react-toastify";
import { forgotPassword } from "../../../services/authService";
import "./ForgotPasswordModal.css";

const ForgotPasswordModal = ({ onClose, onSend }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Password reset link has been sent to your email");
      onClose();
    } catch (error) {
      toast.error(error.response?.data || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive a reset link.</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="modal-input"
        />
        <div className="modal-actions">
          <button 
            className="modal-send-btn" 
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;