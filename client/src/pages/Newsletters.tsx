import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import resourcesHeroDefault from "@assets/image_1765301156968.png";
import type { PageContent } from "@shared/schema";

export default function Newsletters() {
  const { toast } = useToast();
  const resourcesHeroImage = useDynamicImage("resources", "hero", resourcesHeroDefault);
  const newslettersHeroImage = useDynamicImage("newsletters", "hero", "");
  const heroImage = newslettersHeroImage || resourcesHeroImage;

  const { data: newsletterContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "newsletters"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=newsletters", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: resourcesContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "resources"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=resources", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const newsletterHeader = newsletterContent?.find((c) => c.section === "newsletter_header")?.content as
    | { title: string; subtitle: string; description: string }
    | undefined;

  const resourcesNewsletterSection = resourcesContent?.find(
    (c) => c.section === "resources_newsletters"
  )?.content as { name: string; description: string } | undefined;

  const headerTitle = newsletterHeader?.title || resourcesNewsletterSection?.name || "Newsletters";
  const headerSubtitle = newsletterHeader?.subtitle ||
    "Will you outlive your retirement income? Are your financial expectations for the coming year realistic?";
  const headerDescription = newsletterHeader?.description || resourcesNewsletterSection?.description ||
    "Our financial newsletters are designed to provide helpful information on a wide variety of financial topics. Simply click on one of the newsletter topics below to read the article in its entirety.";

  const newsletterArticles =
    newsletterContent
      ?.filter((c) => c.section === "newsletter_article")
      .map(
        (content) =>
          content.content as {
            title: string;
            description: string;
            month: string;
            year: number;
            isHotTopic: boolean;
            linkUrl?: string;
            sortOrder: number;
          }
      )
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) || [];

  const newslettersByMonthYear = newsletterArticles.reduce(
    (acc, article) => {
      const key = `${article.month} ${article.year}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(article);
      return acc;
    },
    {} as Record<string, typeof newsletterArticles>
  );

  const handleSubscribeNewsletter = () => {
    toast({
      title: "Newsletter Subscription",
      description: "You've been subscribed to our weekly financial insights newsletter.",
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <section>
        <div className="hero-banner">
          <img src={heroImage} alt="Financial Newsletters" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">Resources</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {headerTitle}
          </h1>
          <p className="text-muted-foreground mb-2 italic">
            {headerSubtitle}
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto whitespace-pre-wrap">
            {headerDescription}
          </p>
        </div>

        {Object.keys(newslettersByMonthYear).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(newslettersByMonthYear).map(([monthYear, articles]) => (
              <div key={monthYear} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-500 border-b pb-2">{monthYear}</h3>
                <div className="space-y-6">
                  {articles.map((article, index) => (
                    <div key={`${monthYear}-${index}`} className="space-y-1">
                      <h4 className="font-semibold text-[#1a5276] hover:underline cursor-pointer">
                        {article.isHotTopic && <span className="text-[#1a5276] font-bold">HOT TOPIC: </span>}
                        {article.linkUrl ? (
                          <a href={article.linkUrl} target="_blank" rel="noopener noreferrer">
                            {article.title}
                          </a>
                        ) : (
                          article.title
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{article.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-secondary/20 bg-secondary/5">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Newsletters Yet</h3>
              <p className="text-muted-foreground mb-4">
                Newsletter articles will appear here once they are published via Content Management.
              </p>
              <Button onClick={handleSubscribeNewsletter}>Subscribe for Updates</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
