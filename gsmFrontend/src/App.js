import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import LoginPage from './Components/LoginPage/LoginPage';
import Student from './Components/studentPage/Student';
import Dean from './Components/deanPage/Dean';
import Advisor from './Components/advisorPage/Advisor';
import Secretary from './Components/secretaryPage/Secretary';
import StudentAffairs from './Components/studentAffairPage/StudentAffair';
import AboutPage from "./Components/LoginPage/aboutPage/AboutPage";
import ContactPage from "./Components/LoginPage/contactPage/ContactPage";
import ResetPasswordPage from './Components/LoginPage/loginSignupForm/ResetPasswordPage';
import TranscriptViewer from './Components/studentPage/TranscriptViewer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={1000} />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/transcript-viewer" element={<TranscriptViewer />} />
        
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dean"
          element={
            <ProtectedRoute>
              <Dean />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advisor"
          element={
            <ProtectedRoute>
              <Advisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/secretary"
          element={
            <ProtectedRoute>
              <Secretary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentAffairs"
          element={
            <ProtectedRoute>
              <StudentAffairs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
