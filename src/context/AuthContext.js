import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (jwt) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
  };

  const getUser = () => {
    if (!token) return null;
    try {
      return jwtDecode(token); // { userId, email, iat, exp }
    } catch (err) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
