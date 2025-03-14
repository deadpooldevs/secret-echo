
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    setIsAuthenticated(!!(username && password));
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If logged in, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
