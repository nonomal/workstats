import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./config/firebase";
import Login from "./components/common/Login";
import Loading from "./components/common/Loading";
import nookies from "nookies";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        console.log("no user");
        nookies.set(undefined, "token", "", {});
        setCurrentUser(null);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      nookies.set(undefined, "token", token, {});
      setCurrentUser(user);
      setLoading(false);
      // console.log("token", token);
      // console.log("user", user);
    });
  }, []);

  if (loading) {
    return (<Loading type="spinningBubbles" color="yellowgreen" />);
  }

  if(!currentUser){
    return <Login />
  } else {
    return (
      <AuthContext.Provider value={{currentUser}}>
        {children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => useContext(AuthContext);