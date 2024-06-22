import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';

import { auth } from '../../firebaseConfig';
import { User } from '../../types/users';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const { uid, displayName, email, photoURL } = firebaseUser;
        setUser({ uid, displayName, email, photoURL });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
