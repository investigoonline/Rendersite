import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { CheckCircle, Calendar, Phone, FileText } from "lucide-react";
import type { PageContent } from "@shared/schema";
import { HTMLContent } from "@/components/HTMLContent";
import servicesImage from "@assets/Services_1765299577367.png";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";

interface ServiceContent {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  color: string;
}

export default function Services() {
  const heroImage = useDynamicImage("services", "hero", servicesImage);

  // Fetch services content with proper query parameter
  const {
    data: servicesContent,
    isLoading,
    isError,
  } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "services"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=services", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get icon component by name dynamically from all Lucide icons
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return IconComponent;
    }
    console.warn(`Unknown icon name: ${iconName}, falling back to FileText`);
    return FileText;
  };

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return servicesContent?.find((c) => c.section === sectionName);
  };

  // Extract sections
  const pageHeader = getSection("services_header")?.content as any;
  const statsData = getSection("services_stats")?.content as any;
  const processData = getSection("services_process")?.content as any;
  const whyChooseData = getSection("services_why_choose")?.content as any;
  const commitmentData = getSection("services_commitment")?.content as any;
  const ctaData = getSection("services_cta")?.content as any;

  // Extract services (excluding header, stats, and new sections)
  const services: (ServiceContent & { _fontStyles?: any })[] =
    servicesContent
      ?.filter(
        (c) =>
          ![
            "services_header",
            "services_stats",
            "services_process",
            "services_why_choose",
            "services_commitment",
            "services_cta",
          ].includes(c.section),
      )
      .map((content) => content.content as ServiceContent & { _fontStyles?: any })
      .filter((service) => service && service.id && service.title) || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-full max-w-3xl mx-auto"></div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-full">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state (but still render with default content)
  if (isError) {
    console.error("Failed to load services content, using default content");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width at Top */}
      <div className="w-full">
        <img
          src={heroImage}
          alt="IFS Wealth Management professional services team"
          className="hero-banner"
        />
      </div>

      {/* Tagline Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-base sm:text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          A complete life-stage-aware approach to your finances-investment strategy, protection, and legacy planning with 30+ years of proven expertise.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Services Overview Stats */}
        {statsData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16 px-4">
            {statsData.stats.map((stat: any, index: number) => {
              const StatIcon = getIcon(stat.icon);
              const colorClass =
                index % 3 === 0
                  ? "text-primary"
                  : index % 3 === 1
                    ? "text-secondary"
                    : "text-accent";
              return (
                <Card key={index}>
                  <CardContent className="p-3 sm:p-6 text-center">
                    <StatIcon
                      className={`h-6 w-6 sm:h-8 sm:w-8 ${colorClass} mx-auto mb-2`}
                    />
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            return (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow h-full"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 bg-${service.color}/10 rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`h-6 w-6 text-${service.color}`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl" style={getFieldFontStyle(service, 'title')}>{service.title}</CardTitle>
                    </div>
                  </div>
                  <HTMLContent
                    content={service.description}
                    className="text-muted-foreground text-sm"
                    style={getFieldFontStyle(service, 'description')}
                  />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Section */}
        {processData && processData.steps && (
          <Card className="mb-12 sm:mb-16 mx-4" data-testid="section-process">
            <CardHeader className="text-center">
              <CardTitle
                className="text-xl sm:text-2xl"
                data-testid="text-process-title"
              >
                {processData.title}
              </CardTitle>
              <HTMLContent
                content={processData.description}
                className="text-muted-foreground"
                data-testid="text-process-description"
              />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                {processData.steps.map((step: any, index: number) => {
                  const colors = [
                    "bg-primary",
                    "bg-secondary",
                    "bg-accent",
                    "bg-primary",
                  ];
                  return (
                    <div
                      key={index}
                      className="text-center"
                      data-testid={`process-step-${index}`}
                    >
                      <div
                        className={`w-16 h-16 ${colors[index]} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <span className="text-white font-bold text-xl">
                          {index + 1}
                        </span>
                      </div>
                      <h4
                        className="font-semibold text-gray-900 mb-2"
                        data-testid={`text-step-title-${index}`}
                      >
                        {step.title}
                      </h4>
                      <HTMLContent
                        content={step.description}
                        className="text-sm text-muted-foreground"
                        data-testid={`text-step-description-${index}`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Why Choose Our Services */}
        {whyChooseData && whyChooseData.reasons && (
          <div
            className="grid lg:grid-cols-2 gap-12 mb-16"
            data-testid="section-why-choose"
          >
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
                data-testid="text-why-choose-title"
              >
                {whyChooseData.title}
              </h2>
              <div className="space-y-6">
                {whyChooseData.reasons.map((reason: any, index: number) => {
                  const colors = [
                    "bg-primary/10 text-primary",
                    "bg-secondary/10 text-secondary",
                    "bg-accent/10 text-accent",
                  ];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4"
                      data-testid={`reason-${index}`}
                    >
                      <div
                        className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4
                          className="font-semibold text-gray-900 mb-1"
                          data-testid={`text-reason-title-${index}`}
                        >
                          {reason.title}
                        </h4>
                        <HTMLContent
                          content={reason.description}
                          className="text-muted-foreground text-sm"
                          data-testid={`text-reason-description-${index}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {commitmentData && commitmentData.commitments && (
              <Card className="h-fit" data-testid="section-commitment">
                <CardHeader>
                  <CardTitle data-testid="text-commitment-title">
                    {commitmentData.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commitmentData.commitments.map(
                      (commitment: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                          data-testid={`commitment-${index}`}
                        >
                          <span
                            className="text-sm text-muted-foreground"
                            data-testid={`text-commitment-label-${index}`}
                          >
                            {commitment.label}
                          </span>
                          <Badge data-testid={`text-commitment-value-${index}`}>
                            {commitment.value}
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Contact CTA */}
        {ctaData && (
          <Card
            className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5"
            data-testid="section-cta"
          >
            <CardContent className="p-6 sm:p-12 text-center">
              <h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
                data-testid="text-cta-title"
              >
                {ctaData.title}
              </h2>
              <HTMLContent
                content={ctaData.description}
                className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
                data-testid="text-cta-description"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8"
                  onClick={() =>
                    (window.location.href = ctaData.secondaryButtonHref)
                  }
                  data-testid="button-cta-secondary"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {ctaData.secondaryButtonText}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
