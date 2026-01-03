// src/routes/PublicAuthRoute.jsx
import { Navigate } from "react-router-dom";

const PublicAuthRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated ? <Navigate to="/profile" replace /> : children;
};

export default PublicAuthRoute;
