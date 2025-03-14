
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is logged in
  const username = localStorage.getItem('username');
  
  if (!username) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // If logged in, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
