import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // 1. Not logged in? Go to login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but wrong role? Go home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}