import { createContext, useContext, useEffect, useState, FC } from 'react';
import { auth } from './config/firebaseClient';
import Login from './components/common/Login';
import Loading from './components/common/Loading';
import nookies from 'nookies';

// Create a react context instance
const AuthContext = createContext({});
// console.log('AuthContext is: ', AuthContext);

export const AuthProvider: FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log('no user');
        nookies.set(undefined, 'token', '', {});
        setCurrentUser({});
        setLoading(false);
        return;
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, 'token', token, {});
        setCurrentUser(user);
        setLoading(false);
        // console.log("token", token);
        // console.log("user", user);
      }
    });
  }, []);

  if (loading) {
    return <Loading type="spinningBubbles" color="yellowgreen" />;
  }

  if (!currentUser) {
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
