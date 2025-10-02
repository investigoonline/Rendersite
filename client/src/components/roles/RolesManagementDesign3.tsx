import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RolePermissions {
  pages: string[];
  calculatorCategories: string[];
  calculators: string[];
  resources: string[];
}

const pages = [
  "Home", "Register", "Resources", "About", "Contact", "Services",
  "FAQ", "Become Client", "Location", "Disclosures", "Custodian",
  "Content Management", "Admin Dashboard"
];

const calculatorCategories = [
  {
    id: "wealth_management",
    name: "Wealth Management",
    calculators: ["Total Net Worth", "Income to Debt Ratio"]
  },
  {
    id: "loans_credit",
    name: "Loans & Credit Cards",
    calculators: ["Loan Payoff Calculator", "Credit Card Debt"]
  },
  {
    id: "real_estate",
    name: "Real Estate & Housing",
    calculators: ["Home Affordability", "Mortgage Refinancing", "Mortgage Acceleration"]
  },
  {
    id: "vehicle_financing",
    name: "Vehicle Financing",
    calculators: ["Lease Payment", "Car Affordability"]
  },
  {
    id: "retirement_inflation",
    name: "Retirement & Inflation",
    calculators: ["Cost of Retirement", "RMD Calculator", "Impact of Inflation"]
  },
  {
    id: "estate_planning",
    name: "Estate Planning",
    calculators: ["Estate Tax Calculator", "Tax Planning Tools"]
  },
  {
    id: "taxes_iras",
    name: "Taxes & IRAs",
    calculators: ["Federal Income Tax", "IRA Eligibility", "Roth IRA Conversion"]
  },
  {
    id: "credit_debt",
    name: "Credit & Debt Management",
    calculators: ["Credit Score Impact", "Debt Consolidation"]
  },
];

const resources = ["Articles", "Videos", "Newsletters", "Flipbooks", "FAQs"];

const defaultPermissions: Record<string, RolePermissions> = {
  super_admin: {
    pages: pages,
    calculatorCategories: calculatorCategories.map(c => c.id),
    calculators: calculatorCategories.flatMap(c => c.calculators),
    resources: resources,
  },
  content_manager: {
    pages: pages.filter(p => p !== "Admin Dashboard"),
    calculatorCategories: [],
    calculators: [],
    resources: resources,
  },
  guest_user: {
    pages: pages.filter(p => p !== "Content Management" && p !== "Admin Dashboard"),
    calculatorCategories: ["vehicle_financing"],
    calculators: ["Lease Payment", "Car Affordability"],
    resources: resources,
  },
  preferred_client: {
    pages: pages.filter(p => p !== "Content Management" && p !== "Admin Dashboard"),
    calculatorCategories: calculatorCategories.map(c => c.id),
    calculators: calculatorCategories.flatMap(c => c.calculators),
    resources: resources,
  },
  client: {
    pages: pages.filter(p => p !== "Content Management" && p !== "Admin Dashboard"),
    calculatorCategories: calculatorCategories.map(c => c.id),
    calculators: calculatorCategories.flatMap(c => c.calculators),
    resources: resources,
  },
};

const rolesList = [
  { id: "super_admin", name: "Super Admin" },
  { id: "content_manager", name: "Content Manager" },
  { id: "guest_user", name: "Guest User" },
  { id: "preferred_client", name: "Preferred Client" },
  { id: "client", name: "Client" },
];

