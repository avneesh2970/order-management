import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email"); 

    return token ? { token, role, name, email } : null;
  });

  const login = (data) => {
    if (!data || !data.user) {
        console.error("Login failed: Data or User object missing", data);
        return;
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("email", data.user.email); 

    setUser({
      token: data.token,
      role: data.role,
      name: data.user.name,
      email: data.user.email, 
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email"); 
    setUser(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem("token")) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};