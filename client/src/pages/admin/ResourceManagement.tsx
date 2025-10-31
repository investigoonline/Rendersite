import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertResourceSchema, type Resource } from "@shared/schema";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/RichTextEditor";
import { HTMLContent } from "@/components/HTMLContent";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Video,
  Mail,
  Book,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
} from "lucide-react";

const resourceFormSchema = insertResourceSchema.extend({
  tags: z.array(z.string()).optional(),
});

type ResourceFormData = z.infer<typeof resourceFormSchema>;

const resourceTypes = [
  { id: "article", name: "Articles", icon: FileText },
  { id: "video", name: "Videos", icon: Video },
  { id: "newsletter", name: "Newsletters", icon: Mail },
  { id: "flipbook", name: "Flipbooks", icon: Book },
  { id: "faq", name: "FAQs", icon: HelpCircle },
];

export default function ResourceManagement() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("article");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  // Fetch resources by type
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources', selectedType],
    queryFn: async () => {
      const res = await fetch(`/api/resources?type=${selectedType}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch resources');
      return res.json();
    },
  });

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      type: selectedType as any,
      title: "",
      description: "",
      content: "",
      category: "",
      tags: [],
      published: true,
      featured: false,
    },
  });

  // Create resource mutation
  const createMutation = useMutation({
    mutationFn: async (data: ResourceFormData) => {
      return apiRequest('/api/resources', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      toast({
        title: "Success",
        description: "Resource created successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
      setTagsInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create resource",
        variant: "destructive",
      });
    },
  });

  // Update resource mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ResourceFormData> }) => {
      return apiRequest(`/api/resources/${id}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      setEditingResource(null);
      form.reset();
      setTagsInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  // Delete resource mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/resources/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      setDeletingResource(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    form.reset({
      type: selectedType as any,
      title: "",
      description: "",
      content: "",
      category: "",
      tags: [],
      published: true,
      featured: false,
    });
    setTagsInput("");
    setIsAddDialogOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    form.reset({
      type: resource.type,
      title: resource.title,
      description: resource.description || "",
      content: resource.content || "",
      category: resource.category || "",
      tags: resource.tags || [],
      published: resource.published,
      featured: resource.featured || false,
    });
    setTagsInput(resource.tags?.join(", ") || "");
    setEditingResource(resource);
  };

  const handleSubmit = (data: ResourceFormData) => {
    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const submissionData = { ...data, tags };

    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data: submissionData });
    } else {
      createMutation.mutate(submissionData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Resource Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage articles, videos, newsletters, flipbooks, and FAQs
          </p>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              {resourceTypes.map(type => {
                const Icon = type.icon;
                return (
                  <TabsTrigger key={type.id} value={type.id} data-testid={`tab-${type.id}`}>
                    <Icon className="h-4 w-4 mr-2" />
                    {type.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <Button onClick={handleAdd} data-testid="button-add-resource">
              <Plus className="h-4 w-4 mr-2" />
              Add {resourceTypes.find(t => t.id === selectedType)?.name.slice(0, -1)}
            </Button>
          </div>

          {resourceTypes.map(type => (
            <TabsContent key={type.id} value={type.id}>
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : resources && resources.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map(resource => (
                    <Card key={resource.id} data-testid={`card-resource-${resource.id}`}>
                      <CardHeader>
                        <CardTitle className="flex items-start justify-between">
                          <span className="flex-1" data-testid={`text-resource-title-${resource.id}`}>
                            {resource.title}
                          </span>
                          <div className="flex gap-1">
                            {resource.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                            {!resource.published && (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </div>
                        </CardTitle>
                        {resource.category && (
                          <Badge variant="outline" data-testid={`badge-category-${resource.id}`}>
                            {resource.category}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resource.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {resource.description}
                          </p>
                        )}
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{resource.viewCount || 0} views</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(resource)}
                            data-testid={`button-edit-${resource.id}`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingResource(resource)}
                            data-testid={`button-delete-${resource.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <type.icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No {type.name} Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by creating your first {type.name.toLowerCase().slice(0, -1)}.
                    </p>
                    <Button onClick={handleAdd}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add {type.name.slice(0, -1)}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen || !!editingResource} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingResource(null);
            form.reset();
            setTagsInput("");
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? 'Edit' : 'Add'} {resourceTypes.find(t => t.id === selectedType)?.name.slice(0, -1)}
              </DialogTitle>
              <DialogDescription>
                {editingResource ? 'Update' : 'Create a new'} {resourceTypes.find(t => t.id === selectedType)?.name.toLowerCase().slice(0, -1)} with rich text content, category, and tags.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter title" data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Enter description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Enter full content"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Enter category" data-testid="input-category" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    data-testid="input-tags"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate tags with commas (e.g., "finance, investing, retirement")
                  </p>
                </div>

                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel>Published</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            data-testid="switch-published"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormLabel>Featured</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            data-testid="switch-featured"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingResource(null);
                      form.reset();
                      setTagsInput("");
                    }}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingResource} onOpenChange={(open) => !open && setDeletingResource(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resource</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingResource?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingResource && deleteMutation.mutate(deletingResource.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
