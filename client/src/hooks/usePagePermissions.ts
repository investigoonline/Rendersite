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

  const { data: permissions = [], isLoading } = useQuery<RolePermission[]>({
    queryKey: ["/api/user/permissions"],
    enabled: isAuthenticated,
  });

  const hasPageAccess = (pageId: string): boolean => {
    if (!isAuthenticated || !user) {
      return true;
    }
    
    if (user.role === 'super_admin') {
      return true;
    }

    const pagePermissions = permissions.filter(p => p.resourceType === 'page');
    
    if (pagePermissions.length === 0) {
      return true;
    }

    return pagePermissions.some(p => p.resourceId === pageId);
  };

  const hasResourceTypeAccess = (resourceType: string): boolean => {
    if (!isAuthenticated || !user) {
      return true;
    }
    
    if (user.role === 'super_admin') {
      return true;
    }

    const resourcePermissions = permissions.filter(p => p.resourceType === 'resource_type');
    
    if (resourcePermissions.length === 0) {
      return true;
    }

    return resourcePermissions.some(p => p.resourceId === resourceType);
  };

  const hasCalculatorCategoryAccess = (categoryId: string): boolean => {
    if (!isAuthenticated || !user) {
      return true;
    }
    
    if (user.role === 'super_admin') {
      return true;
    }

    const categoryPermissions = permissions.filter(p => p.resourceType === 'calculator_category');
    
    if (categoryPermissions.length === 0) {
      return true;
    }

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
