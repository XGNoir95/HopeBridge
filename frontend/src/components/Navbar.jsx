import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const logo = "/hblogo.png";
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      setIsAuthenticated(!!token);
      setRole(userRole);
    };

    // Listen for storage events
    window.addEventListener("storage", updateAuthState);

    // Initial check
    updateAuthState();

    // Cleanup
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <nav className="bg-[#311B08] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Hope Bridge Logo" className="w-auto h-14" />
        </Link>

        {/* Mobile Navbar */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        <div
          className={`absolute md:static top-16 right-4 bg-[#311B08] w-48 md:w-auto rounded-lg md:flex md:space-x-10 p-4 md:p-0 shadow-lg md:shadow-none transition-all duration-300 ease-in-out ${isOpen ? "block" : "hidden"}`}
        >
          <Link to="/" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Home
          </Link>
          <Link to="/alerts" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Alerts
          </Link>
          <Link to="/relief" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Relief
          </Link>
          <Link to="/safeguard" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
            Safeguard
          </Link>

          {isAuthenticated ? (
            <>
              {role === "admin" ? (
                <Link to="/admin-dashboard" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/profile" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
                  Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
                Login
              </Link>
              <Link to="/register" className="block md:inline text-xl text-[#EBB380] transition-colors p-2 md:p-0">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;