import React from 'react';
import { firebase, auth } from '../services/firebase';
export const AuthContext = React.createContext({});

export function AuthContextProvider(props) {
  const [user, setUser] = React.useState();

  async function signInWithGoogle() {
    const provader = new firebase.auth.GoogleAuthProvider();

    const response = await auth.signInWithPopup(provader);
    if (response.user) {
      const { displayName, photoURL, uid } = response.user;
      if (!displayName || !photoURL) {
        throw new Error('Missing Information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          throw new Error('Missing Information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
