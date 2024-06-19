// src/components/LogoutButton.tsx
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';

import { auth } from '../firebaseConfig';

const LogoutButton = () => {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return <Button onClick={logout}>Logout</Button>;
};

export default LogoutButton;