export default function RolesManagementDesign3() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState("super_admin");
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>(defaultPermissions);

  const togglePermission = (type: keyof RolePermissions, item: string) => {
    setPermissions(prev => {
      const rolePerms = prev[selectedRole];
      const currentList = rolePerms[type];
      const newList = currentList.includes(item)
        ? currentList.filter(i => i !== item)
        : [...currentList, item];
      
      return {
        ...prev,
        [selectedRole]: {
          ...rolePerms,
          [type]: newList,
        },
      };
    });
  };

  const toggleCategory = (categoryId: string) => {
    const category = calculatorCategories.find(c => c.id === categoryId);
    if (!category) return;

    setPermissions(prev => {
      const rolePerms = prev[selectedRole];
      const hasCategory = rolePerms.calculatorCategories.includes(categoryId);
      
      // Toggle category and all its calculators
      const newCategories = hasCategory
        ? rolePerms.calculatorCategories.filter(c => c !== categoryId)
        : [...rolePerms.calculatorCategories, categoryId];
      
      const newCalculators = hasCategory
        ? rolePerms.calculators.filter(calc => !category.calculators.includes(calc))
        : Array.from(new Set([...rolePerms.calculators, ...category.calculators]));

      return {
        ...prev,
        [selectedRole]: {
          ...rolePerms,
          calculatorCategories: newCategories,
          calculators: newCalculators,
        },
      };
    });
  };

  const selectAllInCategory = (categoryId: string) => {
    const category = calculatorCategories.find(c => c.id === categoryId);
    if (!category) return;

    setPermissions(prev => {
      const rolePerms = prev[selectedRole];
      return {
        ...prev,
        [selectedRole]: {
          ...rolePerms,
          calculatorCategories: Array.from(new Set([...rolePerms.calculatorCategories, categoryId])),
          calculators: Array.from(new Set([...rolePerms.calculators, ...category.calculators])),
        },
      };
    });
  };

  const copyPermissionsFrom = (fromRole: string) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: { ...prev[fromRole] },
    }));
    toast({
      title: "Permissions Copied",
      description: `Copied permissions from ${rolesList.find(r => r.id === fromRole)?.name}`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Permissions Saved",
      description: `${rolesList.find(r => r.id === selectedRole)?.name} permissions updated successfully`,
    });
  };

  const rolePerms = permissions[selectedRole];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Design 3: Role-First Permission Matrix</span>
          <Button onClick={handleSave} data-testid="button-save-design3">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Role to Configure:</label>
          <Tabs value={selectedRole} onValueChange={setSelectedRole}>
            <TabsList className="grid w-full grid-cols-5" data-testid="role-tabs">
              {rolesList.map(role => (
                <TabsTrigger key={role.id} value={role.id} data-testid={`tab-${role.id}`}>
                  {role.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Pages Access */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              ✅ PAGES ACCESS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pages.map(page => (
                <div key={page} className="flex items-center space-x-2" data-testid={`page-${page}`}>
                  <Checkbox
                    id={`page-${page}`}
                    checked={rolePerms.pages.includes(page)}
                    onCheckedChange={() => togglePermission("pages", page)}
                    data-testid={`checkbox-page-${page}`}
                  />
                  <label htmlFor={`page-${page}`} className="text-sm cursor-pointer">
                    {page}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
              <span>✅ CALCULATOR CATEGORIES</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  calculatorCategories.forEach(cat => selectAllInCategory(cat.id));
                }}
                data-testid="button-select-all-calculators"
              >
                Select All
              </Button>
            </h3>
            <div className="space-y-4">
              {calculatorCategories.map((category, index) => (
                <div key={category.id} className="border rounded-lg p-4" data-testid={`category-${index}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={rolePerms.calculatorCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                      data-testid={`checkbox-category-${category.id}`}
                    />
                    <label htmlFor={`category-${category.id}`} className="font-medium cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                  <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {category.calculators.map(calc => (
                      <div key={calc} className="flex items-center space-x-2" data-testid={`calculator-${calc}`}>
                        <Checkbox
                          id={`calc-${calc}`}
                          checked={rolePerms.calculators.includes(calc)}
                          onCheckedChange={() => togglePermission("calculators", calc)}
                          data-testid={`checkbox-calc-${calc}`}
                        />
                        <label htmlFor={`calc-${calc}`} className="text-sm cursor-pointer">
                          {calc}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Access */}
          <div>
            <h3 className="text-lg font-semibold mb-3">✅ RESOURCES ACCESS</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {resources.map(resource => (
                <div key={resource} className="flex items-center space-x-2" data-testid={`resource-${resource}`}>
                  <Checkbox
                    id={`resource-${resource}`}
                    checked={rolePerms.resources.includes(resource)}
                    onCheckedChange={() => togglePermission("resources", resource)}
                    data-testid={`checkbox-resource-${resource}`}
                  />
                  <label htmlFor={`resource-${resource}`} className="text-sm cursor-pointer">
                    {resource}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const otherRoles = rolesList.filter(r => r.id !== selectedRole);
                if (otherRoles.length > 0) {
                  copyPermissionsFrom(otherRoles[0].id);
                }
              }}
              data-testid="button-copy-permissions"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Permissions From...
            </Button>
          </div>
          <Button onClick={handleSave} size="lg" data-testid="button-save-role-permissions">
            <Save className="h-4 w-4 mr-2" />
            Save Role Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
