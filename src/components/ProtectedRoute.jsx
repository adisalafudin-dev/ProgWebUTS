import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { ROLES } from "../constants/roles.js";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ redirectTo: location.pathname }}
        replace
      />
    );
  }

  if (allowedRoles?.length > 0) {
    const userRole = user.role || ROLES.USER;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
