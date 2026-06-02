import { Link } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContactForm from "@/components/contact/ContactForm";
import { HTMLContent } from "@/components/HTMLContent";
import { Mail, Clock } from "lucide-react";
import * as Icons from "lucide-react";
import type { PageContent } from "@shared/schema";
import contactImage from "@assets/Contact_Us_1765299919540.png";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";

export default function Contact() {
  usePageTitle("Contact Us");
  const heroImage = useDynamicImage("contact", "hero", contactImage);

  // Fetch contact content with proper query parameter
  const { data: contactContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "contact"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=contact", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch contact: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return IconComponent;
    }
    console.warn(`Unknown icon name: ${iconName}, falling back to Mail`);
    return Mail;
  };

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return contactContent?.find((c) => c.section === sectionName);
  };

  // Extract sections
  const contactMethods =
    contactContent?.filter((c) =>
      ["contact_office", "contact_phone", "contact_email"].includes(c.section),
    ) || [];

  const pageHeader = getSection("contact_header")?.content as any;
  const formHeader = getSection("contact_form_header")?.content as any;
  const businessHours = getSection("contact_business_hours")?.content as any;
  const prospectiveClients = getSection("contact_prospective_clients")
    ?.content as any;
  const currentClients = getSection("contact_current_clients")?.content as any;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width at Top */}
      <div className="hero-banner">
        <img
          src={heroImage}
          alt="IFS Wealth Management - Contact Us"
        />
      </div>

      {/* Tagline Below Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pageHeader?.description ? (
          <div
            className="text-base sm:text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            style={getFieldFontStyle(pageHeader, 'description')}
          >
            <HTMLContent content={pageHeader.description} />
          </div>
        ) : (
          <p className="text-base sm:text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Ready to take control? Begin with a free consultation or connect with our expert team for personalized guidance
          </p>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Contact Method Tiles — 4 columns including Business Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const data = method.content as any;
            const IconComponent = getIcon(data.icon);
            const isPhone = method.section === "contact_phone";
            const lines: string[] = isPhone
              ? (data.content || []).slice(0, 2)
              : data.content || [];
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
                data-testid={`card-contact-method-${index}`}
              >
                <CardContent className="p-6">
                  <IconComponent
                    className={`h-12 w-12 ${data.color} mx-auto mb-4`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {data.title}
                  </h3>
                  <div className="space-y-1">
                    {lines.map((line: string, lineIndex: number) => (
                      <p
                        key={lineIndex}
                        className={
                          lineIndex === 0
                            ? "font-medium text-gray-900"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {lineIndex === 0 && data.href ? (
                          <a href={data.href} className="hover:underline">
                            {line}
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Business Hours tile */}
          {businessHours && (
            <Card
              className="text-center hover:shadow-lg transition-shadow"
              data-testid="card-business-hours"
            >
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3
                  className="text-lg font-semibold text-gray-900 mb-4"
                  data-testid="text-business-hours-title"
                  style={getFieldFontStyle(businessHours, 'title')}
                >
                  {businessHours.title || "Business Hours"}
                </h3>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Mon – Fri</span>
                    <span
                      className="font-medium text-right"
                      data-testid="text-hours-weekday"
                    >
                      {businessHours.monday_friday}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Saturday</span>
                    <span
                      className="font-medium text-right"
                      data-testid="text-hours-saturday"
                    >
                      {businessHours.saturday}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Sunday</span>
                    <span
                      className="font-medium text-right"
                      data-testid="text-hours-sunday"
                    >
                      {businessHours.sunday}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Form — full width */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl" data-testid="text-form-title" style={getFieldFontStyle(formHeader, 'title')}>
              {formHeader?.title || "Send us a Message"}
            </CardTitle>
            <p
              className="text-muted-foreground"
              data-testid="text-form-description"
              style={getFieldFontStyle(formHeader, 'description')}
            >
              {formHeader?.description ||
                "Fill out the form below and we'll get back to you within 24 hours."}
            </p>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Prospective Clients */}
          {prospectiveClients && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-prospective-title" style={getFieldFontStyle(prospectiveClients, 'title')}>
                  {prospectiveClients.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HTMLContent
                  content={prospectiveClients.description}
                  className="text-muted-foreground mb-4"
                  data-testid="text-prospective-description"
                  style={getFieldFontStyle(prospectiveClients, 'description')}
                />
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  {prospectiveClients.benefits?.map(
                    (benefit: string, index: number) => (
                      <li
                        key={index}
                        data-testid={`text-prospective-benefit-${index}`}
                      >
                        • {benefit}
                      </li>
                    ),
                  )}
                </ul>
                {prospectiveClients.buttonHref ? (
                  <Link href={prospectiveClients.buttonHref}>
                    <Button
                      className="w-full"
                      data-testid="button-prospective-action"
                    >
                      {prospectiveClients.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    data-testid="button-prospective-action"
                  >
                    {prospectiveClients.buttonText}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Current Clients */}
          {currentClients && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-current-title" style={getFieldFontStyle(currentClients, 'title')}>
                  {currentClients.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HTMLContent
                  content={currentClients.description}
                  className="text-muted-foreground mb-4"
                  data-testid="text-current-description"
                  style={getFieldFontStyle(currentClients, 'description')}
                />
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  {currentClients.benefits?.map(
                    (benefit: string, index: number) => (
                      <li
                        key={index}
                        data-testid={`text-current-benefit-${index}`}
                      >
                        • {benefit}
                      </li>
                    ),
                  )}
                </ul>
                {currentClients.buttonHref ? (
                  <Link href={currentClients.buttonHref}>
                    <Button
                      variant="outline"
                      className="w-full"
                      data-testid="button-current-action"
                    >
                      {currentClients.buttonText}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid="button-current-action"
                  >
                    {currentClients.buttonText}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
