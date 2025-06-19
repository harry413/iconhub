import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;