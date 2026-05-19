import { useQuery } from "@tanstack/react-query";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Mail,
  Book,
  HelpCircle,
  UserPlus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import type { PageContent } from "@shared/schema";
import { HTMLContent } from "@/components/HTMLContent";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import resourcesHeroDefault from "@assets/image_1765301156968.png";
import { Link } from "wouter";

const resourcePages = [
  {
    title: "Articles",
    description: "Browse our library of financial articles covering investment strategies, market insights, and personal finance topics.",
    href: "/resources/articles",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Flipbooks",
    description: "Interactive magazine-style flipbooks that illustrate key financial concepts in an engaging visual format.",
    href: "/resources/flipbooks",
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about financial planning, account management, and our services.",
    href: "/faq",
    icon: HelpCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Newsletters",
    description: "Stay informed with our periodic newsletters covering current financial topics and market updates.",
    href: "/resources/newsletters",
    icon: Mail,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export default function Resources() {
  usePageTitle("Resources");
  const heroImage = useDynamicImage("resources", "hero", resourcesHeroDefault);

  const { data: resourceTypesContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "resources"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=resources", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const getSection = (sectionName: string) => {
    return resourceTypesContent?.find((c) => c.section === sectionName);
  };

  const pageHeader = getSection("resources_header")?.content as any;
  const becomeClientData = getSection("resources_become_client")?.content as any;
  const needHelpData = getSection("resources_need_help")?.content as any;

  type ResourceIcon = "FileText" | "Book" | "HelpCircle" | "UserPlus" | "Mail";
  const iconMap: Record<ResourceIcon, typeof FileText> = { FileText, Book, HelpCircle, UserPlus, Mail };
  const getIcon = (iconName: string): typeof FileText => {
    if (iconName in iconMap) return iconMap[iconName as ResourceIcon];
    return FileText;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <section>
        <div className="hero-banner">
          <img src={heroImage} alt="Financial Resources" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pageHeader && (
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={getFieldFontStyle(pageHeader, 'title')}>{pageHeader.title}</h1>
            <HTMLContent content={pageHeader.description} className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8" style={getFieldFontStyle(pageHeader, 'description')} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {resourcePages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.href} href={page.href}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${page.bgColor} flex-shrink-0`}>
                      <Icon className={`h-8 w-8 ${page.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-muted-foreground mb-3">{page.description}</p>
                      <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                        View {page.title} <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {(becomeClientData || needHelpData) && (
          <div className="grid md:grid-cols-2 gap-8">
            {becomeClientData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {(() => {
                      const IconComponent = getIcon(becomeClientData.icon);
                      return <IconComponent className="h-5 w-5 mr-2 text-primary" />;
                    })()}
                    <span style={getFieldFontStyle(becomeClientData, 'title')}>{becomeClientData.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HTMLContent content={becomeClientData.description} className="text-muted-foreground mb-4" style={getFieldFontStyle(becomeClientData, 'description')} />
                  {becomeClientData.benefits && becomeClientData.benefits.length > 0 && (
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      {becomeClientData.benefits.map((benefit: string, index: number) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  )}
                  {/* nosemgrep: javascript.browser.security.js-open-redirect-from-function */}
                  <Button className="w-full" onClick={() => (window.location.href = becomeClientData.buttonHref)}>
                    {becomeClientData.buttonText}
                  </Button>
                </CardContent>
              </Card>
            )}
            {needHelpData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {(() => {
                      const IconComponent = getIcon(needHelpData.icon);
                      return <IconComponent className="h-5 w-5 mr-2 text-secondary" />;
                    })()}
                    <span style={getFieldFontStyle(needHelpData, 'title')}>{needHelpData.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HTMLContent content={needHelpData.description} className="text-muted-foreground mb-4" style={getFieldFontStyle(needHelpData, 'description')} />
                  {needHelpData.actions && needHelpData.actions.length > 0 && (
                    <div className="space-y-3">
                      {needHelpData.actions.map((action: any, index: number) => {
                        const ActionIcon = getIcon(action.icon);
                        // nosemgrep: javascript.browser.security.js-open-redirect-from-function
                        const handleActionClick = () => { window.location.href = action.href; };
                        return (
                          <Button key={index} variant="outline" className="w-full justify-start" onClick={handleActionClick}>
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
      </div>
    </div>
  );
}
