import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Silent Auth Check on mount/refresh
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/me", { credentials: "include" });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth session expired");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);
    if (data.username) {
      // Re-fetch user data to ensure CSRF cookies are synced
      const res = await fetch("http://localhost:5001/api/me", { credentials: "include" });
      const userData = await res.json();
      setUser(userData);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = "/"; // Hard redirect to clear state
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};