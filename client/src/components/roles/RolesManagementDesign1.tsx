import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { RolePermission } from "@shared/schema";

interface Permission {
  resource: string;
  type: 'page' | 'calculator' | 'category';
  parentId?: string;
  icon?: string;
}

const permissions: Permission[] = [
  { resource: "Home (Landing/Dashboard)", type: "page", icon: "🏠" },
  { resource: "Register", type: "page", icon: "📝" },
  { resource: "Resources", type: "page", icon: "📊" },
  { resource: "About", type: "page", icon: "ℹ️" },
  { resource: "Contact", type: "page", icon: "📧" },
  { resource: "Services", type: "page", icon: "🛠️" },
  { resource: "FAQ", type: "page", icon: "❓" },
  { resource: "Become Client", type: "page", icon: "👥" },
  { resource: "Location", type: "page", icon: "📍" },
  { resource: "Disclosures", type: "page", icon: "📋" },
  { resource: "Custodian", type: "page", icon: "🏦" },
  { resource: "Content Management", type: "page", icon: "⚙️" },
  { resource: "Admin Dashboard", type: "page", icon: "🎛️" },
  { resource: "CALCULATORS", type: "category", icon: "🧮" },
  { resource: "Wealth Management", type: "category", parentId: "CALCULATORS", icon: "💰" },
  { resource: "Total Net Worth Calculator", type: "calculator", parentId: "Wealth Management" },
  { resource: "Income to Debt Ratio Calculator", type: "calculator", parentId: "Wealth Management" },
  { resource: "Loans & Credit Cards", type: "category", parentId: "CALCULATORS", icon: "💳" },
  { resource: "Loan Payoff Calculator", type: "calculator", parentId: "Loans & Credit Cards" },
  { resource: "Credit Card Debt Calculator", type: "calculator", parentId: "Loans & Credit Cards" },
  { resource: "Real Estate & Housing", type: "category", parentId: "CALCULATORS", icon: "🏡" },
  { resource: "Home Affordability Calculator", type: "calculator", parentId: "Real Estate & Housing" },
  { resource: "Mortgage Refinancing Calculator", type: "calculator", parentId: "Real Estate & Housing" },
  { resource: "Mortgage Acceleration Calculator", type: "calculator", parentId: "Real Estate & Housing" },
  { resource: "Vehicle Financing", type: "category", parentId: "CALCULATORS", icon: "🚗" },
  { resource: "Lease Payment Calculator", type: "calculator", parentId: "Vehicle Financing" },
  { resource: "Car Affordability Calculator", type: "calculator", parentId: "Vehicle Financing" },
  { resource: "Retirement & Inflation", type: "category", parentId: "CALCULATORS", icon: "🏦" },
  { resource: "Cost of Retirement Calculator", type: "calculator", parentId: "Retirement & Inflation" },
  { resource: "Required Minimum Distributions (RMD)", type: "calculator", parentId: "Retirement & Inflation" },
  { resource: "Impact of Inflation Calculator", type: "calculator", parentId: "Retirement & Inflation" },
  { resource: "Retirement Plan Early Distribution", type: "calculator", parentId: "Retirement & Inflation" },
  { resource: "Retirement Portfolio Lifespan", type: "calculator", parentId: "Retirement & Inflation" },
  { resource: "Estate Planning", type: "category", parentId: "CALCULATORS", icon: "📜" },
  { resource: "Estate Tax Calculator", type: "calculator", parentId: "Estate Planning" },
  { resource: "Taxes & IRAs", type: "category", parentId: "CALCULATORS", icon: "💼" },
  { resource: "Federal Income Tax Calculator", type: "calculator", parentId: "Taxes & IRAs" },
  { resource: "Tax-Deferred Savings Calculator", type: "calculator", parentId: "Taxes & IRAs" },
  { resource: "IRA Eligibility Calculator", type: "calculator", parentId: "Taxes & IRAs" },
  { resource: "Roth IRA Conversion Calculator", type: "calculator", parentId: "Taxes & IRAs" },
  { resource: "Credit & Debt Management", type: "category", parentId: "CALCULATORS", icon: "📈" },
  { resource: "Credit Score Impact Analysis", type: "calculator", parentId: "Credit & Debt Management" },
  { resource: "Debt Consolidation Calculator", type: "calculator", parentId: "Credit & Debt Management" },
];

const roles = [
  { id: "super_admin", name: "Super Admin" },
  { id: "admin", name: "System Admin" },
  { id: "content_manager", name: "Content Manager" },
  { id: "guest_user", name: "Guest User" },
  { id: "preferred_client", name: "Preferred Client" },
  { id: "client", name: "Client" },
  { id: "unregistered", name: "Unregistered" },
];

// Default permissions mapping
const defaultPermissions: Record<string, string[]> = {
  "super_admin": permissions.map(p => p.resource),
  "admin": permissions.map(p => p.resource),
  "content_manager": [
    "Home (Landing/Dashboard)", "Register", "Resources", "About", "Contact", 
    "Services", "FAQ", "Become Client", "Location", "Disclosures", "Custodian", 
    "Content Management"
  ],
  "guest_user": [
    "Home (Landing/Dashboard)", "Register", "Resources", "About", "Contact",
    "Services", "FAQ", "Become Client", "Location", "Disclosures", "Custodian",
    "CALCULATORS", "Vehicle Financing", "Lease Payment Calculator", "Car Affordability Calculator"
  ],
  "preferred_client": permissions.filter(p => p.resource !== "Content Management" && p.resource !== "Admin Dashboard").map(p => p.resource),
  "client": permissions.filter(p => p.resource !== "Content Management" && p.resource !== "Admin Dashboard").map(p => p.resource),
  "unregistered": [
    "Home (Landing/Dashboard)", "Register", "About", "Contact",
    "Services", "FAQ", "Become Client", "Location", "Disclosures", "Custodian",
    "Privacy Policy", "Terms of Service"
  ],
};

