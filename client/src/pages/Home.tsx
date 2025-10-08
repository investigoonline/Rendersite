import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Clock,
  ChevronRight,
  CreditCard
} from "lucide-react";
import type { PageContent } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  // Fetch home page content
  const { data: homeContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content?page=home'],
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return homeContent?.find(c => c.section === sectionName);
  };

  // Extract content sections
  const heroContent = getSection('home_hero')?.content as any;
  const statsContent = getSection('home_stats')?.content as any;
  const quickActionsContent = getSection('home_quick_actions')?.content as any;
  const calculatorsContent = getSection('home_calculators')?.content as any;

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Calculator,
      TrendingUp,
      PieChart,
      FileText,
      Clock,
      CreditCard,
    };
    return icons[iconName] || Calculator;
  };

  const stats = statsContent?.stats || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {heroContent?.title || "Welcome to InvestigooOnline"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {heroContent?.subtitle || "Your comprehensive financial planning platform with expert tools and resources"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {stats.map((stat: any, index: number) => {
            const IconComponent = getIcon(stat.icon);
            const colorClass = index % 3 === 0 ? 'text-primary' : index % 3 === 1 ? 'text-secondary' : 'text-accent';
            
            return (
              <Card key={index}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${colorClass} flex-shrink-0`} />
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          {quickActionsContent?.actions && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {quickActionsContent.actions.map((action: any, index: number) => {
                      const IconComponent = getIcon(action.icon);
                      return (
                        <Button key={index} asChild variant="outline" className="h-auto p-4 flex-col">
                          <Link href={action.href}>
                            <IconComponent className={`h-8 w-8 mb-2 ${action.color}`} />
                            <span className="font-semibold">{action.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {action.description}
                            </span>
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Calculators */}
              {calculatorsContent?.calculators && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{calculatorsContent.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{calculatorsContent.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {calculatorsContent.calculators.map((calc: any, index: number) => {
                        const IconComponent = getIcon(calc.icon);
                        return (
                          <Button key={index} asChild variant="outline" className="h-auto p-3 justify-start">
                            <Link href={calc.href}>
                              <IconComponent className={`h-5 w-5 mr-3 ${calc.color}`} />
                              <div className="text-left">
                                <div className="font-medium">{calc.title}</div>
                                <div className="text-xs text-muted-foreground">{calc.description}</div>
                              </div>
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Sidebar - Only shown if authenticated */}
          {user && (
            <div className="space-y-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <Badge>{user.role === 'super_admin' ? 'Super Admin' : user.role === 'content_manager' ? 'Content Manager' : user.role === 'preferred_client' ? 'Preferred Client' : 'Client'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Login</span>
                      <div className="flex items-center text-sm font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        Today
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get instant calculations for your financial planning needs.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/calculators">
                      Open Calculator Suite
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
