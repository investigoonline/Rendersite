import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalculatorCategory {
  id: string;
  name: string;
  icon: string;
  calculators: string[];
  allowedRoles: string[];
}

const pages = [
  { name: "Home", allowedRoles: ["all"] },
  { name: "Register", allowedRoles: ["all"] },
  { name: "Resources", allowedRoles: ["all"] },
  { name: "About", allowedRoles: ["all"] },
  { name: "Contact", allowedRoles: ["all"] },
  { name: "Services", allowedRoles: ["all"] },
  { name: "FAQ", allowedRoles: ["all"] },
  { name: "Become Client", allowedRoles: ["all"] },
  { name: "Location", allowedRoles: ["all"] },
  { name: "Disclosures", allowedRoles: ["all"] },
  { name: "Custodian", allowedRoles: ["all"] },
  { name: "Content Management", allowedRoles: ["super_admin", "content_manager"] },
  { name: "Admin Dashboard", allowedRoles: ["super_admin"] },
];

const calculatorCategories: CalculatorCategory[] = [
  {
    id: "wealth_management",
    name: "Wealth Management",
    icon: "💰",
    calculators: ["Total Net Worth Calculator", "Income to Debt Ratio"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
  {
    id: "loans_credit",
    name: "Loans & Credit Cards",
    icon: "💳",
    calculators: ["Loan Payoff Calculator", "Credit Card Debt Analysis"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
  {
    id: "real_estate",
    name: "Real Estate & Housing",
    icon: "🏡",
    calculators: ["Home Affordability", "Mortgage Refinancing", "Mortgage Acceleration"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
  {
    id: "vehicle_financing",
    name: "Vehicle Financing",
    icon: "🚗",
    calculators: ["Lease Payment Calculator", "Car Affordability Analysis"],
    allowedRoles: ["all"],
  },
  {
    id: "retirement_inflation",
    name: "Retirement & Inflation",
    icon: "🏦",
    calculators: ["Cost of Retirement", "RMD Calculator", "Impact of Inflation", "Early Distribution", "Portfolio Lifespan"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
  {
    id: "estate_planning",
    name: "Estate Planning",
    icon: "📜",
    calculators: ["Estate Tax Calculator", "Tax Planning Tools"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
  {
    id: "taxes_iras",
    name: "Taxes & IRAs",
    icon: "💼",
    calculators: ["Federal Income Tax", "IRA Eligibility", "Roth IRA Conversion"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
  {
    id: "credit_debt",
    name: "Credit & Debt Management",
    icon: "📈",
    calculators: ["Credit Score Impact", "Debt Consolidation"],
    allowedRoles: ["super_admin", "preferred_client", "client"],
  },
];

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "content_manager", label: "Content Manager" },
  { value: "guest_user", label: "Guest User" },
  { value: "preferred_client", label: "Preferred Client" },
  { value: "client", label: "Client" },
];

export default function RolesManagementDesign2() {
  const { toast } = useToast();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [pagePermissions, setPagePermissions] = useState(pages);
  const [categoryPermissions, setCategoryPermissions] = useState(calculatorCategories);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const updatePageRoles = (pageName: string, roles: string) => {
    setPagePermissions(prev =>
      prev.map(page =>
        page.name === pageName
          ? { ...page, allowedRoles: roles === "all" ? ["all"] : [roles] }
          : page
      )
    );
  };

  const updateCategoryRoles = (categoryId: string, roles: string) => {
    setCategoryPermissions(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, allowedRoles: roles === "all" ? ["all"] : roles.split(",") }
          : cat
      )
    );
  };

  const getRoleDisplay = (allowedRoles: string[]) => {
    if (allowedRoles.includes("all")) return "All Roles";
    return allowedRoles.map(r => roleOptions.find(ro => ro.value === r)?.label || r).join(", ");
  };

  const handleSave = () => {
    toast({
      title: "Permissions Saved",
      description: "Role permissions have been updated successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Design 2: Card-Based Permission Groups</span>
          <Button onClick={handleSave} data-testid="button-save-design2">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pages Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📄 Pages & Navigation
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Page</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 min-w-[250px]">Allowed Roles</th>
                </tr>
              </thead>
              <tbody>
                {pagePermissions.map((page, index) => (
                  <tr key={page.name} className="border-t" data-testid={`page-row-${index}`}>
                    <td className="py-3 px-4">{page.name}</td>
                    <td className="py-3 px-4">
                      <Select
                        value={page.allowedRoles[0]}
                        onValueChange={(value) => updatePageRoles(page.name, value)}
                      >
                        <SelectTrigger data-testid={`select-page-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculators Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🧮 Calculators Access Control
          </h3>
          <div className="space-y-4">
            {categoryPermissions.map((category, index) => (
              <Card key={category.id} className="border-2" data-testid={`category-card-${index}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <CardTitle className="text-base">
                          {category.name}
                          <Badge variant="secondary" className="ml-2">
                            {category.calculators.length} calculators
                          </Badge>
                        </CardTitle>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-2"
                      data-testid={`toggle-category-${index}`}
                    >
                      {expandedCategories.has(category.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Access:</span>
                    <Select
                      value={category.allowedRoles.join(",")}
                      onValueChange={(value) => updateCategoryRoles(category.id, value)}
                    >
                      <SelectTrigger className="w-[300px]" data-testid={`select-category-${index}`}>
                        <SelectValue>
                          {getRoleDisplay(category.allowedRoles)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                {expandedCategories.has(category.id) && (
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {category.calculators.map((calc, calcIndex) => (
                        <li key={calcIndex} className="flex items-center" data-testid={`calculator-${index}-${calcIndex}`}>
                          <span className="mr-2">├─</span>
                          {calc}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" data-testid="button-save-all-design2">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
