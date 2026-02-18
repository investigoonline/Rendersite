import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HTMLContent } from "@/components/HTMLContent";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";
import { FileText, Scale, Shield } from "lucide-react";

interface LegalPageProps {
  pageType: 'privacy_policy' | 'terms_of_service' | 'disclosures';
}

const pageConfig = {
  privacy_policy: {
    icon: Shield,
    sectionKey: 'legal_privacy_policy',
    defaultTitle: 'Privacy Policy',
    defaultContent: 'Privacy policy content is being prepared. Please check back soon.',
  },
  terms_of_service: {
    icon: FileText,
    sectionKey: 'legal_terms_of_service',
    defaultTitle: 'Terms of Service',
    defaultContent: 'Terms of service content is being prepared. Please check back soon.',
  },
  disclosures: {
    icon: Scale,
    sectionKey: 'legal_disclosures',
    defaultTitle: 'Disclosures',
    defaultContent: 'Disclosures content is being prepared. Please check back soon.',
  },
};

export default function LegalPage({ pageType }: LegalPageProps) {
  const config = pageConfig[pageType];
  const Icon = config.icon;

  const { data: pageContent, isLoading } = useQuery<any[]>({
    queryKey: ['/api/content', { page: pageType }],
    queryFn: async () => {
      const res = await fetch(`/api/content?page=${pageType}`, { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const content = pageContent?.find(p => p.section === config.sectionKey)?.content;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl" style={getFieldFontStyle(content, 'title')}>
                  {content?.title || config.defaultTitle}
                </CardTitle>
                {content?.lastUpdated && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last Updated: {content.lastUpdated}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-gray max-w-none">
              {content?.content ? (
                <HTMLContent content={content.content} style={getFieldFontStyle(content, 'content')} />
              ) : (
                <p className="text-muted-foreground">{config.defaultContent}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
