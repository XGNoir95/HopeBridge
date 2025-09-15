import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToken(null);
    setRole(null);

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        userMail: email,
        password: password,
      });

      const { token: receivedToken, role: userRole } = response.data;

      if (receivedToken && userRole) {
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("role", userRole);
        setToken(receivedToken);
        setRole(userRole);

        // Dispatch a storage event to notify other components
        window.dispatchEvent(new Event("storage"));

        navigate(userRole === "admin" ? "/admin-dashboard" : "/");
      } else {
        setError("Invalid response from the server.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-white px-8 py-16 rounded-3xl border border-gray-300 shadow-lg h-auto w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-[#311B08] text-center">Sign In To Continue</h1>
      <p className="font-medium text-xl text-gray-500 mt-4 text-center">
        Please enter your credentials to enter the platform.
      </p>
      
      <form onSubmit={handleSubmit} className="mt-12">
        {/* Email */}
        <div className="mb-8">
          <label className="text-xl font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="text-lg w-full border border-gray-300 rounded-xl p-5 mt-2 bg-gray-100 focus:bg-white focus:ring-1 focus:ring-amber-600 focus:border-transparent transition-all text-base"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="text-xl font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="text-lg w-full border border-gray-300 rounded-xl p-5 mt-2 bg-gray-100 focus:bg-white focus:ring-1 focus:ring-amber-600 focus:border-transparent transition-all text-base"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-12">
          <button
            type="submit"
            className="w-full bg-[#311B08] text-amber-500 hover:bg-[#EBB380] hover:text-[#311B08] text-xl font-bold p-4 rounded-xl transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Register Link */}
        <div className="text-lg mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#311B08] cursor-pointer hover:underline font-bold"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-center mt-4 p-3 bg-red-50 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      {token && (
        <div className="text-green-600 text-center mt-4 p-3 bg-green-50 rounded-lg break-all">
          <p>Login successful!</p>
          <p className="text-sm">Role: {role}</p>
        </div>
      )}
    </div>
  );
}
