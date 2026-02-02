import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ResourceCard from "@/components/resources/ResourceCard";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Video,
  Mail,
  Book,
  HelpCircle,
  UserPlus,
  Search,
  Filter,
  Eye,
  Calendar,
  BookOpen,
} from "lucide-react";
import type { PageContent, ImageAsset } from "@shared/schema";
import { HTMLContent } from "@/components/HTMLContent";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import resourcesHeroDefault from "@assets/image_1765301156968.png";

interface ResourceType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const flipbookData = [
  {
    id: "financial-management",
    title: "Financial Management Insight:",
    subtitle: "Strategies to Help Build Your Future",
    description: "The decisions you make about money form the basis for your financial future and can help you pursue your goals.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    bgColor: "from-purple-900 to-purple-700",
  },
  {
    id: "social-security",
    title: "Understanding Social Security and Medicare:",
    subtitle: "America's Retirement Safety Net",
    description: "Social Security and Medicare rules can be complex. To help maximize benefits, it pays to understand your options.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    bgColor: "from-teal-700 to-teal-500",
  },
  {
    id: "higher-education",
    title: "Higher Education:",
    subtitle: "College Saving and Funding Strategies",
    description: "College is an investment in your child's future. It requires a savings commitment and knowledge of funding methods.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    bgColor: "from-blue-600 to-blue-400",
  },
  {
    id: "investing-basics",
    title: "Investing Basics:",
    subtitle: "Embark on Your Wealth-Building Journey",
    description: "Weighing the risks and rewards of various investment options can help you develop a sound investment strategy.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop",
    bgColor: "from-amber-700 to-amber-500",
  },
  {
    id: "tax-savvy",
    title: "Time to Get Tax-Savvy:",
    subtitle: "Managing Your Tax Burden",
    description: "Understanding tax rules and spotting tax-saving opportunities might help you put the money to better use.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
    bgColor: "from-yellow-600 to-yellow-400",
  },
  {
    id: "wealth-preservation",
    title: "Wealth Preservation:",
    subtitle: "Planning to Leave a Legacy",
    description: "An estate planning strategy could increase the value of your estate and help avoid potential conflicts and delays.",
    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop",
    bgColor: "from-emerald-700 to-emerald-500",
  },
  {
    id: "financial-protection",
    title: "Financial Protection:",
    subtitle: "Using Insurance to Help Manage Life's Risks",
    description: "Home, auto, life, disability — Protect your financial interests by having the appropriate insurance coverage.",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=300&fit=crop",
    bgColor: "from-gray-700 to-gray-500",
  },
];

