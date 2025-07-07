import { Navigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import LoadingSpinner from "@componentsUseable/Loading";

const ClubRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default ClubRedirect;