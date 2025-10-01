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
import { Shield, Save, Plus, Trash2, Edit, Lock } from "lucide-react";
import type { PageContent } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentSection {
  id: string;
  page: string;
  section: string;
  content: any;
  published: boolean;
}

export default function ContentManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState("home");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

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

  // Fetch page content
  const { data: pageContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ['/api/content', selectedPage],
    enabled: hasAccess === true,
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
            <h1 className="text-3xl font-bold text-gray-900">Content Management System</h1>
          </div>
          <p className="text-muted-foreground">
            Manage all website content from this central dashboard. Changes are reflected immediately on the front end.
          </p>
        </div>

        {/* Page Selection Tabs */}
        <Tabs value={selectedPage} onValueChange={setSelectedPage} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home" data-testid="tab-home">Home</TabsTrigger>
            <TabsTrigger value="footer" data-testid="tab-footer">Footer</TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
          </TabsList>

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
                          {editingSection === section.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSave(section.id)}
                                disabled={updateContentMutation.isPending}
                                data-testid="button-save"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                data-testid="button-cancel"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
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
                        <div className="space-y-4">
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
                      ) : (
                        <div className="prose max-w-none">
                          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
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
      </div>
    </div>
  );
}
