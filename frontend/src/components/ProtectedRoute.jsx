import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { role } = useContext(AuthContext);

  // Not logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Allowed
  return children;
}
