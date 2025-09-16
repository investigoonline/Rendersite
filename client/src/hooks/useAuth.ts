import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { User } from "@shared/schema";

interface GuestAccount {
  id: string;
  email: string;
  guestType: string;
  verified: boolean;
  expiresAt: string;
}

export function useAuth() {
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

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
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

  const hasCalculatorAccess = (categoryId: string) => {
    const accessLevel = getAccessLevel();
    if (accessLevel === "full") {
      return true;
    } else if (accessLevel === "limited") {
      return categoryId === "vehicle_financing";
    }
    return false;
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
  };
}
