// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  
  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;