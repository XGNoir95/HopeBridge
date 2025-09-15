import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const logo = "/hblogo.png";
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#311B08] text-white p-4 shadow-lg relative">
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

        {/* Desktop Menu - Always visible on md and above */}
        <div className="hidden md:flex md:space-x-10">
          <Link to="/" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
            Home
          </Link>
          <Link to="/alerts" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
            Alerts
          </Link>
          <Link to="/relief" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
            Relief
          </Link>
          <Link to="/safeguard" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
            Safeguard
          </Link>

          {isAuthenticated ? (
            <>
              {userRole === "admin" ? (
                <Link to="/admin-dashboard" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/profile" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
                  Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
                Login
              </Link>
              <Link to="/register" className="block md:inline text-xl text-amber-500 hover:font-bold transition-colors p-2 md:p-0">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu - Fixed positioning issue */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#311B08] w-full rounded-lg md:hidden p-4 shadow-lg z-50">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/alerts" 
                className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Alerts
              </Link>
              <Link 
                to="/relief" 
                className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Relief
              </Link>
              <Link 
                to="/safeguard" 
                className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                onClick={() => setIsOpen(false)}
              >
                Safeguard
              </Link>

              {isAuthenticated ? (
                <>
                  {userRole === "admin" ? (
                    <Link 
                      to="/admin-dashboard" 
                      className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link 
                      to="/profile" 
                      className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-left text-xl text-amber-500 hover:font-bold transition-colors p-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block text-xl text-amber-500 hover:font-bold transition-colors p-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
