import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContactForm from "@/components/contact/ContactForm";
import { HTMLContent } from "@/components/HTMLContent";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  MessageCircle,
  Building,
  Globe,
  Shield,
} from "lucide-react";
import * as Icons from "lucide-react";
import type { PageContent } from "@shared/schema";
import contactImage from "@assets/Contact_Us_1765299919540.png";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";

export default function Contact() {
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
  const quickActions = getSection("contact_quick_actions")?.content as any;
  const supportFeatures = getSection("contact_support_features")
    ?.content as any;
  const businessHours = getSection("contact_business_hours")?.content as any;
  const officeInfo = getSection("contact_office_info")?.content as any;
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
        <p className="text-base sm:text-xl lg:text-2xl text-center text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Ready to take control? Begin with a free consultation or connect with our expert team for personalized guidance
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Contact Methods */}
        {contactMethods.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, index) => {
              const data = method.content as any;
              const IconComponent = getIcon(data.icon);
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
                      {data.content?.map((line: string, lineIndex: number) => (
                        <p
                          key={lineIndex}
                          className={
                            lineIndex === 0
                              ? "font-medium text-gray-900"
                              : "text-sm text-muted-foreground"
                          }
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {quickActions && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-quick-actions-title">
                    {quickActions.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.actions?.map((action: any, index: number) => {
                    const IconComponent = getIcon(action.icon);
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg border hover:shadow-sm transition-shadow"
                        data-testid={`card-quick-action-${index}`}
                      >
                        <IconComponent className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {action.label}
                          </h4>
                          {action.info && (
                            <p className="text-sm text-muted-foreground break-words">
                              {action.info}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Support Features */}
            {supportFeatures && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-support-features-title">
                    {supportFeatures.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {supportFeatures.features?.map(
                      (feature: any, index: number) => {
                        const IconComponent = getIcon(feature.icon);
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                            data-testid={`card-support-feature-${index}`}
                          >
                            <IconComponent className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">
                                {feature.title}
                              </h4>
                              <HTMLContent
                                content={feature.description}
                                className="text-xs text-muted-foreground"
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Hours */}
            {businessHours && (
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-business-hours-title">
                    {businessHours.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Monday - Friday
                      </span>
                      <span
                        className="font-medium"
                        data-testid="text-hours-weekday"
                      >
                        {businessHours.monday_friday}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span
                        className="font-medium"
                        data-testid="text-hours-saturday"
                      >
                        {businessHours.saturday}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span
                        className="font-medium"
                        data-testid="text-hours-sunday"
                      >
                        {businessHours.sunday}
                      </span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Emergency Support
                        </span>
                        <Badge
                          variant="secondary"
                          data-testid="text-hours-emergency"
                        >
                          {businessHours.emergency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Office Information */}

            <Card></Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Prospective Clients */}
          {prospectiveClients && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-prospective-title">
                  {prospectiveClients.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HTMLContent
                  content={prospectiveClients.description}
                  className="text-muted-foreground mb-4"
                  data-testid="text-prospective-description"
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
                <Button
                  className="w-full"
                  data-testid="button-prospective-action"
                >
                  {prospectiveClients.buttonText}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Current Clients */}
          {currentClients && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-current-title">
                  {currentClients.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HTMLContent
                  content={currentClients.description}
                  className="text-muted-foreground mb-4"
                  data-testid="text-current-description"
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
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid="button-current-action"
                >
                  {currentClients.buttonText}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
