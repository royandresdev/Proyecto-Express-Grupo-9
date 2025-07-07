import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("auth-storage") !== null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
