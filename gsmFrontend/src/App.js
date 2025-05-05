// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import LoginPage from './Components/LoginPage/LoginPage';   // alt sayfa
import Student from './Components/studentPage/Student';
import AboutPage from "./Components/LoginPage/aboutPage/AboutPage";
import ContactPage from "./Components/LoginPage/contactPage/ContactPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* “/” isteğinde direkt LoginPage göster */}
        <Route path="/" element={<LoginPage />} />

        {/* İstersek "/login" alias’ı da kalsın */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

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
