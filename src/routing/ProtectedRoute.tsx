import { Navigate } from 'react-router-dom';

import { AppRoutes } from '../constants/router';
import useAuthContext from '../contexts/AuthContext/useAuthContext';

type ProtectedRouteProps = {
  element: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to={AppRoutes.HOME} />;
  }

  return element;
};

export default ProtectedRoute;
