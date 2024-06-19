import { Button } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';

import { auth, googleProvider } from '../firebaseConfig';

const SignInButton = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The signed-in user info.
      const user = result.user;
      console.log('User Info:', user);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return <Button onClick={signInWithGoogle}>Sign in</Button>;
};

export default SignInButton;
