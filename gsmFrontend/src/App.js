// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import LoginPage from './Components/LoginPage/LoginPage';   // alt sayfa
import Student from './Components/studentPage/Student';
import AboutPage from "./Components/LoginPage/aboutPage/AboutPage";
import ContactPage from "./Components/LoginPage/contactPage/ContactPage";
import ResetPasswordPage from './Components/LoginPage/loginSignupForm/ResetPasswordPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={1000} />
      <Routes>
        {/* “/” isteğinde direkt LoginPage göster */}
        <Route path="/" element={<LoginPage />} />

        {/* İstersek "/login" alias’ı da kalsın */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
