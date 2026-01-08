import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  // ❌ Not logged in as admin
  if (!adminToken) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Admin logged in
  return children;
};

export default AdminProtectedRoute;
