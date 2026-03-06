import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ResourceCard from "@/components/resources/ResourceCard";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Calendar,
  Tag,
  TrendingUp,
  Star,
} from "lucide-react";
import type { PageContent } from "@shared/schema";
import { HTMLContent } from "@/components/HTMLContent";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";

export default function Blog() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch blog page content
  const { data: blogContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'blog'],
    queryFn: async () => {
      const res = await fetch('/api/content?page=blog', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch blog content: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return blogContent?.find(c => c.section === sectionName);
  };

  // Extract sections
  const pageHeader = getSection('blog_header')?.content as any;
  const featuredSection = getSection('blog_featured')?.content as any;
  const categoriesSection = getSection('blog_categories')?.content as any;
  const ctaSection = getSection('blog_cta')?.content as any;

  // Fetch blog posts (flipbooks)
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["/api/resources", "flipbook", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("type", "flipbook");
      if (selectedCategory) params.append("category", selectedCategory);
      
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });

  // Get featured posts (first 3 or posts marked as featured)
  const featuredPosts = blogPosts?.filter((post: any) => post.featured).slice(0, 3) || 
                       blogPosts?.slice(0, 3) || [];

  // Get regular posts (excluding featured)
  const regularPosts = blogPosts?.filter((post: any) => 
    !featuredPosts.some((fp: any) => fp.id === post.id)
  ) || [];

  const filteredPosts = regularPosts.filter((post: any) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPost = (postId: string) => {
    // Increment view count
    fetch(`/api/resources/${postId}`, { method: "GET" })
      .then(() => {
        toast({
          title: "Article Opened",
          description: "View count updated successfully.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to open article.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {pageHeader && (
          <div className="text-center mb-12">
            {pageHeader.badge && (
              <Badge className="mb-4" variant="secondary">
                {pageHeader.badge}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={getFieldFontStyle(pageHeader, 'title')}>
              {pageHeader.title}
            </h1>
            <HTMLContent content={pageHeader.description} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" style={getFieldFontStyle(pageHeader, 'description')} />
          </div>
        )}

        {/* Featured Posts Section */}
        {featuredSection && featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900" style={getFieldFontStyle(featuredSection, 'title')}>
                {featuredSection.title}
              </h2>
            </div>
            <HTMLContent content={featuredSection.description} className="text-muted-foreground mb-6" style={getFieldFontStyle(featuredSection, 'description')} />
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post: any) => (
                <Card key={post.id} className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <ResourceCard
                    resource={post}
                    onView={() => handleViewPost(post.id)}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section */}
        {categoriesSection && categoriesSection.categories && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={getFieldFontStyle(categoriesSection, 'title')}>
              {categoriesSection.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => setSelectedCategory("")}
                size="sm"
                data-testid="button-category-all"
              >
                All Articles
              </Button>
              {categoriesSection.categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  data-testid={`button-category-${category.id}`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category.name}
                  {category.count !== undefined && (
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-blog-search"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? "Filtered Articles" : "All Articles"}
            </h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{filteredPosts.length} articles</span>
            </div>
          </div>

          {isLoading ? (
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
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: any) => (
                <ResourceCard
                  key={post.id}
                  resource={post}
                  onView={() => handleViewPost(post.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Articles Found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "No blog posts match your search criteria. Try adjusting your search terms."
                    : "No blog posts are available at the moment. Check back soon for new content."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        {ctaSection && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4" style={getFieldFontStyle(ctaSection, 'title')}>
                {ctaSection.title}
              </h2>
              <HTMLContent content={ctaSection.description} className="text-muted-foreground mb-6 max-w-2xl mx-auto" style={getFieldFontStyle(ctaSection, 'description')} />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {ctaSection.primaryButtonText && (
                  <Button
                    onClick={() => window.location.href = ctaSection.primaryButtonHref}
                    size="lg"
                    data-testid="button-blog-cta-primary"
                  >
                    {ctaSection.primaryButtonText}
                  </Button>
                )}
                {ctaSection.secondaryButtonText && (
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = ctaSection.secondaryButtonHref}
                    size="lg"
                    data-testid="button-blog-cta-secondary"
                  >
                    {ctaSection.secondaryButtonText}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
