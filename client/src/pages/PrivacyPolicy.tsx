import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { HTMLContent } from "@/components/HTMLContent";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import privacyHeroDefault from "@assets/PrivacyPolicy_hero.png";
import type { PageContent } from "@shared/schema";

export default function PrivacyPolicy() {
  const heroImage = useDynamicImage("privacy_policy", "hero", privacyHeroDefault);

  const { data: pageContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "privacy_policy"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=privacy_policy", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const headerContent = pageContent?.find((c) => c.section === "privacy_policy_header")?.content as any;
  const legalContent = pageContent?.find((c) => c.section === "legal_privacy_policy")?.content as any;

  const badgeText = headerContent?.badge || "Privacy & Security";
  const titleText = headerContent?.title || "Privacy Policy";
  const subtitleText = headerContent?.subtitle || "Learn how we protect your personal and financial information.";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <img
          src={heroImage}
          alt="IFS Wealth Management privacy policy"
          className="w-full object-cover"
          style={{ height: "480px" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            {badgeText}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {titleText}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-wrap">
            {subtitleText}
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">
                  {legalContent?.title || "Privacy Policy"}
                </CardTitle>
                {legalContent?.lastUpdated && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last Updated: {legalContent.lastUpdated}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-gray max-w-none">
              {legalContent?.content ? (
                <HTMLContent content={legalContent.content} />
              ) : (
                <p className="text-muted-foreground">Privacy policy content is being prepared. Please check back soon.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
