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
    queryKey: ['/api/content', 'home'],
  });

  // Extract content sections
  const heroContent = homeContent?.find(c => c.section === 'home_hero')?.content as { title?: string; subtitle?: string } | undefined;
  const statsContent = homeContent?.find(c => c.section === 'home_stats')?.content as { stats?: Array<{ icon: string; label: string; value: string }> } | undefined;

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

  // Default stats if no content is loaded
  const defaultStats = [
    { icon: "Calculator", label: "Calculations Saved", value: "12" },
    { icon: "TrendingUp", label: "Net Worth Growth", value: "+8.4%" },
    { icon: "PieChart", label: "Portfolio Value", value: "$1.2M" },
    { icon: "FileText", label: "Reports Generated", value: "8" }
  ];

  const stats = statsContent?.stats || defaultStats;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {heroContent?.title || `Welcome back, ${user?.firstName || user?.email}`}
          </h1>
          <p className="text-muted-foreground mt-2">
            {heroContent?.subtitle || "Manage your financial planning and track your progress."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {stats.map((stat, index) => {
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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button asChild variant="outline" className="h-auto p-4 flex-col">
                    <Link href="/calculators?calculator=net_worth&category=wealth_management">
                      <PieChart className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-semibold">Net Worth Calculator</span>
                      <span className="text-xs text-muted-foreground">
                        Calculate your total net worth
                      </span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 flex-col">
                    <Link href="/resources">
                      <FileText className="h-8 w-8 mb-2 text-secondary" />
                      <span className="font-semibold">Browse Resources</span>
                      <span className="text-xs text-muted-foreground">
                        Articles, videos, and guides
                      </span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 flex-col">
                    <Link href="/portfolio">
                      <PieChart className="h-8 w-8 mb-2 text-accent" />
                      <span className="font-semibold">View Portfolio</span>
                      <span className="text-xs text-muted-foreground">
                        Track your investments
                      </span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 flex-col">
                    <Link href="/reports">
                      <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-semibold">Generate Report</span>
                      <span className="text-xs text-muted-foreground">
                        Financial analysis reports
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Calculators */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Popular Calculators</CardTitle>
                <p className="text-sm text-muted-foreground">Quick access to frequently used calculators</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="h-auto p-3 justify-start">
                    <Link href="/calculators?calculator=net_worth&category=wealth_management">
                      <PieChart className="h-5 w-5 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Net Worth Calculator</div>
                        <div className="text-xs text-muted-foreground">Track your wealth</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-3 justify-start">
                    <Link href="/calculators?calculator=loan_payoff&category=loans_credit">
                      <CreditCard className="h-5 w-5 mr-3 text-secondary" />
                      <div className="text-left">
                        <div className="font-medium">Loan Payoff</div>
                        <div className="text-xs text-muted-foreground">Debt payoff strategy</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-3 justify-start">
                    <Link href="/calculators?calculator=mortgage_refinance&category=real_estate">
                      <TrendingUp className="h-5 w-5 mr-3 text-accent" />
                      <div className="text-left">
                        <div className="font-medium">Mortgage Refinance</div>
                        <div className="text-xs text-muted-foreground">Refinancing analysis</div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-3 justify-start">
                    <Link href="/calculators?calculator=retirement_cost&category=retirement_inflation">
                      <Clock className="h-5 w-5 mr-3 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Retirement Cost</div>
                        <div className="text-xs text-muted-foreground">Plan retirement</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Net Worth Calculation",
                      time: "2 hours ago",
                      result: "$1,247,832",
                      type: "calculation",
                      link: "/calculators?calculator=net_worth&category=wealth_management"
                    },
                    {
                      action: "Retirement Planning Report",
                      time: "1 day ago",
                      result: "Generated PDF",
                      type: "report",
                      link: "/calculators?calculator=retirement_cost&category=retirement_inflation"
                    },
                    {
                      action: "Mortgage Refinance Calculator",
                      time: "3 days ago",
                      result: "Save $47,000",
                      type: "calculation",
                      link: "/calculators?calculator=mortgage_refinance&category=real_estate"
                    }
                  ].map((item, index) => (
                    <Link key={index} href={item.link} className="block">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {item.type === 'calculation' ? 
                              <Calculator className="h-4 w-4 text-primary" /> :
                              <FileText className="h-4 w-4 text-secondary" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.action}</p>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center">
                          <Badge variant="secondary" className="mr-2">{item.result}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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
                    <Badge>Premium Client</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="text-sm font-medium">Jan 2024</span>
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

            {/* Market Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Market Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-secondary/5 rounded-lg">
                    <h4 className="font-medium text-secondary mb-1">
                      S&P 500 Reaches New High
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Market continues upward trend with strong earnings reports.
                    </p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <h4 className="font-medium text-primary mb-1">
                      Fed Rate Decision
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Interest rates held steady, supporting market stability.
                    </p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="w-full mt-4">
                  <Link href="/resources?type=newsletter">
                    View All Updates
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get instant calculations without leaving your dashboard.
                </p>
                <Button asChild className="w-full">
                  <Link href="/calculators">
                    Open Calculator Suite
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
