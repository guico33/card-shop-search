import { Navigate } from 'react-router-dom';

import useAuthContext from '../contexts/AuthContext/useAuthContext';

type ProtectedRouteProps = {
  element: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
