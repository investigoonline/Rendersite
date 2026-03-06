import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { FileText, Search } from "lucide-react";
import { HTMLContent } from "@/components/HTMLContent";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import resourcesHeroDefault from "@assets/image_1765301156968.png";
import type { PageContent } from "@shared/schema";

export default function Articles() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingResource, setViewingResource] = useState<any | null>(null);

  const heroImage = useDynamicImage("resources", "hero", resourcesHeroDefault);

  const { data: resourceTypesContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "resources"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=resources", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const articleSection = resourceTypesContent?.find(
    (c) => !["resources_header", "resources_become_client", "resources_need_help"].includes(c.section) && (c.content as any)?.id === "article"
  )?.content as any;

  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources", "article"],
    queryFn: async () => {
      const response = await fetch("/api/resources?type=article");
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  const filteredResources =
    resources?.filter(
      (resource: any) =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleViewResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch resource");
      const resource = await response.json();
      if (resource.url) {
        window.open(resource.url, "_blank");
      } else {
        setViewingResource(resource);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to open resource.", variant: "destructive" });
    }
  };

  const categorizedArticles = filteredResources.reduce((acc: any, resource: any) => {
    const category = resource.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(resource);
    return acc;
  }, {});

  const categories = Object.keys(categorizedArticles).sort();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <section>
        <div className="w-full">
          <img src={heroImage} alt="Financial Articles" className="w-full object-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px]" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Resources</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Articles</h1>
          {articleSection?.description && (
            <HTMLContent content={articleSection.description} className="text-muted-foreground max-w-3xl mx-auto" />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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
        ) : categories.length > 0 ? (
          <Accordion type="multiple" defaultValue={[]} className="space-y-4">
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
                      <ResourceCard key={resource.id} resource={resource} onView={() => handleViewResource(resource.id)} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No articles match your search criteria." : "No articles are available at the moment. Check back soon."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!viewingResource} onOpenChange={(open) => !open && setViewingResource(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {viewingResource && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  {viewingResource.category && <Badge variant="outline">{viewingResource.category}</Badge>}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
