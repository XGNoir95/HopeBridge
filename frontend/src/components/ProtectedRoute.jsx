import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [], fallbackPath = "/" }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  console.log('🛡️ ProtectedRoute:', { isAuthenticated, userRole, requireAuth, allowedRoles });

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

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If route requires specific roles and user doesn't have the right role
  if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log('❌ Insufficient permissions, redirecting to', fallbackPath);
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;