export default function RolesManagementDesign1() {
  const { toast } = useToast();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["CALCULATORS"]));
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});

  // Fetch permissions from database
  const { data: dbPermissions, isLoading } = useQuery<RolePermission[]>({
    queryKey: ['/api/admin/role-permissions'],
  });

  // Initialize permissions from database
  useEffect(() => {
    if (dbPermissions) {
      const permissionsMap: Record<string, string[]> = {};
      
      // Initialize with empty arrays for all roles
      roles.forEach(role => {
        permissionsMap[role.id] = [];
      });

      // Populate from database
      dbPermissions.forEach(perm => {
        if (!permissionsMap[perm.role]) {
          permissionsMap[perm.role] = [];
        }
        permissionsMap[perm.role].push(perm.resourceId);
      });

      setRolePermissions(permissionsMap);
    } else {
      // Use default permissions if nothing in database
      setRolePermissions(defaultPermissions);
    }
  }, [dbPermissions]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Convert rolePermissions to database format
      const permissionsArray: any[] = [];
      
      Object.entries(rolePermissions).forEach(([roleId, resources]) => {
        resources.forEach(resourceId => {
          // Determine resource type
          let resourceType = 'page';
          const permission = permissions.find(p => p.resource === resourceId);
          if (permission) {
            if (permission.type === 'calculator') {
              resourceType = 'calculator';
            } else if (permission.type === 'category') {
              resourceType = 'calculator_category';
            }
          }

          permissionsArray.push({
            role: roleId,
            resourceType,
            resourceId,
          });
        });
      });

      return apiRequest('/api/admin/role-permissions', 'POST', { permissions: permissionsArray });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/role-permissions'] });
      toast({
        title: "Permissions Saved",
        description: "Role permissions have been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save permissions",
        variant: "destructive",
      });
    },
  });

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Helper to get all children of a resource (recursive)
  const getAllChildren = (parentResource: string): string[] => {
    const directChildren = permissions.filter(p => p.parentId === parentResource);
    const allChildren: string[] = [];
    
    directChildren.forEach(child => {
      allChildren.push(child.resource);
      // Recursively get children of children
      const grandChildren = getAllChildren(child.resource);
      allChildren.push(...grandChildren);
    });
    
    return allChildren;
  };

  const togglePermission = (roleId: string, resource: string) => {
    setRolePermissions(prev => {
      const current = prev[roleId] || [];
      const isCurrentlyChecked = current.includes(resource);
      
      // Get all children of this resource
      const children = getAllChildren(resource);
      
      let newPermissions: string[];
      
      if (isCurrentlyChecked) {
        // Unchecking: remove this resource and all its children
        newPermissions = current.filter(r => r !== resource && !children.includes(r));
      } else {
        // Checking: add this resource and all its children
        const toAdd = [resource, ...children];
        newPermissions = [...current, ...toAdd.filter(r => !current.includes(r))];
      }
      
      return { ...prev, [roleId]: newPermissions };
    });
  };

  const hasPermission = (roleId: string, resource: string) => {
    return rolePermissions[roleId]?.includes(resource) || false;
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  const renderPermissionRow = (permission: Permission, level: number = 0): JSX.Element => {
    const isCategory = permission.type === "category";
    const isExpanded = expandedCategories.has(permission.resource);
    const children = permissions.filter(p => p.parentId === permission.resource);

    return (
      <>
        <tr key={permission.resource} className="border-b hover:bg-gray-50" data-testid={`permission-row-${permission.resource}`}>
          <td className="py-3 px-4" style={{ paddingLeft: `${level * 2 + 1}rem` }}>
            <div className="flex items-center">
              {isCategory && children.length > 0 && (
                <button
                  onClick={() => toggleCategory(permission.resource)}
                  className="mr-2"
                  data-testid={`toggle-category-${permission.resource}`}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              )}
              {!isCategory && children.length === 0 && <span className="mr-6"></span>}
              <span className={isCategory ? "font-semibold" : ""}>
                {permission.icon && <span className="mr-2">{permission.icon}</span>}
                {permission.resource}
              </span>
            </div>
          </td>
          {roles.map(role => (
            <td key={role.id} className="py-3 px-4 text-center" data-testid={`permission-${permission.resource}-${role.id}`}>
              <Checkbox
                checked={hasPermission(role.id, permission.resource)}
                onCheckedChange={() => togglePermission(role.id, permission.resource)}
                data-testid={`checkbox-${permission.resource}-${role.id}`}
              />
            </td>
          ))}
        </tr>
        {isCategory && isExpanded && children.map(child => renderPermissionRow(child, level + 1))}
      </>
    );
  };

  const topLevelPermissions = permissions.filter(p => !p.parentId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Design 1: Hierarchical Matrix View</span>
          <Button onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-design1">
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Resource</th>
                {roles.map(role => (
                  <th key={role.id} className="text-center py-3 px-4 font-medium text-gray-700 min-w-[100px]" data-testid={`header-${role.id}`}>
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topLevelPermissions.map(permission => renderPermissionRow(permission))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" data-testid="button-bulk-actions">
            Bulk Actions
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-changes">
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
