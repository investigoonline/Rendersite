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

  // If user has no permissions (not logged in or no permissions set), deny access to calculators
  if (userPermissions.length === 0) {
    return {
      hasPermission: false,
      isLoading: false,
    };
  }

  // Check if user has permission for this specific calculator
  const hasPermission = userPermissions.some(
    permission => 
      permission.resourceType === 'calculator' && 
      permission.resourceId === calculatorName
  );

  return {
    hasPermission,
    isLoading: false,
  };
}
