import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface RolePermission {
  id: string;
  role: string;
  resourceType: string;
  resourceId: string;
}

export function usePagePermissions() {
  const { user, isAuthenticated } = useAuth();

  // Fetch permissions for authenticated users
  const { data: userPermissions = [], isLoading: userLoading } = useQuery<RolePermission[]>({
    queryKey: ["/api/user/permissions"],
    enabled: isAuthenticated,
  });

  // Fetch guest permissions for unauthenticated users
  const { data: guestPermissions = [], isLoading: guestLoading } = useQuery<RolePermission[]>({
    queryKey: ["/api/guest/permissions"],
    enabled: !isAuthenticated,
  });

  const permissions = isAuthenticated ? userPermissions : guestPermissions;
  const isLoading = isAuthenticated ? userLoading : guestLoading;

  const hasPageAccess = (pageId: string): boolean => {
    const pagePermissions = permissions.filter(p => p.resourceType === 'page');
    return pagePermissions.some(p => p.resourceId === pageId);
  };

  const hasResourceTypeAccess = (resourceType: string): boolean => {
    const resourcePermissions = permissions.filter(p => p.resourceType === 'resource_type');
    return resourcePermissions.some(p => p.resourceId === resourceType);
  };

  const hasCalculatorCategoryAccess = (categoryId: string): boolean => {
    const categoryPermissions = permissions.filter(p => p.resourceType === 'calculator_category');
    return categoryPermissions.some(p => p.resourceId === categoryId);
  };

  return {
    permissions,
    isLoading,
    hasPageAccess,
    hasResourceTypeAccess,
    hasCalculatorCategoryAccess,
  };
}
