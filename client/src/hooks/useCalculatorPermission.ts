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
