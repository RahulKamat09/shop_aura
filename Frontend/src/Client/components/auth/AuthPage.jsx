import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, ShoppingBag, Sparkles, Phone } from "lucide-react";
import "../auth/auth.css";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const [focusedField, setFocusedField] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const from = location.state?.from?.pathname || "/";

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!isLogin) {
            // 🔍 Check for duplicate email or phone
            const res = await fetch("https://shop-aura.onrender.com/customers");
            const customers = await res.json();

            const emailExists = customers.some(
                (c) => c.email === formData.email
            );

            const phoneExists =
                formData.phone &&
                customers.some((c) => c.phone === formData.phone);

            if (emailExists) {
                alert("This email is already registered");
                setIsLoading(false);
                return;
            }

            if (phoneExists) {
                alert("This phone number is already registered");
                setIsLoading(false);
                return;
            }

            // ✅ Create new customer
            const newCustomer = {
                id: "u_" + Date.now(),
                name: formData.name,
                email: formData.email,
                phone: formData.phone || "",
                password: formData.password, // plain for now
                registered: new Date().toISOString().split("T")[0],
                orders: 0,
                totalSpent: 0,
                status: "Active",
            };

            await fetch("https://shop-aura.onrender.com/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer),
            });

            localStorage.setItem("token", "user_logged_in");
            localStorage.setItem("userId", newCustomer.id);
        } else {
            // =========================
            // 🔐 ADMIN LOGIN (FIRST)
            // =========================
            const adminRes = await fetch("https://shop-aura.onrender.com/admin");
            const admin = await adminRes.json();

            if (
                formData.email === admin.email &&
                formData.password === admin.password
            ) {
                localStorage.setItem("adminToken", "admin_logged_in");

                await delay(2000 + Math.random() * 1000);
                // ⏳ admin delay

                setIsLoading(false);
                navigate("/admin", { replace: true });
                return;
            }


            // =========================
            // 🔐 USER LOGIN
            // =========================
            // =========================
            // 🔐 USER LOGIN
            // =========================
            const res = await fetch(
                `https://shop-aura.onrender.com/customers?email=${formData.email}&password=${formData.password}`
            );
            const user = await res.json();

            // ❌ Invalid credentials
            if (!user.length) {
                alert("Invalid email or password");
                setIsLoading(false);
                return;
            }

            // ❌ Inactive account check (IMPORTANT)
            if (user[0].status !== "Active") {
                alert("Your account is inactive. You can’t log in. Please contact support.");
                setIsLoading(false);
                return;
            }

            // ✅ Active user → allow login
            localStorage.setItem("token", "user_logged_in");
            localStorage.setItem("userId", user[0].id);
        }

        // ⏳ Artificial delay for better UX
        await delay(2000 + Math.random() * 1000);
        // 2000 = 2 seconds (use 3000 if you want)

        // Stop loader
        setIsLoading(false);

        // Redirect
        navigate(from, { replace: true });

    };


    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    };

    return (
        <div className="auth-page">
            <Link to="/" className="auth-back-home">
                <ArrowLeft size={18} />
                <span>Back to Home</span>
            </Link>

            <div className="auth-container">
                {/* Background decoration */}
                <div className="auth-bg-decoration">
                    <div className="auth-bg-circle auth-bg-circle-1"></div>
                    <div className="auth-bg-circle auth-bg-circle-2"></div>
                    <div className="auth-bg-circle auth-bg-circle-3"></div>
                </div>

                <div className="auth-wrapper">
                    {/* Left Panel - Branding */}
                    <div className="auth-branding">
                        <div className="auth-branding-content">
                            <div className="auth-logo">
                                <ShoppingBag size={40} />
                                <span>Shop Aura</span>
                            </div>
                            <h1 className="auth-branding-title">
                                {isLogin ? "Welcome Back!" : "Join Our Community"}
                            </h1>
                            <p className="auth-branding-text">
                                {isLogin
                                    ? "Sign in to access your account, track orders, and discover exclusive deals."
                                    : "Create an account to unlock personalized shopping experiences and member-only benefits."}
                            </p>
                            <div className="auth-features">
                                <div className="auth-feature">
                                    <Sparkles size={20} />
                                    <span>Exclusive member discounts</span>
                                </div>
                                <div className="auth-feature">
                                    <Sparkles size={20} />
                                    <span>Early access to new arrivals</span>
                                </div>
                                <div className="auth-feature">
                                    <Sparkles size={20} />
                                    <span>Free shipping on orders $50+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="auth-form-panel">
                        <div className="auth-form-container">
                            <div className="auth-form-header">
                                <h2 className="auth-form-title">
                                    {isLogin ? "Sign In" : "Create Account"}
                                </h2>
                                <p className="auth-form-subtitle">
                                    {isLogin
                                        ? "Enter your credentials to continue"
                                        : "Fill in your details to get started"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                {/* Name Field - Register Only */}
                                {!isLogin && (
                                    <div
                                        className={`auth-input-group ${focusedField === "name" || formData.name ? "focused" : ""
                                            }`}
                                    >
                                        <div className="auth-input-icon">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField("name")}
                                            onBlur={() => setFocusedField(null)}
                                            className="auth-input"
                                            required
                                        />
                                        <label htmlFor="name" className="auth-input-label">
                                            Full Name
                                        </label>
                                    </div>
                                )}

                                {!isLogin && (
                                    <div
                                        className={`auth-input-group ${focusedField === "phone" || formData.name ? "focused" : ""
                                            }`}
                                    >
                                        <div className="auth-input-icon">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField("phone")}
                                            onBlur={() => setFocusedField(null)}
                                            className="auth-input"
                                        />
                                        <label htmlFor="name" className="auth-input-label">
                                            Phone
                                        </label>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div
                                    className={`auth-input-group ${focusedField === "email" || formData.email ? "focused" : ""
                                        }`}
                                >
                                    <div className="auth-input-icon">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField(null)}
                                        className="auth-input"
                                        required
                                    />
                                    <label htmlFor="email" className="auth-input-label">
                                        Email Address
                                    </label>
                                </div>

                                {/* Password Field */}
                                <div
                                    className={`auth-input-group ${focusedField === "password" || formData.password
                                        ? "focused"
                                        : ""
                                        }`}
                                >
                                    <div className="auth-input-icon">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField("password")}
                                        onBlur={() => setFocusedField(null)}
                                        className="auth-input"
                                        required
                                    />
                                    <label htmlFor="password" className="auth-input-label">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Confirm Password - Register Only */}
                                {!isLogin && (
                                    <div
                                        className={`auth-input-group ${focusedField === "confirmPassword" || formData.confirmPassword
                                            ? "focused"
                                            : ""
                                            }`}
                                    >
                                        <div className="auth-input-icon">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField("confirmPassword")}
                                            onBlur={() => setFocusedField(null)}
                                            className="auth-input"
                                            required
                                        />
                                        <label htmlFor="confirmPassword" className="auth-input-label">
                                            Confirm Password
                                        </label>
                                        <button
                                            type="button"
                                            className="auth-password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Forgot Password - Login Only */}
                                {isLogin && (
                                    <div className="auth-forgot-password">
                                        <button type="button" className="auth-link">
                                            Forgot your password?
                                        </button>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className={`auth-submit-btn ${isLoading ? "loading" : ""}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="auth-spinner"></div>
                                    ) : (
                                        <>
                                            <span>{isLogin ? "Sign In" : "Create Account"}</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="auth-divider">
                                <span>or continue with</span>
                            </div>

                            {/* Social Login */}
                            <div className="auth-social-buttons">
                                <button type="button" className="auth-social-btn">
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span>Google</span>
                                </button>
                                <button type="button" className="auth-social-btn">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.486 0-.24-.009-.875-.013-1.713-2.782.602-3.369-1.34-3.369-1.34-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.091-.647.35-1.087.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.646 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.547 1.376.203 2.394.1 2.646.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.31.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .27.18.58.688.482C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                    <span>GitHub</span>
                                </button>
                            </div>

                            {/* Toggle Mode */}
                            <div className="auth-toggle-mode">
                                <span>
                                    {isLogin
                                        ? "Don't have an account?"
                                        : "Already have an account?"}
                                </span>
                                <button type="button" className="auth-link" onClick={toggleMode}>
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
