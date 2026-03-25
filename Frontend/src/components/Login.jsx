import React, { useState, useEffect } from "react"; // <-- Added useEffect here
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Added 'user' to the props
const Login = ({ onAuthSuccess, user }) => {
  const navigate = useNavigate();
  
  // --- REDIRECT LOGIC ---
  // If a user is already logged in, immediately redirect them to the shop
  useEffect(() => {
    if (user) {
      navigate("/shop", { replace: true }); 
    }
  }, [user, navigate]);
  // ----------------------

  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setSuccessMsg("");
    setFormData({ name: "", username: "", email: "", password: "" }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const endpoint = isLoginMode ? "/login" : "/register";
    const url = `${API_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials. Please check your email and password.");
      }

      if (isLoginMode) {
        // --- LOGIN SUCCESS ---
        onAuthSuccess(data.user); 
        navigate("/shop");        
      } else {
        // --- REGISTRATION SUCCESS ---
        setSuccessMsg("Account created successfully! Please log in.");
        setIsLoginMode(true);     
        setFormData({ name: "", username: "", email: formData.email, password: "" }); 
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prevent the login form from flashing on the screen for a split second before redirecting
  if (user) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLoginMode ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isLoginMode 
              ? "Enter your credentials to access your account." 
              : "Sign up to start shopping and get recommendations."}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center animate-pulse">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium border border-green-100 text-center">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Sign Up Fields (Hidden during Login) */}
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLoginMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Eg: John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLoginMode}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Eg: johndoe123"
                />
              </div>
            </>
          )}

          {/* Shared Fields (Email & Password) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Eg: you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Eg: ******"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
              loading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
            }`}
          >
            {loading ? "Processing..." : (isLoginMode ? "Sign In" : "Sign Up")}
          </button>

        </form>

        {/* Toggle Mode */}
        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            type="button"
            className="font-bold text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
          >
            {isLoginMode ? "Sign up now" : "Log in instead"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;