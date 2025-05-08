import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user,  setUser]  = useState(() => {
    try {
      return token ? jwtDecode(token) : null;            // {sub: email, role: "...", exp: ...}
    } catch { return null; }
  });

    // user objesini konsola yazdırmak için useEffect ekliyoruz
    useEffect(() => {
      if (user) {
        console.log('User object:', user);  // Burada user'ı konsola yazdırıyoruz
      }
    }, [user]);  // user değiştiğinde yeniden çalışacak

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    const decoded = jwtDecode(jwt);
    setToken(jwt);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // oturum süresi dolduğunda otomatik çıkış (opsiyonel)
  useEffect(() => {
    if (!token) return;
    const { exp } = jwtDecode(token);
    const timeout = setTimeout(logout, exp * 1000 - Date.now());
    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
