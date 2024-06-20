import { Button } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';

import { auth, googleProvider } from '../firebaseConfig';

const SignInButton = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return <Button onClick={signInWithGoogle}>Sign in</Button>;
};

export default SignInButton;
