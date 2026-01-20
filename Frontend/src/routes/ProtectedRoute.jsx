import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/api"; // ✅ adjust path if needed
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    const [isAllowed, setIsAllowed] = useState(null);
    const hasShownToast = useRef(false); // ✅ prevent duplicate toasts

    /* -----------------------------
       🔐 NOT LOGGED IN → REDIRECT
    ------------------------------ */
    if (!token || !userId) {
        return (
            <Navigate
                to="/auth"
                replace
                state={{ from: location }}
            />
        );
    }

    /* -----------------------------
       🔍 CHECK USER STATUS
    ------------------------------ */
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const { data: user } = await api.get(`/customers/${userId}`);

                if (user?.status === "Active") {
                    setIsAllowed(true);
                } else {
                    setIsAllowed(false);
                }
            } catch (error) {
                console.error("ProtectedRoute error:", error);
                setIsAllowed(false);
            }
        };

        checkUserStatus();
    }, [userId]);

    /* -----------------------------
       ⏳ LOADING STATE
    ------------------------------ */
    if (isAllowed === null) {
        return (
            <p style={{ padding: "2rem", textAlign: "center" }}>
                Checking access...
            </p>
        );
    }

    /* -----------------------------
       ❌ INACTIVE / BLOCKED USER
    ------------------------------ */
    if (!isAllowed) {
        if (!hasShownToast.current) {
            toast.error("Your account is inactive. Please contact support.");
            hasShownToast.current = true;
        }

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");

        return <Navigate to="/" replace />;
    }

    /* -----------------------------
       ✅ ACTIVE USER
    ------------------------------ */
    return children;
};

export default ProtectedRoute;
