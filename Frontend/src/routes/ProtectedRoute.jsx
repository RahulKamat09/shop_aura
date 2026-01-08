import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const [isAllowed, setIsAllowed] = useState(null);

    // 🔐 If not logged in
    if (!token || !userId) {
        return (
            <Navigate
                to="/auth"
                replace
                state={{ from: location }}
            />
        );
    }

    useEffect(() => {
        fetch(`http://localhost:5000/customers/${userId}`)
            .then(res => res.json())
            .then(user => {
                if (user.status === "Active") {
                    setIsAllowed(true);
                } else {
                    setIsAllowed(false);
                }
            })
            .catch(() => setIsAllowed(false));
    }, [userId]);

    // ⏳ While checking status
    if (isAllowed === null) {
        return <p style={{ padding: "2rem", textAlign: "center" }}>Checking access...</p>;
    }

    // ❌ Inactive user
    if (!isAllowed) {
        alert("Your account is inactive. Please contact support.");
        localStorage.clear();
        return <Navigate to="/" replace />;
    }

    // ✅ Active user
    return children;
};

export default ProtectedRoute;
