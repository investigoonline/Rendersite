import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Save, Plus, Trash2, Edit, Lock, Users } from "lucide-react";
import type { PageContent, User, Role } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormRenderer } from "@/components/FormRenderer";
import { getSectionSchema, pageSections } from "@shared/contentSchemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ContentSection {
  id: string;
  page: string;
  section: string;
  content: any;
  published: boolean;
}

interface UserWithRoles extends User {
  roles: Role[];
}

export default function ContentManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [mainTab, setMainTab] = useState("content");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSectionType, setSelectedSectionType] = useState<string>("");

  // Check if user has content manager or super admin role
  const { data: hasAccess, isLoading: checkingAccess } = useQuery({
    queryKey: ['/api/users', user?.id, 'has-role', 'content_manager'],
    enabled: !!user?.id,
    queryFn: async () => {
      const [contentManagerCheck, superAdminCheck] = await Promise.all([
        fetch(`/api/users/${user?.id}/has-role/content_manager`).then(r => r.json()),
        fetch(`/api/users/${user?.id}/has-role/super_admin`).then(r => r.json())
      ]);
      return contentManagerCheck.hasRole || superAdminCheck.hasRole;
    }
  });

  // Check if user is specifically a super admin
  const { data: isSuperAdmin } = useQuery({
    queryKey: ['/api/users', user?.id, 'has-role', 'super_admin'],
    enabled: !!user?.id && hasAccess === true,
    queryFn: async () => {
      const res = await fetch(`/api/users/${user?.id}/has-role/super_admin`);
      const data = await res.json();
      return data.hasRole;
    }
  });

  // Fetch page content
  const { data: pageContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ['/api/content', selectedPage],
    enabled: hasAccess === true && mainTab === "content",
    queryFn: async () => {
      const res = await fetch(`/api/content?page=${selectedPage}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch content');
      }
      return res.json();
    },
  });

  // Fetch all users with roles (for super admins only)
  const { data: allUsers, isLoading: loadingUsers } = useQuery<UserWithRoles[]>({
    queryKey: ['/api/admin/users'],
    enabled: isSuperAdmin === true && mainTab === "users",
    queryFn: async () => {
      const res = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      return res.json();
    },
  });

  // Fetch all available roles
  const { data: availableRoles } = useQuery<Role[]>({
    queryKey: ['/api/roles'],
    enabled: isSuperAdmin === true && mainTab === "users",
    queryFn: async () => {
      const res = await fetch('/api/roles');
      if (!res.ok) {
        throw new Error('Failed to fetch roles');
      }
      return res.json();
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PATCH", `/api/content/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content', selectedPage] });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/content", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content', selectedPage] });
      setFormData({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content",
        variant: "destructive",
      });
    },
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/content/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content', selectedPage] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      return apiRequest("POST", `/api/users/${userId}/roles`, { roleId });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      return apiRequest("DELETE", `/api/users/${userId}/roles/${roleId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove role",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (section: PageContent) => {
    setEditingSection(section.id);
    setFormData(section.content);
  };

  const handleSave = async (sectionId: string) => {
    await updateContentMutation.mutateAsync({
      id: sectionId,
      data: {
        content: formData,
        updatedBy: user?.id,
      },
    });
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
  };

  const handleCreateSection = async (data: any) => {
    await createContentMutation.mutateAsync({
      page: selectedPage,
      section: selectedSectionType,
      content: data,
      published: true,
      createdBy: user?.id,
      updatedBy: user?.id,
    });
    setShowCreateDialog(false);
    setSelectedSectionType("");
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-6 w-6 text-destructive" />
                <CardTitle className="text-destructive">Access Denied</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You do not have permission to access the Content Management System. 
                This area is restricted to Content Managers and Super Administrators only.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? "Manage website content and user roles from this central dashboard." 
              : "Manage all website content from this central dashboard. Changes are reflected immediately on the front end."}
          </p>
        </div>

        {/* Main Tabs - Content and User Roles */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="content" data-testid="tab-content">
              <Shield className="h-4 w-4 mr-2" />
              Content Management
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="h-4 w-4 mr-2" />
                User Roles
              </TabsTrigger>
            )}
          </TabsList>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Page Selection Tabs */}
            <Tabs value={selectedPage} onValueChange={setSelectedPage} className="space-y-6">
              <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
                <TabsTrigger value="home" data-testid="tab-home">Home</TabsTrigger>
                <TabsTrigger value="footer" data-testid="tab-footer">Footer</TabsTrigger>
                <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
                <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
                <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
                <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
                <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
              </TabsList>

              {/* Add Section Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Content Sections</h2>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-section">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Content Section</DialogTitle>
                      <DialogDescription>
                        Select a section type for the {selectedPage} page and fill in the content.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {!selectedSectionType ? (
                      <div className="space-y-2">
                        <Label>Select Section Type</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {pageSections[selectedPage]?.map((sectionType) => {
                            const schema = getSectionSchema(sectionType);
                            // Check if section already exists
                            const exists = pageContent?.some(s => s.section === sectionType);
                            
                            return (
                              <Button
                                key={sectionType}
                                variant="outline"
                                className="justify-start h-auto py-3 px-4"
                                onClick={() => setSelectedSectionType(sectionType)}
                                disabled={exists && !schema?.allowMultiple}
                                data-testid={`button-section-type-${sectionType}`}
                              >
                                <div className="text-left">
                                  <div className="font-semibold">{schema?.label || sectionType}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {schema?.description || 'No description'}
                                  </div>
                                  {exists && !schema?.allowMultiple && (
                                    <div className="text-xs text-yellow-600 mt-1">Already exists</div>
                                  )}
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSectionType("")}
                          className="mb-4"
                          data-testid="button-back"
                        >
                          ← Back to section types
                        </Button>
                        {(() => {
                          const schema = getSectionSchema(selectedSectionType);
                          if (!schema) return <div>Schema not found</div>;
                          
                          return (
                            <FormRenderer
                              schema={schema}
                              defaultValues={{}}
                              onSubmit={handleCreateSection}
                              onCancel={() => {
                                setShowCreateDialog(false);
                                setSelectedSectionType("");
                              }}
                              isSubmitting={createContentMutation.isPending}
                            />
                          );
                        })()}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Content Sections */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading content...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageContent && pageContent.length > 0 ? (
                    pageContent.map((section) => (
                      <Card key={section.id} data-testid={`content-section-${section.section}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="capitalize">
                            {section.section.replace(/_/g, ' ')}
                          </CardTitle>
                          <CardDescription>
                            Last updated: {new Date(section.updatedAt || '').toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {editingSection !== section.id && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(section)}
                                data-testid="button-edit"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this content section?')) {
                                    deleteContentMutation.mutate(section.id);
                                  }
                                }}
                                data-testid="button-delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingSection === section.id ? (
                        (() => {
                          const sectionSchema = getSectionSchema(section.section);
                          if (!sectionSchema) {
                            return (
                              <div className="space-y-4">
                                <Alert>
                                  <AlertDescription>
                                    No schema found for this section. Using simple editor.
                                  </AlertDescription>
                                </Alert>
                                {Object.keys(formData).map((key) => (
                                  <div key={key}>
                                    <Label htmlFor={key} className="capitalize">
                                      {key.replace(/_/g, ' ')}
                                    </Label>
                                    {typeof formData[key] === 'string' && formData[key].length > 100 ? (
                                      <Textarea
                                        id={key}
                                        value={formData[key]}
                                        onChange={(e) =>
                                          setFormData({ ...formData, [key]: e.target.value })
                                        }
                                        rows={4}
                                        data-testid={`input-${key}`}
                                      />
                                    ) : (
                                      <Input
                                        id={key}
                                        value={formData[key]?.toString() || ''}
                                        onChange={(e) =>
                                          setFormData({ ...formData, [key]: e.target.value })
                                        }
                                        data-testid={`input-${key}`}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return (
                            <FormRenderer
                              schema={sectionSchema}
                              defaultValues={formData}
                              onSubmit={(data) => {
                                updateContentMutation.mutate({
                                  id: section.id,
                                  data: {
                                    content: data,
                                    updatedBy: user?.id,
                                  },
                                });
                              }}
                              onCancel={handleCancel}
                              isSubmitting={updateContentMutation.isPending}
                            />
                          );
                        })()
                      ) : (
                        <div className="prose max-w-none">
                          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">
                            {JSON.stringify(section.content, null, 2)}
                          </pre>
                        </div>
                      )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Alert>
                      <AlertDescription>
                        No content sections found for this page. Create your first content section using the form below.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </Tabs>
          </TabsContent>

          {/* User Roles Management Tab */}
          <TabsContent value="users" className="space-y-6">
            {loadingUsers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>User Role Management</CardTitle>
                  <CardDescription>
                    Assign and manage roles for all users in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Auth Type</TableHead>
                        <TableHead>Current Roles</TableHead>
                        <TableHead>Assign Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.map((userItem) => (
                        <TableRow key={userItem.id} data-testid={`user-row-${userItem.id}`}>
                          <TableCell className="font-medium">{userItem.email}</TableCell>
                          <TableCell>
                            {userItem.firstName} {userItem.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{userItem.authType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {userItem.roles && userItem.roles.length > 0 ? (
                                userItem.roles.map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant="default"
                                    className="flex items-center gap-1"
                                    data-testid={`role-badge-${role.name}`}
                                  >
                                    {role.displayName}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() => {
                                        if (confirm(`Remove ${role.displayName} role from ${userItem.email}?`)) {
                                          removeRoleMutation.mutate({
                                            userId: userItem.id,
                                            roleId: role.id,
                                          });
                                        }
                                      }}
                                      data-testid={`button-remove-role-${role.name}`}
                                    >
                                      ×
                                    </Button>
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">No roles assigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              onValueChange={(roleId) => {
                                assignRoleMutation.mutate({ userId: userItem.id, roleId });
                              }}
                              data-testid={`select-assign-role-${userItem.id}`}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Assign role..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles?.map((role) => (
                                  <SelectItem
                                    key={role.id}
                                    value={role.id}
                                    disabled={userItem.roles?.some((r) => r.id === role.id)}
                                    data-testid={`option-role-${role.name}`}
                                  >
                                    {role.displayName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
