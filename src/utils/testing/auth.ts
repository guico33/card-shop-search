import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebaseConfig';

export const testEmail = 'test@example.com';
export const testPassword = 'password123';

export const loginTestUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('Test user logged in');
  } catch (error) {
    console.error('Error logging in test user', error);
  }
};
