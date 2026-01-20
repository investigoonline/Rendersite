import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import aboutHeroDefault from "@assets/hero-images/about-hero.jpg";

export default function Process() {
  const heroImage = useDynamicImage("process", "hero", aboutHeroDefault);

  const { data: pageContent, isLoading } = useQuery<any[]>({
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

  const getContent = (section: string) => {
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
          A personalized approach to financial planning that adapts to your life's journey
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header Section */}
        {header && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {header.title}
            </h1>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">{header.introParagraph1}</p>
              <p className="whitespace-pre-wrap">{header.introParagraph2}</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-8">
              {header.stepsTitle}
            </h2>
          </div>
        )}

        {/* Process Steps */}
        <div className="space-y-8">
          {steps.map((step: any, index: number) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
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
