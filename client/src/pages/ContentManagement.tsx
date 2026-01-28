import { useState, useEffect, useRef } from "react";
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
import { Shield, Save, Plus, Trash2, Edit, Lock, Users, Image, Upload, RefreshCw, Type, Calculator } from "lucide-react";
import type { PageContent, User, Role, ImageAsset, SiteSetting } from "@shared/schema";
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

  // Check roles directly from user object (consistent with Header and ProtectedRoute)
  const hasAccess = user?.role === 'super_admin' || user?.role === 'content_manager';
  const isSuperAdmin = user?.role === 'super_admin';
  const checkingAccess = false;
  
  // Calculator editing state
  const [editingCalculator, setEditingCalculator] = useState<string | null>(null);
  const [calculatorFormData, setCalculatorFormData] = useState<Record<string, any>>({});
  
  // Image upload state
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hero image pages configuration
  const heroImagePages = [
    { page: 'global', section: 'logo', label: 'Site Logo', description: 'Company logo displayed in header and footer (recommended: PNG with transparent background)' },
    { page: 'home', section: 'hero', label: 'Home Page Hero', description: 'Main landing page hero image' },
    { page: 'about', section: 'hero', label: 'About Page Hero', description: 'About us page header image' },
    { page: 'services', section: 'hero', label: 'Services Page Hero', description: 'Services page header image' },
    { page: 'contact', section: 'hero', label: 'Contact Page Hero', description: 'Contact page header image' },
    { page: 'calculators', section: 'hero', label: 'Calculators Page Hero', description: 'Calculators page header image' },
    { page: 'faq', section: 'hero', label: 'FAQ Page Hero', description: 'FAQ page header image' },
    { page: 'resources', section: 'hero', label: 'Resources Page Hero', description: 'Resources page rotating carousel images' },
    { page: 'articles', section: 'carousel_1', label: 'Articles Carousel Image 1', description: 'First rotating image on the Articles page' },
    { page: 'articles', section: 'carousel_2', label: 'Articles Carousel Image 2', description: 'Second rotating image on the Articles page' },
    { page: 'articles', section: 'carousel_3', label: 'Articles Carousel Image 3', description: 'Third rotating image on the Articles page' },
    { page: 'articles', section: 'carousel_4', label: 'Articles Carousel Image 4', description: 'Fourth rotating image on the Articles page' },
  ];

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

  // Fetch all image assets
  const { data: imageAssets, isLoading: loadingImages, refetch: refetchImages } = useQuery<ImageAsset[]>({
    queryKey: ['/api/images'],
    enabled: hasAccess === true && mainTab === "images",
    queryFn: async () => {
      const res = await fetch('/api/images', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch images');
      }
      return res.json();
    },
  });

  // Fetch font settings
  const { data: fontSettings, isLoading: loadingFonts } = useQuery<SiteSetting[]>({
    queryKey: ['/api/site-settings', 'font'],
    enabled: hasAccess === true && mainTab === "fonts",
    queryFn: async () => {
      const res = await fetch('/api/site-settings?type=font', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch font settings');
      }
      return res.json();
    },
  });

  // Font settings state
  const [fontFormData, setFontFormData] = useState<Record<string, string>>({});

  // Fetch calculator content
  const { data: calculatorContent, isLoading: loadingCalculators, refetch: refetchCalculators } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'calculators'],
    enabled: hasAccess === true && mainTab === "calculators",
    queryFn: async () => {
      const res = await fetch('/api/content?page=calculators', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch calculator content');
      }
      return res.json();
    },
  });

  // Calculator definitions for display
  const calculatorDefinitions = [
    { id: 'calculator_net_worth', name: 'Net Worth Calculator', description: 'Calculate total assets minus liabilities' },
    { id: 'calculator_loan_payoff', name: 'Loan Payoff Calculator', description: 'Calculate loan payoff timelines and savings' },
    { id: 'calculator_mortgage', name: 'Mortgage Calculator', description: 'Mortgage payments and affordability' },
    { id: 'calculator_retirement', name: 'Retirement Calculator', description: 'Retirement planning and projections' },
    { id: 'calculator_tax', name: 'Tax Calculator', description: 'Tax planning and calculations' },
  ];

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest(`/api/content/${id}`, "PATCH", data);
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
      return apiRequest("/api/content", "POST", data);
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
      return apiRequest(`/api/content/${id}`, "DELETE", {});
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

  // Update font settings mutation
  const updateFontSettingsMutation = useMutation({
    mutationFn: async (settings: Array<{ key: string; value: string }>) => {
      return apiRequest('/api/admin/site-settings', 'PUT', { settings });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Font settings updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings', 'font'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update font settings",
        variant: "destructive",
      });
    },
  });

  // Initialize font form data when settings load
  useEffect(() => {
    if (fontSettings && fontSettings.length > 0) {
      const formData: Record<string, string> = {};
      fontSettings.forEach((setting) => {
        formData[setting.settingKey] = setting.settingValue;
      });
      setFontFormData(formData);
    }
  }, [fontSettings]);

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      return apiRequest(`/api/users/${userId}/roles`, "POST", { roleId });
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
      return apiRequest(`/api/users/${userId}/roles/${roleId}`, "DELETE", {});
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

  // Handle image upload
  const handleImageUpload = async (page: string, section: string, file: File) => {
    const uploadKey = `${page}_${section}`;
    setUploadingImage(uploadKey);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('page', page);
      formData.append('section', section);

      const res = await fetch('/api/images/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await res.json();
      toast({
        title: "Success",
        description: "Image uploaded successfully. It will be displayed on the page.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(null);
    }
  };

  // Get image for a specific page/section
  const getImageForSection = (page: string, section: string): ImageAsset | undefined => {
    return imageAssets?.find(img => img.page === page && img.section === section);
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

        {/* Main Tabs - Content, Images, and User Roles */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="content" data-testid="tab-content">
              <Shield className="h-4 w-4 mr-2" />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="images" data-testid="tab-images">
              <Image className="h-4 w-4 mr-2" />
              Hero Images
            </TabsTrigger>
            <TabsTrigger value="fonts" data-testid="tab-fonts">
              <Type className="h-4 w-4 mr-2" />
              Font Settings
            </TabsTrigger>
            <TabsTrigger value="calculators" data-testid="tab-calculators">
              <Calculator className="h-4 w-4 mr-2" />
              Calculators
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
              <TabsList className="flex flex-wrap gap-1 lg:w-auto lg:inline-flex">
                <TabsTrigger value="home" data-testid="tab-home">Home</TabsTrigger>
                <TabsTrigger value="footer" data-testid="tab-footer">Footer</TabsTrigger>
                <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
                <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
                <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
                <TabsTrigger value="blog" data-testid="tab-blog">Blog</TabsTrigger>
                <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
                <TabsTrigger value="process" data-testid="tab-process">Process</TabsTrigger>
                <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="privacy_policy" data-testid="tab-privacy">Privacy Policy</TabsTrigger>
                <TabsTrigger value="terms_of_service" data-testid="tab-terms">Terms of Service</TabsTrigger>
                <TabsTrigger value="disclosures" data-testid="tab-disclosures">Disclosures</TabsTrigger>
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
                            {(() => {
                              // Try to get title from content data first
                              const contentData = section.content as any;
                              if (contentData?.title) {
                                return contentData.title;
                              }
                              // Fall back to section type name
                              return section.section.replace(/_/g, ' ');
                            })()}
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

          {/* Hero Images Management Tab */}
          <TabsContent value="images" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Hero Image Management</h2>
                <p className="text-sm text-muted-foreground">
                  Upload and replace hero images for each page. Images are automatically optimized and resized.
                </p>
              </div>
              <Button variant="outline" onClick={() => refetchImages()} disabled={loadingImages}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingImages ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loadingImages ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading images...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroImagePages.map((heroConfig) => {
                  const existingImage = getImageForSection(heroConfig.page, heroConfig.section);
                  const uploadKey = `${heroConfig.page}_${heroConfig.section}`;
                  const isUploading = uploadingImage === uploadKey;
                  
                  return (
                    <Card key={uploadKey} data-testid={`image-card-${heroConfig.page}`}>
                      <CardHeader>
                        <CardTitle className="text-base">{heroConfig.label}</CardTitle>
                        <CardDescription>{heroConfig.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Current Image Preview */}
                        {existingImage ? (
                          <div className="space-y-2">
                            <div className="relative rounded-lg overflow-hidden border">
                              <img
                                src={existingImage.filePath}
                                alt={heroConfig.label}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>Size: {existingImage.width}x{existingImage.height}px</p>
                              <p>Uploaded: {new Date(existingImage.createdAt || '').toLocaleDateString()}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No custom image uploaded</p>
                              <p className="text-xs text-muted-foreground">Using default image</p>
                            </div>
                          </div>
                        )}

                        {/* Upload Button */}
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            id={`file-input-${uploadKey}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(heroConfig.page, heroConfig.section, file);
                                e.target.value = '';
                              }
                            }}
                            disabled={isUploading}
                          />
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => document.getElementById(`file-input-${uploadKey}`)?.click()}
                            disabled={isUploading}
                            data-testid={`button-upload-${heroConfig.page}`}
                          >
                            {isUploading ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                {existingImage ? 'Replace Image' : 'Upload Image'}
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Supported: JPEG, PNG, WebP, GIF (max 10MB). Images are auto-optimized to 1920px width.
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Font Settings Tab */}
          <TabsContent value="fonts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Font Size Settings
                </CardTitle>
                <CardDescription>
                  Adjust the font sizes used across the website. Changes take effect immediately for all users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingFonts ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading font settings...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="font_size_h1">Heading 1 Size (px)</Label>
                        <Input
                          id="font_size_h1"
                          type="number"
                          step="0.5"
                          min="12"
                          max="48"
                          value={fontFormData.font_size_h1 || '22.5'}
                          onChange={(e) => setFontFormData({ ...fontFormData, font_size_h1: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Main page headings. Default: 22.5px
                        </p>
                        <div className="mt-2 p-3 bg-gray-50 rounded border">
                          <span style={{ fontSize: `${fontFormData.font_size_h1 || 22.5}px`, fontFamily: 'Sanchez, Georgia, serif', fontWeight: 700 }}>
                            Sample Heading 1
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="font_size_h2">Heading 2 Size (px)</Label>
                        <Input
                          id="font_size_h2"
                          type="number"
                          step="0.5"
                          min="10"
                          max="36"
                          value={fontFormData.font_size_h2 || '16.5'}
                          onChange={(e) => setFontFormData({ ...fontFormData, font_size_h2: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Subheadings and section titles. Default: 16.5px
                        </p>
                        <div className="mt-2 p-3 bg-gray-50 rounded border">
                          <span style={{ fontSize: `${fontFormData.font_size_h2 || 16.5}px`, fontFamily: 'Sanchez, Georgia, serif', fontWeight: 700 }}>
                            Sample Heading 2
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="font_size_content">Content Size (px)</Label>
                        <Input
                          id="font_size_content"
                          type="number"
                          step="0.5"
                          min="10"
                          max="24"
                          value={fontFormData.font_size_content || '13.5'}
                          onChange={(e) => setFontFormData({ ...fontFormData, font_size_content: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Body text and paragraphs. Default: 13.5px
                        </p>
                        <div className="mt-2 p-3 bg-gray-50 rounded border">
                          <span style={{ fontSize: `${fontFormData.font_size_content || 13.5}px`, fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            Sample body content text for preview
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFontFormData({
                            font_size_h1: '22.5',
                            font_size_h2: '16.5',
                            font_size_content: '13.5'
                          });
                        }}
                      >
                        Reset to Defaults
                      </Button>
                      <Button
                        onClick={() => {
                          const settings = Object.entries(fontFormData).map(([key, value]) => ({
                            key,
                            value: value.toString()
                          }));
                          updateFontSettingsMutation.mutate(settings);
                        }}
                        disabled={updateFontSettingsMutation.isPending}
                      >
                        {updateFontSettingsMutation.isPending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Font Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculators Management Tab */}
          <TabsContent value="calculators" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Calculator Content Management</h2>
                <p className="text-sm text-muted-foreground">
                  Edit titles and descriptions for all financial calculators. Changes are visible site-wide.
                </p>
              </div>
              <Button variant="outline" onClick={() => refetchCalculators()} disabled={loadingCalculators}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingCalculators ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loadingCalculators ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading calculators...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {calculatorDefinitions.map((calc) => {
                  const existingContent = calculatorContent?.find(c => c.section === calc.id);
                  const isEditing = editingCalculator === calc.id;
                  const schemaInfo = getSectionSchema(calc.id);
                  
                  return (
                    <Card key={calc.id} data-testid={`calculator-card-${calc.id}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Calculator className="h-5 w-5 text-primary" />
                              {calc.name}
                            </CardTitle>
                            <CardDescription>{calc.description}</CardDescription>
                          </div>
                          <Badge variant={existingContent ? "default" : "secondary"}>
                            {existingContent ? "Customized" : "Using Defaults"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${calc.id}-pageTitle`}>Page Title</Label>
                              <Input
                                id={`${calc.id}-pageTitle`}
                                value={calculatorFormData.pageTitle || ''}
                                onChange={(e) => setCalculatorFormData({ ...calculatorFormData, pageTitle: e.target.value })}
                                placeholder="Enter page title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${calc.id}-pageDescription`}>Page Description</Label>
                              <Textarea
                                id={`${calc.id}-pageDescription`}
                                value={calculatorFormData.pageDescription || ''}
                                onChange={(e) => setCalculatorFormData({ ...calculatorFormData, pageDescription: e.target.value })}
                                placeholder="Enter page description"
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${calc.id}-cardTitle`}>Card Title</Label>
                              <Input
                                id={`${calc.id}-cardTitle`}
                                value={calculatorFormData.cardTitle || ''}
                                onChange={(e) => setCalculatorFormData({ ...calculatorFormData, cardTitle: e.target.value })}
                                placeholder="Enter card title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${calc.id}-cardDescription`}>Card Description</Label>
                              <Textarea
                                id={`${calc.id}-cardDescription`}
                                value={calculatorFormData.cardDescription || ''}
                                onChange={(e) => setCalculatorFormData({ ...calculatorFormData, cardDescription: e.target.value })}
                                placeholder="Enter card description"
                                rows={2}
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                onClick={() => {
                                  if (existingContent) {
                                    updateContentMutation.mutate({
                                      id: existingContent.id,
                                      data: { content: calculatorFormData }
                                    }, {
                                      onSuccess: () => {
                                        queryClient.invalidateQueries({ queryKey: ['/api/content', 'calculators'] });
                                        setEditingCalculator(null);
                                        setCalculatorFormData({});
                                      }
                                    });
                                  } else {
                                    createContentMutation.mutate({
                                      page: 'calculators',
                                      section: calc.id,
                                      content: calculatorFormData
                                    }, {
                                      onSuccess: () => {
                                        queryClient.invalidateQueries({ queryKey: ['/api/content', 'calculators'] });
                                        setEditingCalculator(null);
                                        setCalculatorFormData({});
                                      }
                                    });
                                  }
                                }}
                                disabled={updateContentMutation.isPending || createContentMutation.isPending}
                              >
                                {(updateContentMutation.isPending || createContentMutation.isPending) ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingCalculator(null);
                                  setCalculatorFormData({});
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {existingContent ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Page Title</p>
                                  <p className="text-sm">{(existingContent.content as any)?.pageTitle || 'Not set'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Page Description</p>
                                  <p className="text-sm whitespace-pre-wrap">{(existingContent.content as any)?.pageDescription || 'Not set'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Card Title</p>
                                  <p className="text-sm">{(existingContent.content as any)?.cardTitle || 'Not set'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Card Description</p>
                                  <p className="text-sm whitespace-pre-wrap">{(existingContent.content as any)?.cardDescription || 'Not set'}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No custom content set. Click Edit to customize this calculator's titles and descriptions.
                              </p>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingCalculator(calc.id);
                                if (existingContent) {
                                  setCalculatorFormData(existingContent.content as any || {});
                                } else {
                                  setCalculatorFormData({
                                    pageTitle: calc.name,
                                    pageDescription: calc.description,
                                    cardTitle: calc.name,
                                    cardDescription: calc.description
                                  });
                                }
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Content
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
