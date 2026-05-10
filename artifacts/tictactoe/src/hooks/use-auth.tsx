import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
  isPremium?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: (address: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        username: email.split("@")[0],
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        username,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const connectWallet = useCallback(async (address: string) => {
    if (user) {
      const updatedUser = { ...user, walletAddress: address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        connectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
