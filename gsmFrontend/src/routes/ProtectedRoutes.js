import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;            // oturum yok
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;                     // rol yetmiyor

  return children;
}
