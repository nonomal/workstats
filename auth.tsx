import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './config/firebaseClient';
import Login from './components/common/Login';
import Loading from './components/common/Loading';
import nookies from 'nookies';

// Create a react context instance
const AuthContext = createContext({});

type AuthProviderProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        nookies.set(undefined, 'token', '', {});
        setCurrentUser({});
        setLoading(false);
        return;
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, 'token', token, {});
        setCurrentUser(user);
        setLoading(false);
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true); // true to force refresh
    }, 10 * 60 * 1000);
    return () => clearInterval(handle);
  }, []);

  if (loading) {
    return <Loading type='spinningBubbles' color='#1f2937' />;
  }

  // Because an empty object would result in a boolean value of true
  if (!Object.keys(currentUser).length) {
    return <Login />;
  } else {
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
};

// Pass a context instance to react hooks called useContext. This allows external components to execute it.
export const useAuth = () => useContext(AuthContext);
