import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

const resourceTypes = [
  {
    id: "article",
    name: "Articles",
    icon: FileText,
    description: "Expert insights on market trends, investment strategies, and financial planning.",
  },
  {
    id: "video",
    name: "Videos",
    icon: Video,
    description: "Video tutorials and webinars covering essential financial concepts.",
  },
  {
    id: "newsletter",
    name: "Newsletters",
    icon: Mail,
    description: "Weekly market updates and quarterly financial outlooks.",
  },
  {
    id: "flipbook",
    name: "Flipbooks",
    icon: Book,
    description: "Interactive brochures and comprehensive planning guides.",
  },
  {
    id: "faq",
    name: "FAQ",
    icon: HelpCircle,
    description: "Searchable answers to common financial planning questions.",
  },
];

const categories = [
  "Market Analysis",
  "Investment Strategy",
  "Retirement Planning",
  "Tax Planning",
  "Estate Planning",
  "Risk Management",
  "Financial Education",
  "Economic Outlook",
];

export default function Resources() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("article");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const handleViewResource = (resourceId: string) => {
    // Increment view count
    fetch(`/api/resources/${resourceId}`, { method: "GET" })
      .then(() => {
        toast({
          title: "Resource Opened",
          description: "View count updated successfully.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to open resource.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resource Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Educational content, tools, and resources to help you make informed financial decisions.
            Stay updated with market trends and expert insights.
          </p>
        </div>

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
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-8">
          {/* Resource Type Tabs */}
          <TabsList className="grid w-full grid-cols-5">
            {resourceTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1">
                <type.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content for each resource type */}
          {resourceTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-6">
              <div className="text-center">
                <Badge className="mb-4">
                  <type.icon className="h-4 w-4 mr-1" />
                  {type.name}
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{type.name}</h2>
                <p className="text-muted-foreground">{type.description}</p>
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

              {/* Resource Grid */}
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
              ) : filteredResources.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource: any) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onView={() => handleViewResource(resource.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <type.icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Resources Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-primary" />
                Become a Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ready to take your financial planning to the next level? Learn about our comprehensive client services.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Personalized financial planning</li>
                <li>• Dedicated advisor support</li>
                <li>• Advanced portfolio management</li>
                <li>• Priority access to new tools</li>
              </ul>
              <Button className="w-full">
                Learn More About Client Services
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-secondary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Have questions about our platform or need assistance with financial planning?
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Browse FAQ Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
