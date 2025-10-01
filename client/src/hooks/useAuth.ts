import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import type { User } from "@shared/schema";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

interface GuestAccount {
  id: string;
  email: string;
  guestType: string;
  verified: boolean;
  expiresAt: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  // Initialize guest account synchronously to avoid timing issues
  const initializeGuestAccount = () => {
    try {
      const storedGuest = localStorage.getItem("guestAccount");
      if (storedGuest) {
        return JSON.parse(storedGuest);
      }
    } catch (error) {
      console.error("Failed to parse guest account:", error);
      localStorage.removeItem("guestAccount");
    }
    return null;
  };

  const [guestAccount, setGuestAccount] = useState<GuestAccount | null>(initializeGuestAccount);

  // Update guest account if localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setGuestAccount(initializeGuestAccount());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn<User | null>({ on401: "returnNull" }),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000, // 5 minutes
  });

  // Determine user type and access level
  const isRegisteredUser = !!user;
  const isGuestUser = !user && !!guestAccount;
  const isAuthenticated = isRegisteredUser || isGuestUser;

  // Access control helper
  const getAccessLevel = () => {
    if (isRegisteredUser) {
      return "full"; // Full access to all 32 calculators across 8 categories
    } else if (isGuestUser) {
      return "limited"; // Limited access to Vehicle Financing calculators only
    }
    return "none"; // No access
  };

  const hasCalculatorAccess = useCallback((categoryId: string) => {
    const accessLevel = getAccessLevel();
    if (accessLevel === "full") {
      return true;
    } else if (accessLevel === "limited") {
      return categoryId === "vehicle_financing";
    }
    return false;
  }, [isRegisteredUser, isGuestUser]);

  // Logout function that handles both registered users and guest users
  const logout = async () => {
    if (isRegisteredUser) {
      try {
        await apiRequest("POST", "/api/auth/logout");
        // Clear user query cache after successful logout
        queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
        // Redirect to home page
        window.location.href = "/";
      } catch (error) {
        console.error("Logout failed:", error);
        // Force logout by clearing cache and redirecting
        queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
        window.location.href = "/";
      }
    } else if (isGuestUser) {
      // For guest users, clear localStorage and update state
      localStorage.removeItem("guestAccount");
      setGuestAccount(null);
      // Clear user query cache to ensure clean state
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
      // Redirect to home page
      window.location.href = "/";
    }
  };

  return {
    user,
    guestAccount,
    isLoading,
    isAuthenticated,
    isRegisteredUser,
    isGuestUser,
    accessLevel: getAccessLevel(),
    hasCalculatorAccess,
    logout,
  };
}
