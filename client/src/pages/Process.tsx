import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import aboutHeroDefault from "@assets/About_1765299432034.png";
import type { PageContent } from "@shared/schema";

export default function Process() {
  const heroImage = useDynamicImage("process", "hero", aboutHeroDefault);

  const { data: pageContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "process"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=process", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch process content");
      return res.json();
    },
  });

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

  const getContent = (section: string): any => {
    return pageContent?.find((p) => p.section === section)?.content;
  };

  const getSteps = () => {
    return pageContent
      ?.filter((p) => p.section === "process_step")
      ?.map((p) => p.content)
      ?.sort((a: any, b: any) => a.stepNumber - b.stepNumber) || [];
  };

  const header = getContent("process_header");
  const steps = getSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width at Top */}
      <div className="w-full">
        <img
          src={heroImage}
          alt="IFS Wealth Management - Our Process"
          className="w-full object-cover"
          style={{ height: "480px" }}
        />
      </div>

      {/* Tagline Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          {header?.subtitle || "A personalized approach to financial planning that adapts to your life's journey"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header Section */}
        {header && (
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-10">
              {header.title}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">{header.introParagraph1}</p>
              <p className="whitespace-pre-wrap">{header.introParagraph2}</p>
            </div>
          </div>
        )}

        {/* Process Steps Section */}
        {steps.length > 0 && (
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
              {header?.stepsTitle || "Our Process"}
            </h2>
            <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {steps.map((step: any, index: number) => (
                <Card key={index} className="border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="bg-primary text-white flex items-center justify-center w-20 min-h-full">
                        <span className="text-3xl font-bold">{step.stepNumber}</span>
                      </div>
                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to start your financial planning journey?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Schedule Your Free Consultation
          </a>
        </div>
      </div>
    </div>
  );
}
