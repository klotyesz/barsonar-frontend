import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react"
import type { User } from "../interfaces/User";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const me = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      })

      if (res.ok) {
        const data: User = await res.json();

        login(data.id.toString())

        return
      }

      if (res.status == 401) {
        logout()
        return
      }

      return res.json()
    } catch (err) {
      logout()
      return err
    }
  }

  useEffect(() => {
    me()
  }, []);

  const login = (userId: string) => {
    setIsAuthenticated(true);
    setUserId(userId);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", userId);
  }

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
