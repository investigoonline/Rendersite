import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserCheck, Calculator, FileText, Shield, Settings, Save, Send } from "lucide-react";
import type { PageContent, LoginHistory, User, SiteSetting } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RolesManagementDesign1 from "@/components/roles/RolesManagementDesign1";
import SystemRestore from "@/components/SystemRestore";

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

  const { data: systemSettings, isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings', 'system'],
    queryFn: () => fetch('/api/site-settings?type=system').then(r => r.json()),
  });

  const [settingDrafts, setSettingDrafts] = useState<Record<string, string>>({});

  const saveSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest(`/api/admin/site-settings/${key}`, 'PUT', { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings', 'system'] });
      toast({ title: "Saved", description: "Setting updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to save setting.", variant: "destructive" });
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/admin/test-email', 'POST', {});
    },
    onSuccess: (data: any) => {
      toast({ title: "Email Sent", description: data?.message || "Test email sent successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Email Failed", description: error.message || "Failed to send test email.", variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest(`/api/admin/users/${userId}/role`, 'PUT', { role });
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900" data-testid="text-dashboard-title">
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

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-[800px]">
            <TabsTrigger value="users" data-testid="tab-user-management">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="roles" data-testid="tab-roles-management">
              <Settings className="h-4 w-4 mr-2" />
              Roles Management
            </TabsTrigger>
            <TabsTrigger value="restore" data-testid="tab-system-restore">
              <Shield className="h-4 w-4 mr-2" />
              System Restore
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-system-settings">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  User Management
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
          </TabsContent>

          {/* Roles Management Tab */}
          <TabsContent value="roles" className="mt-6">
            <RolesManagementDesign1 />
          </TabsContent>

          {/* System Restore Tab */}
          <TabsContent value="restore" className="mt-6">
            <SystemRestore />
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-primary" />
                      System Settings
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Configure global platform parameters. Changes take effect immediately.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testEmailMutation.mutate()}
                    disabled={testEmailMutation.isPending}
                    data-testid="btn-test-email"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {testEmailMutation.isPending ? "Sending…" : "Send Test Email"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-8 max-w-lg">
                    {/* Contact Email - shown first */}
                    {(() => {
                      const SETTING_ORDER = ['contact_email', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from'];
                      const SMTP_KEYS = new Set(['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_from']);
                      const sorted = [...(systemSettings || [])].sort((a, b) => {
                        const ai = SETTING_ORDER.indexOf(a.settingKey);
                        const bi = SETTING_ORDER.indexOf(b.settingKey);
                        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                      });
                      const contactSetting = sorted.find(s => s.settingKey === 'contact_email');
                      const smtpSettings = sorted.filter(s => SMTP_KEYS.has(s.settingKey));
                      const otherSettings = sorted.filter(s => s.settingKey !== 'contact_email' && !SMTP_KEYS.has(s.settingKey));

                      const renderField = (setting: SiteSetting) => {
                        const isPassword = setting.settingKey === 'smtp_pass';
                        const draftValue = settingDrafts[setting.settingKey] ?? setting.settingValue;
                        return (
                          <div key={setting.settingKey} className="space-y-1">
                            <Label htmlFor={setting.settingKey} className="text-sm font-medium">
                              {setting.label || setting.settingKey}
                            </Label>
                            {setting.description && (
                              <p className="text-xs text-muted-foreground">{setting.description}</p>
                            )}
                            <div className="flex gap-2">
                              <Input
                                id={setting.settingKey}
                                type={isPassword ? "password" : "text"}
                                value={draftValue}
                                onChange={(e) =>
                                  setSettingDrafts((prev) => ({ ...prev, [setting.settingKey]: e.target.value }))
                                }
                                placeholder={`Enter ${setting.label || setting.settingKey}`}
                                className="flex-1"
                                data-testid={`input-setting-${setting.settingKey}`}
                              />
                              <Button
                                size="sm"
                                onClick={() =>
                                  saveSettingMutation.mutate({ key: setting.settingKey, value: draftValue })
                                }
                                disabled={saveSettingMutation.isPending}
                                data-testid={`btn-save-setting-${setting.settingKey}`}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        );
                      };

                      return (
                        <>
                          {contactSetting && (
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">Contact</h3>
                              {renderField(contactSetting)}
                            </div>
                          )}
                          {smtpSettings.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">Email / SMTP</h3>
                              {smtpSettings.map(renderField)}
                            </div>
                          )}
                          {otherSettings.map(renderField)}
                        </>
                      );
                    })()}
                    {(!systemSettings || systemSettings.length === 0) && (
                      <p className="text-muted-foreground text-sm text-center py-4">No system settings found.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
