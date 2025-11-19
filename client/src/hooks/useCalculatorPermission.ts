import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { RolePermission } from "@shared/schema";

export function useCalculatorPermission(calculatorName: string) {
  const { user } = useAuth();

  const { data: userPermissions } = useQuery<RolePermission[]>({
    queryKey: ['/api/user/permissions'],
  });

  // Super Admins and Admins have access to everything
  if (user?.role === 'super_admin' || user?.role === 'admin') {
    return {
      hasPermission: true,
      isLoading: false,
    };
  }

  // If no permissions data yet, loading state
  if (!userPermissions) {
    return {
      hasPermission: false,
      isLoading: true,
    };
  }

  // If not logged in and no permissions, show all (for non-authenticated users)
  if (!user && userPermissions.length === 0) {
    return {
      hasPermission: true,
      isLoading: false,
    };
  }

  // If logged in but has no permissions configured, deny access
  if (user && userPermissions.length === 0) {
    return {
      hasPermission: false,
      isLoading: false,
    };
  }

  // Debug: Log all permissions to see their structure
  if (userPermissions && userPermissions.length > 0 && calculatorName.includes("Tax")) {
    console.log("[DEBUG] All permissions for user:", userPermissions);
    console.log("[DEBUG] Looking for calculator:", calculatorName);
    console.log("[DEBUG] First permission structure:", userPermissions[0]);
  }

  // Check if user has permission for this specific calculator
  const hasPermission = userPermissions.some(
    permission => {
      const matches = permission.resourceType === 'calculator' && permission.resourceId === calculatorName;
      if (calculatorName.includes("Tax")) {
        console.log("[DEBUG] Checking permission:", {
          resourceType: permission.resourceType,
          resourceId: permission.resourceId,
          calculatorName,
          matches
        });
      }
      return matches;
    }
  );

  return {
    hasPermission,
    isLoading: false,
  };
}
