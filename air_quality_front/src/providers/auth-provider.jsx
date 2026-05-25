import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function isTokenValid(token) {
  if (!token || token === "null" || token === "undefined") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return true;

  try {
    const payload = JSON.parse(atob(parts[1]));
    if (!payload?.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isTokenValid(localStorage.getItem("token")),
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (isTokenValid(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
      return;
    }

    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);

    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setIsAuthenticated(false);

    window.location = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}  
