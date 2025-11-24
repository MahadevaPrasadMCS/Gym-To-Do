// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("ft_user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (auth) localStorage.setItem("ft_user", JSON.stringify(auth));
    else localStorage.removeItem("ft_user");
  }, [auth]);

  const login = (payload) => setAuth(payload);
  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
