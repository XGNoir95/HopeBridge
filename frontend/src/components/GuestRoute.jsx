import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = ({ children, redirectPath = "/" }) => {
  const { isAuthenticated, userRole, loading, logout } = useAuth();
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  console.log('👤 GuestRoute:', { isAuthenticated, userRole, showLogoutPrompt, hasShownPrompt });

  // Reset the prompt state when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLogoutPrompt(false);
      setHasShownPrompt(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#311B08] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated and we haven't shown the prompt yet
  if (isAuthenticated && !hasShownPrompt) {
    setShowLogoutPrompt(true);
    setHasShownPrompt(true);
  }

  // Handle logout and continue to page
  const handleLogout = async () => {
    console.log('🚪 GuestRoute: Logout button clicked');
    
    try {
      // Call logout and wait for it to complete
      logout();
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        setShowLogoutPrompt(false);
        setHasShownPrompt(false);
        console.log('🚪 GuestRoute: Logout completed, hiding prompt');
      }, 100);
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Stay logged in and redirect to appropriate dashboard
  const handleStayLoggedIn = () => {
    setShowLogoutPrompt(false);
  };

  // Show logout confirmation modal
  if (showLogoutPrompt && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-gray-300 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#311B08]">
                <svg className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-[#311B08] mb-4">
              Already Logged In
            </h3>
            
            <p className="text-gray-600 text-lg mb-6">
              You are currently logged in as <strong className="text-[#311B08]">{userRole}</strong>. 
              Do you want to log out to access this page?
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-colors duration-200"
              >
                Log Out & Continue
              </button>
              <button
                onClick={handleStayLoggedIn}
                className="w-full bg-[#311B08] text-amber-500 text-lg font-semibold px-6 py-3 rounded-xl hover:underline transition-colors duration-200 mb-3"
              >
                Cancel & Stay Logged In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user chose to stay logged in, redirect to appropriate dashboard
  if (isAuthenticated && !showLogoutPrompt) {
    const destination = userRole === 'admin' ? '/admin-dashboard' : redirectPath;
    console.log('🔄 Redirecting authenticated user to:', destination);
    return <Navigate to={destination} replace />;
  }

  // If user is not authenticated, show the page
  console.log('✅ Showing guest page');
  return children;
};

export default GuestRoute;
