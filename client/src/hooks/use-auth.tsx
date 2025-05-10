import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
  isAuthenticated: boolean;
};

type LoginData = Pick<InsertUser, "username" | "password">;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Enhanced query with better error handling
  const {
    data: user,
    error,
    isLoading,
    refetch
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal,
        });
        
        console.log("User API response status:", response.status);
        
        // Return null for 401/unauthorized to handle gracefully
        if (response.status === 401) {
          setIsAuthenticated(false);
          return null;
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        
        const userData = await response.json();
        console.log("User data received:", userData);
        setIsAuthenticated(true);
        return userData;
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Request was aborted");
        }
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  // Log authentication state changes
  useEffect(() => {
    console.log("Authentication state:", { isAuthenticated, user: !!user });
  }, [isAuthenticated, user]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Logging in with:", credentials.username);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Login failed");
      }
      
      const userData = await res.json();
      return userData;
    },
    onSuccess: (user: User) => {
      console.log("Login successful:", user);
      queryClient.setQueryData(["/api/user"], user);
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      console.log("Registering user:", userData.username);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || "Registration failed");
      }
      
      const newUser = await res.json();
      return newUser;
    },
    onSuccess: (user: User) => {
      console.log("Registration successful:", user);
      queryClient.setQueryData(["/api/user"], user);
      setIsAuthenticated(true);
      
      toast({
        title: "Account created",
        description: `Welcome, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Logging out");
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Logout failed" }));
        throw new Error(errorData.message || "Logout failed");
      }
    },
    onSuccess: () => {
      console.log("Logout successful");
      queryClient.setQueryData(["/api/user"], null);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        refetch,
        loginMutation,
        logoutMutation,
        registerMutation,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}