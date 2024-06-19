import { useContext } from 'react';

import { AuthContext } from './AuthProvider';

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

export default useAuthContext;
