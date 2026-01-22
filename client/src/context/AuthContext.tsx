import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth";
import type { AuthContextType } from "../types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ME_ENDPOINT = "http://localhost:5001/api/me";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper to extract CSRF token from the cookie Flask just sent
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(ME_ENDPOINT, { 
        method: 'GET',
        credentials: "include", // Sends the access_token_cookie
        headers: {
          // Sends the CSRF token back to Flask
          "X-CSRF-TOKEN": getCookie('csrf_access_token') || "" 
        }
      });
  
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: any): Promise<boolean> => {
    try {
      // Initial Authentication
      await authService.login(credentials);
      
      // Pause: Let the browser update the "Cookie Jar"
      await new Promise(resolve => setTimeout(resolve, 150));
  
      // Reliable CSRF Extraction
      const getCSRF = () => {
        const match = document.cookie.match(/csrf_access_token=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
      };
  
      const token = getCSRF();
  
      // Identity Handshake
      const res = await fetch(ME_ENDPOINT, { 
        method: 'GET',
        credentials: 'include', 
        headers: {
          "X-CSRF-TOKEN": token || ""
        }
      });
  
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setLoading(false); // Open the ProtectedRoute gate
        return true;
      }
      
      return false;
    } catch (err) {
      console.error("Redirection Blocked: Handshake Failed", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      window.location.href = "/"; 
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};