export default function Resources() {
  const { toast } = useToast();
  const [location] = useLocation();
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  
  const [selectedType, setSelectedType] = useState("article");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewingResource, setViewingResource] = useState<any | null>(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    if (typeParam) {
      setSelectedType(typeParam);
      setTimeout(() => {
        tabsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);
  
  // Hero image with CMS support
  const heroImage = useDynamicImage("resources", "hero", resourcesHeroDefault);

  // Fetch resource types content
  const { data: resourceTypesContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'resources'],
    queryFn: async () => {
      const res = await fetch('/api/content?page=resources', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch resources: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get icon component by name with type safety
  type ResourceIcon = 'FileText' | 'Video' | 'Mail' | 'Book' | 'HelpCircle' | 'UserPlus' | 'Calendar';
  
  const iconMap: Record<ResourceIcon, typeof FileText> = {
    FileText,
    Video,
    Mail,
    Book,
    HelpCircle,
    UserPlus,
    Calendar,
  };
  
  const getIcon = (iconName: string): typeof FileText => {
    if (iconName in iconMap) {
      return iconMap[iconName as ResourceIcon];
    }
    console.warn(`Unknown icon name: ${iconName}, falling back to FileText`);
    return FileText;
  };

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return resourceTypesContent?.find(c => c.section === sectionName);
  };

  // Extract sections
  const pageHeader = getSection('resources_header')?.content as any;
  const becomeClientData = getSection('resources_become_client')?.content as any;
  const needHelpData = getSection('resources_need_help')?.content as any;

  // Extract resource types from database content (excluding header and additional sections)
  // Keep the database ID for unique keys
  const resourceTypes: (ResourceType & { dbId: string })[] = resourceTypesContent
    ?.filter(c => !['resources_header', 'resources_become_client', 'resources_need_help'].includes(c.section))
    .map(content => ({ ...(content.content as ResourceType), dbId: content.id }))
    .filter(type => type && type.id && type.name) || [];

  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources", selectedType, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedType) params.append("type", selectedType);
      if (selectedCategory) params.append("category", selectedCategory);
      
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  const filteredResources = resources?.filter((resource: any) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSubscribeNewsletter = () => {
    toast({
      title: "Newsletter Subscription",
      description: "You've been subscribed to our weekly financial insights newsletter.",
    });
  };

  const handleViewResource = async (resourceId: string) => {
    try {
      // Fetch full resource with content
      const response = await fetch(`/api/resources/${resourceId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch resource');
      
      const resource = await response.json();
      
      // If resource has a URL, open it in new tab
      if (resource.url) {
        window.open(resource.url, '_blank');
        toast({
          title: "Resource Opened",
          description: "View count updated successfully.",
        });
      } else {
        // Otherwise, show in dialog
        setViewingResource(resource);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open resource.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Hero Section - Same sizing as Landing page */}
      <section>
        <div className="w-full">
          <img
            src={heroImage}
            alt="Financial Resources"
            className="w-full object-cover"
            style={{ height: "480px" }}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {pageHeader && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {pageHeader.title}
            </h1>
            <HTMLContent content={pageHeader.description} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" />
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div ref={tabsSectionRef}>
        <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-8">
          {/* Resource Type Tabs */}
          <TabsList className="grid w-full grid-cols-5">
            {resourceTypes.map((type) => {
              const IconComponent = getIcon(type.icon);
              return (
              <TabsTrigger key={type.dbId} value={type.id} className="flex items-center gap-1">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content for each resource type */}
          {resourceTypes.map((type: any) => (
            <TabsContent key={type.dbId} value={type.id} className="space-y-6">
              <div>
                {type.showBadge !== false && (
                  <div className="mb-4">
                    <HTMLContent content={type.badgeText || type.name} className="" />
                  </div>
                )}
                <div className="text-center">
                  <HTMLContent content={type.description} className="text-muted-foreground" />
                </div>
              </div>

              {/* Special handling for Newsletter */}
              {type.id === "newsletter" && (
                <Card className="border-secondary/20 bg-secondary/5 mb-6">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Subscribe to Weekly Insights
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Get the latest market analysis and financial planning tips delivered to your inbox every week.
                    </p>
                    <Button onClick={handleSubscribeNewsletter}>
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Special handling for Flipbooks */}
              {type.id === "flipbook" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Flipbooks</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      These magazine-style flipbooks provide helpful information on a variety of financial topics and illustrate key financial concepts. Select one of the flipbooks below and click the image to view it.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {flipbookData.slice(0, 4).map((flipbook) => (
                      <div key={flipbook.id} className="group cursor-pointer">
                        <div className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gradient-to-br ${flipbook.bgColor} shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
                            <p className="text-xs font-medium opacity-90 mb-1">{flipbook.title}</p>
                            <p className="text-sm font-bold leading-tight">{flipbook.subtitle}</p>
                          </div>
                          <img 
                            src={flipbook.image} 
                            alt={flipbook.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {flipbook.title} <span className="font-normal">{flipbook.subtitle}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {flipbook.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:px-16">
                    {flipbookData.slice(4).map((flipbook) => (
                      <div key={flipbook.id} className="group cursor-pointer">
                        <div className={`relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gradient-to-br ${flipbook.bgColor} shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
                            <p className="text-xs font-medium opacity-90 mb-1">{flipbook.title}</p>
                            <p className="text-sm font-bold leading-tight">{flipbook.subtitle}</p>
                          </div>
                          <img 
                            src={flipbook.image} 
                            alt={flipbook.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {flipbook.title} <span className="font-normal">{flipbook.subtitle}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {flipbook.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource Grid - Skip for flipbook since it has its own section */}
              {type.id !== "flipbook" && (
                isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredResources.length > 0 ? (
                type.id === 'article' ? (
                  // Collapsible sections for articles grouped by category
                  (() => {
                    // Group articles by category
                    const categorizedArticles = filteredResources.reduce((acc: any, resource: any) => {
                      const category = resource.category || 'Uncategorized';
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(resource);
                      return acc;
                    }, {});

                    const categories = Object.keys(categorizedArticles).sort();

                    return (
                      <Accordion type="multiple" defaultValue={categories.slice(0, 2)} className="space-y-4">
                        {categories.map((category) => (
                          <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>{category}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {categorizedArticles[category].length}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                                {categorizedArticles[category].map((resource: any) => (
                                  <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onView={() => handleViewResource(resource.id)}
                                  />
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    );
                  })()
                ) : (
                  // Regular grid for other resource types
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource: any) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onView={() => handleViewResource(resource.id)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    {(() => {
                      const IconComponent = getIcon(type.icon);
                      return <IconComponent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />;
                    })()}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No {type.name} Found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? `No ${type.name.toLowerCase()} match your search criteria. Try adjusting your filters.`
                        : `No ${type.name.toLowerCase()} are available at the moment. Check back soon for new content.`
                      }
                    </p>
                  </CardContent>
                </Card>
              )
              )}
            </TabsContent>
          ))}
        </Tabs>
        </div>

        {/* Additional Resources Section */}
        {(becomeClientData || needHelpData) && (
          <div className="mt-16 grid md:grid-cols-2 gap-8" data-testid="section-additional-resources">
            {becomeClientData && (
              <Card data-testid="card-become-client">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {(() => {
                      const IconComponent = getIcon(becomeClientData.icon);
                      return <IconComponent className="h-5 w-5 mr-2 text-primary" />;
                    })()}
                    <span data-testid="text-become-client-title">{becomeClientData.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HTMLContent content={becomeClientData.description} className="text-muted-foreground mb-4" data-testid="text-become-client-description" />
                  {becomeClientData.benefits && becomeClientData.benefits.length > 0 && (
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      {becomeClientData.benefits.map((benefit: string, index: number) => (
                        <li key={index} data-testid={`text-benefit-${index}`}>• {benefit}</li>
                      ))}
                    </ul>
                  )}
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = becomeClientData.buttonHref}
                    data-testid="button-become-client"
                  >
                    {becomeClientData.buttonText}
                  </Button>
                </CardContent>
              </Card>
            )}

            {needHelpData && (
              <Card data-testid="card-need-help">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {(() => {
                      const IconComponent = getIcon(needHelpData.icon);
                      return <IconComponent className="h-5 w-5 mr-2 text-secondary" />;
                    })()}
                    <span data-testid="text-need-help-title">{needHelpData.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HTMLContent content={needHelpData.description} className="text-muted-foreground mb-4" data-testid="text-need-help-description" />
                  {needHelpData.actions && needHelpData.actions.length > 0 && (
                    <div className="space-y-3">
                      {needHelpData.actions.map((action: any, index: number) => {
                        const ActionIcon = getIcon(action.icon);
                        return (
                          <Button 
                            key={index}
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.location.href = action.href}
                            data-testid={`button-help-action-${index}`}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            {action.label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Article Viewer Dialog */}
        <Dialog open={!!viewingResource} onOpenChange={(open) => !open && setViewingResource(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {viewingResource && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {viewingResource.category && (
                      <Badge variant="outline">{viewingResource.category}</Badge>
                    )}
                    {viewingResource.publishDate && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(viewingResource.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  <DialogTitle className="text-2xl">{viewingResource.title}</DialogTitle>
                  {viewingResource.description && (
                    <DialogDescription asChild>
                      <HTMLContent content={viewingResource.description} className="text-base" />
                    </DialogDescription>
                  )}
                </DialogHeader>
                
                <div className="mt-6">
                  {viewingResource.content ? (
                    <HTMLContent content={viewingResource.content} className="prose max-w-none" />
                  ) : (
                    <p className="text-muted-foreground italic">No content available</p>
                  )}
                </div>

                {viewingResource.tags && viewingResource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                    {viewingResource.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
