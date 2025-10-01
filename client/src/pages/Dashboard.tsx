import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Calculator, FileText } from "lucide-react";
import type { PageContent, LoginHistory } from "@shared/schema";

interface DashboardStats {
  guestUserCount: number;
  activeClients: number;
  totalCalculations: number;
  totalResources: number;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard-stats'],
  });

  const { data: dashboardContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'dashboard'],
  });

  const { data: loginHistory } = useQuery<LoginHistory[]>({
    queryKey: ['/api/admin/login-history'],
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return dashboardContent?.find(c => c.section === sectionName);
  };

  // Extract content sections
  const headerContent = getSection('dashboard_header')?.content as any;
  const statsContent = getSection('dashboard_stats')?.content as any;
  const userDistContent = getSection('dashboard_user_distribution')?.content as any;
  const engagementContent = getSection('dashboard_engagement')?.content as any;
  const systemStatusContent = getSection('dashboard_system_status')?.content as any;

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Users,
      UserCheck,
      Calculator,
      FileText,
    };
    return icons[iconName] || Users;
  };

  const statCards = statsContent?.stats || [];

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Map stat labels to actual data
  const getStatValue = (label: string): number => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('guest')) return stats?.guestUserCount || 0;
    if (labelLower.includes('client') || labelLower.includes('active')) return stats?.activeClients || 0;
    if (labelLower.includes('calculation')) return stats?.totalCalculations || 0;
    if (labelLower.includes('resource')) return stats?.totalResources || 0;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-dashboard-title">
            {headerContent?.title || 'System Admin Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {headerContent?.description || 'Overview of platform metrics and user activity'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat: any, index: number) => {
            const IconComponent = getIcon(stat.icon);
            const value = getStatValue(stat.label);
            const testId = stat.label.toLowerCase().replace(/\s+/g, '-');

            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900" data-testid={`text-${testId}`}>
                        {value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 bg-opacity-10 rounded-lg flex items-center justify-center ${stat.color.replace('text-', 'bg-')}`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Login History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Login History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loginHistory && loginHistory.length > 0 ? (
              <div className="space-y-3">
                {loginHistory.slice(0, 10).map((login, index) => (
                  <div 
                    key={login.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`login-history-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" data-testid={`login-email-${index}`}>
                          {login.email}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`login-date-${index}`}>
                          {new Date(login.loginAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Login
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No login history to display
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {userDistContent?.title || 'User Distribution'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {userDistContent?.guestLabel || 'Guest Users'}
                  </span>
                  <span className="font-medium">{stats?.guestUserCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {userDistContent?.clientsLabel || 'Active Clients'}
                  </span>
                  <span className="font-medium">{stats?.activeClients || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">
                    {userDistContent?.totalLabel || 'Total Users'}
                  </span>
                  <span className="font-bold">{(stats?.guestUserCount || 0) + (stats?.activeClients || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {engagementContent?.title || 'Platform Engagement'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {engagementContent?.calculationsLabel || 'Calculations'}
                  </span>
                  <span className="font-medium">{stats?.totalCalculations || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {engagementContent?.resourcesLabel || 'Resources'}
                  </span>
                  <span className="font-medium">{stats?.totalResources || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">
                    {engagementContent?.avgLabel || 'Avg per User'}
                  </span>
                  <span className="font-bold">
                    {stats && (stats.guestUserCount + stats.activeClients) > 0
                      ? Math.round(stats.totalCalculations / (stats.guestUserCount + stats.activeClients))
                      : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {systemStatusContent?.title || 'System Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {systemStatusContent?.databaseLabel || 'Database'}
                  </span>
                  <Badge variant="default">{systemStatusContent?.onlineBadge || 'Online'}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {systemStatusContent?.apiLabel || 'API'}
                  </span>
                  <Badge variant="default">{systemStatusContent?.operationalBadge || 'Operational'}</Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">
                    {systemStatusContent?.statusLabel || 'Platform Status'}
                  </span>
                  <Badge variant="default">{systemStatusContent?.healthyBadge || 'Healthy'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
