import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Calculator, FileText, Shield } from "lucide-react";
import type { PageContent, LoginHistory, User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  activeClients: number;
  totalCalculations: number;
  totalResources: number;
}

interface UserWithRoles extends User {
  roles: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard-stats'],
  });

  const { data: dashboardContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content?page=dashboard'],
  });

  const { data: loginHistory } = useQuery<LoginHistory[]>({
    queryKey: ['/api/admin/login-history'],
  });

  const { data: allUsers, isLoading: usersLoading } = useQuery<UserWithRoles[]>({
    queryKey: ['/api/admin/users'],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest('PUT', `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: async () => {
      // Invalidate and refetch to ensure UI updates immediately
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      await queryClient.refetchQueries({ queryKey: ['/api/admin/users'] });
      
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
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

        {/* Role Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Role Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : allUsers && allUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700" data-testid="header-name">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700" data-testid="header-email">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700" data-testid="header-auth-type">Auth Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700" data-testid="header-role">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u, index) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50" data-testid={`user-row-${index}`}>
                        <td className="py-3 px-4" data-testid={`user-name-${index}`}>
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="py-3 px-4" data-testid={`user-email-${index}`}>
                          {u.email}
                        </td>
                        <td className="py-3 px-4" data-testid={`user-authtype-${index}`}>
                          <Badge variant="outline">{u.authType}</Badge>
                        </td>
                        <td className="py-3 px-4" data-testid={`user-role-${index}`}>
                          <Select
                            value={u.role || 'client'}
                            onValueChange={(role) => {
                              updateRoleMutation.mutate({ userId: u.id, role });
                            }}
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-[200px]" data-testid={`select-role-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="super_admin" data-testid={`role-option-super-admin-${index}`}>
                                Super Admin
                              </SelectItem>
                              <SelectItem value="content_manager" data-testid={`role-option-content-manager-${index}`}>
                                Content Manager
                              </SelectItem>
                              <SelectItem value="guest_user" data-testid={`role-option-guest-user-${index}`}>
                                Guest User
                              </SelectItem>
                              <SelectItem value="preferred_client" data-testid={`role-option-preferred-client-${index}`}>
                                Preferred Client
                              </SelectItem>
                              <SelectItem value="client" data-testid={`role-option-client-${index}`}>
                                Client
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No users to display
              </p>
            )}
          </CardContent>
        </Card>

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
                    {userDistContent?.clientsLabel || 'Active Clients'}
                  </span>
                  <span className="font-medium">{stats?.activeClients || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Calculations
                  </span>
                  <span className="font-medium">{stats?.totalCalculations || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">
                    Total Resources
                  </span>
                  <span className="font-bold">{stats?.totalResources || 0}</span>
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
                    {stats && stats.activeClients > 0
                      ? Math.round(stats.totalCalculations / stats.activeClients)
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
