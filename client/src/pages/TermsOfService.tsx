import { useQuery } from "@tanstack/react-query";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { HTMLContent } from "@/components/HTMLContent";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import termsHeroDefault from "@assets/TermsOfService_hero.png";
import type { PageContent } from "@shared/schema";

export default function TermsOfService() {
  usePageTitle("Terms of Service");
  const heroImage = useDynamicImage("terms_of_service", "hero", termsHeroDefault);

  const { data: pageContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "terms_of_service"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=terms_of_service", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const headerContent = pageContent?.find((c) => c.section === "terms_of_service_header")?.content as any;
  const legalContent = pageContent?.find((c) => c.section === "legal_terms_of_service")?.content as any;

  const badgeText = headerContent?.badge || "Legal Agreement";
  const titleText = headerContent?.title || "Terms of Service";
  const subtitleText = headerContent?.subtitle || "Please review our terms and conditions for using IFS Wealth Management services.";

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
      <div className="hero-banner">
        <img
          src={heroImage}
          alt="IFS Wealth Management terms of service"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            {badgeText}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={getFieldFontStyle(headerContent, 'title')}>
            {titleText}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto whitespace-pre-wrap" style={getFieldFontStyle(headerContent, 'subtitle')}>
            {subtitleText}
          </p>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl" style={getFieldFontStyle(legalContent, 'title')}>
                  {legalContent?.title || "Terms of Service"}
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
                <HTMLContent content={legalContent.content} style={getFieldFontStyle(legalContent, 'content')} />
              ) : (
                <p className="text-muted-foreground">Terms of service content is being prepared. Please check back soon.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
