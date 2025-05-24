
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import { useAuth } from './AuthProvider';

const ProtectedRoute = () => {
  const { loading } = useAuth();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-radar-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
