import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sparkles,
  Calculator,
  Clock,
  TrendingUp,
  PieChart,
  CreditCard,
  Building,
  Car,
  Shield,
  DollarSign,
} from "lucide-react";
import type { PageContent, RolePermission } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  // Fetch home page content
  const { data: homeContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content?page=home'],
  });

  // Fetch user permissions
  const { data: userPermissions } = useQuery<RolePermission[]>({
    queryKey: ['/api/user/permissions'],
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return homeContent?.find(c => c.section === sectionName);
  };

  // Extract content sections
  const heroContent = getSection('home_hero')?.content as any;
  const statsContent = getSection('home_stats')?.content as any;
  const portfolioContent = getSection('home_portfolio')?.content as any;
  const calculatorCategoriesContent = getSection('home_calculator_categories')?.content as any;

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Sparkles,
      Calculator,
      Clock,
      TrendingUp,
      PieChart,
      CreditCard,
      Building,
      Car,
      Shield,
      DollarSign,
    };
    return icons[iconName] || Calculator;
  };

  const stats = statsContent?.stats || [];
  const Badge1Icon = heroContent?.badge1Icon ? getIcon(heroContent.badge1Icon) : Sparkles;
  const Badge2Icon = heroContent?.badge2Icon ? getIcon(heroContent.badge2Icon) : Calculator;

  // Helper to check if user has permission for a specific calculator
  const hasCalculatorPermission = (calculatorName: string): boolean => {
    // Super Admins and Admins have access to everything
    if (user?.role === 'super_admin' || user?.role === 'admin') {
      return true;
    }

    // If no permissions data yet, show nothing (loading state)
    if (!userPermissions) return false;
    
    // If not logged in and no permissions, show all (for non-authenticated users)
    if (!user && userPermissions.length === 0) return true;
    
    // If logged in but has no permissions configured, deny access
    if (user && userPermissions.length === 0) return false;
    
    // Check if user has permission for this specific calculator
    return userPermissions.some(
      permission => 
        permission.resourceType === 'calculator' && 
        permission.resourceId === calculatorName
    );
  };

  // Filter categories and their calculators based on permissions
  const filteredCategories = calculatorCategoriesContent?.categories?.map((category: any) => {
    // Filter calculators within this category
    const filteredCalculators = category.calculators?.filter((calc: string) => 
      hasCalculatorPermission(calc)
    ) || [];
    
    return {
      ...category,
      calculators: filteredCalculators
    };
  }).filter((category: any) => 
    // Only show categories that have at least one accessible calculator
    category.calculators && category.calculators.length > 0
  ) || [];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-gray-900">{heroContent?.titlePart1 || "Your Complete"} </span>
            <span className="text-primary">{heroContent?.titleHighlight || "Financial Intelligence"} </span>
            <span className="text-gray-900">{heroContent?.titlePart2 || "Platform"}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {heroContent?.subtitle || "Comprehensive financial planning tools, AI-driven insights, and personalized recommendations. From wealth management to retirement planning - all in one secure platform."}
          </p>
        </div>

        {/* Calculator Categories Section */}
        {calculatorCategoriesContent && filteredCategories.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {calculatorCategoriesContent.title}
              </h2>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">
                {calculatorCategoriesContent.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category: any) => {
                const CategoryIcon = getIcon(category.icon);
                return (
                  <Card 
                    key={category.id} 
                    className="hover:shadow-lg transition-shadow"
                    data-testid={`category-${category.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <CategoryIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <ul className="space-y-2">
                        {category.calculators?.map((calc: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-primary mr-2">✓</span>
                            {calc}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" className="px-8" data-testid="button-access-calculators">
                <Link href="/calculators">
                  Access All Calculators
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
