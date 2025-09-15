import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UnauthorizedAccess = ({ 
  message = "You don't have permission to access this page.", 
  showLoginButton = true,
  customAction = null 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();

  const getAppropriateMessage = () => {
    if (!isAuthenticated) {
      return "Please log in to access this page.";
    } else if (userRole === 'user') {
      return "This page is restricted to administrators only.";
    }
    return message;
  };

  const getAppropriateActions = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-[#311B08] text-amber-500 text-lg font-semibold px-6 py-3 rounded-xl hover:bg-amber-800 transition-colors duration-200"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-500 text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(userRole === 'admin' ? '/admin-dashboard' : '/profile')}
            className="flex-1 bg-[#311B08] text-amber-500 text-lg font-semibold px-6 py-3 rounded-xl hover:bg-amber-800 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-500 text-white text-lg font-semibold px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-gray-300 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              {!isAuthenticated ? (
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              )}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-[#311B08] mb-4">
            {!isAuthenticated ? 'Authentication Required' : 'Access Denied'}
          </h3>
          
          <p className="text-gray-600 text-lg mb-6">
            {getAppropriateMessage()}
          </p>
          
          {customAction || getAppropriateActions()}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
