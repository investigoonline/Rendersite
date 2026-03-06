import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink } from "lucide-react";
import { HTMLContent } from "@/components/HTMLContent";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import disclosuresHeroDefault from "@assets/Disclosures_hero.png";
import type { PageContent } from "@shared/schema";

const disclosures = [
  {
    title: "ADV Part 2A - Firm Brochure",
    description:
      "Comprehensive information about IFS Group's advisory services, fees, and business practices.",
    lastUpdated: "December 2024",
    type: "PDF",
    size: "2.1 MB",
  },
  {
    title: "ADV Part 2B - Brochure Supplement",
    description:
      "Information about our investment adviser representatives and their qualifications.",
    lastUpdated: "December 2024",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    title: "Privacy Policy",
    description:
      "How we collect, use, and protect your personal and financial information.",
    lastUpdated: "November 2024",
    type: "PDF",
    size: "892 KB",
  },
  {
    title: "Business Continuity Plan",
    description:
      "Our procedures for maintaining operations during significant business disruptions.",
    lastUpdated: "October 2024",
    type: "PDF",
    size: "1.2 MB",
  },
  {
    title: "Proxy Voting Policy",
    description: "Guidelines for voting proxies on behalf of client accounts.",
    lastUpdated: "September 2024",
    type: "PDF",
    size: "756 KB",
  },
  {
    title: "Code of Ethics",
    description:
      "Standards of conduct for all IFS Group employees and representatives.",
    lastUpdated: "January 2024",
    type: "PDF",
    size: "943 KB",
  },
];

const importantNotices = [
  {
    title: "Investment Risk Disclosure",
    content:
      "All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results. Market volatility can significantly impact portfolio values.",
  },
  {
    title: "Fiduciary Responsibility",
    content:
      "IFS Group acts as a fiduciary, meaning we are legally obligated to act in your best interests at all times. This includes providing advice that is suitable for your specific financial situation.",
  },
  {
    title: "Fee Structure Transparency",
    content:
      "Our fees are clearly disclosed in our ADV Part 2A. We believe in transparent pricing with no hidden costs or commissions that could create conflicts of interest.",
  },
  {
    title: "Data Security",
    content:
      "We employ bank-level security measures to protect your personal and financial information. All data is encrypted in transit and at rest, and we regularly undergo third-party security audits.",
  },
];

export default function Disclosures() {
  const heroImage = useDynamicImage("disclosures", "hero", disclosuresHeroDefault);

  const { data: pageContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "disclosures"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=disclosures", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const headerContent = pageContent?.find((c) => c.section === "disclosures_header")?.content as any;
  const legalContent = pageContent?.find((c) => c.section === "legal_disclosures")?.content as any;

  const badgeText = headerContent?.badge || "Legal & Compliance";
  const titleText = headerContent?.title || "Disclosures & Legal Documents";
  const subtitleText = headerContent?.subtitle || "Access important legal documents, regulatory disclosures, and compliance information.";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <img
          src={heroImage}
          alt="IFS Wealth Management disclosures and compliance"
          className="w-full object-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px]"
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

        {legalContent?.content && (
          <Card className="mb-8">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl" style={getFieldFontStyle(legalContent, 'title')}>
                    {legalContent.title || "Disclosures"}
                  </CardTitle>
                  {legalContent.lastUpdated && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Last Updated: {legalContent.lastUpdated}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none">
                <HTMLContent content={legalContent.content} style={getFieldFontStyle(legalContent, 'content')} />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Important Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {importantNotices.map((notice, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {notice.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Legal Notice:</strong> The information provided on this page
            is for informational purposes only and should not be construed as
            legal or investment advice. All documents are provided in good faith
            and are believed to be accurate as of their respective dates. IFS
            Group reserves the right to update these documents as required by
            law or regulation. Please consult with your advisor or legal counsel
            regarding specific questions about these disclosures.
          </p>
        </div>
      </div>
    </div>
  );
}
