import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContactForm from "@/components/contact/ContactForm";
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
import type { PageContent } from "@shared/schema";

interface ContactMethod {
  icon: string;
  title: string;
  content: string[];
  color: string;
}

const defaultContactMethods: ContactMethod[] = [
  {
    icon: "MapPin",
    title: "Office Location",
    content: ["IFS Group Headquarters", "Linköping, Sweden", "Global Financial Services"],
    color: "text-primary",
  },
  {
    icon: "Phone",
    title: "Phone Support",
    content: ["+1 (555) 123-4567", "Mon-Fri: 8AM - 6PM EST", "24/7 Emergency Support"],
    color: "text-secondary",
  },
  {
    icon: "Mail",
    title: "Email Support",
    content: ["support@investigoonline.com", "Response within 24 hours", "Priority client support"],
    color: "text-accent",
  },
];

const supportFeatures = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Round-the-clock support for critical financial decisions.",
  },
  {
    icon: Shield,
    title: "Secure Communication",
    description: "All communications are encrypted and confidential.",
  },
  {
    icon: Globe,
    title: "Global Expertise",
    description: "Local knowledge with international perspective.",
  },
];

export default function Contact() {
  const [activeTab, setActiveTab] = useState("general");

  // Fetch contact content with proper query parameter
  const { data: contactContent, isLoading } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'contact'],
    queryFn: async () => {
      const res = await fetch('/api/content?page=contact', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch contact: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get icon component by name with type safety
  type ContactIcon = 'MapPin' | 'Phone' | 'Mail';
  
  const iconMap: Record<ContactIcon, typeof MapPin> = {
    MapPin,
    Phone,
    Mail,
  };
  
  const getIcon = (iconName: string) => {
    if (iconName in iconMap) {
      return iconMap[iconName as ContactIcon];
    }
    console.warn(`Unknown icon name: ${iconName}, falling back to Mail`);
    return Mail;
  };

  // Extract and transform contact methods from database content
  let contactMethods: ContactMethod[] = defaultContactMethods;
  
  if (contactContent && contactContent.length > 0) {
    try {
      const parsedMethods = contactContent
        .map(content => content.content as ContactMethod)
        .filter(method => method && method.title && method.content);
      
      if (parsedMethods.length > 0) {
        contactMethods = parsedMethods;
      }
    } catch (error) {
      console.error("Error parsing contact content:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to take control of your financial future? Start with a free consultation 
            or reach out to our expert team for personalized assistance.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const IconComponent = getIcon(method.icon);
            return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <IconComponent className={`h-12 w-12 ${method.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{method.title}</h3>
                <div className="space-y-1">
                  {method.content.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className={lineIndex === 0 ? "font-medium text-gray-900" : "text-sm text-muted-foreground"}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Request Callback
                </Button>
              </CardContent>
            </Card>

            {/* Support Features */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Our Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">9:00 AM - 2:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emergency Support</span>
                      <Badge variant="secondary">24/7</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle>Office Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Headquarters</h4>
                      <p className="text-xs text-muted-foreground">
                        Linköping, Sweden<br />
                        Enterprise Software Campus<br />
                        Building A, Floor 12
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">Global Presence</h4>
                      <p className="text-xs text-muted-foreground">
                        80+ countries served<br />
                        7,000+ team members<br />
                        24/7 global support network
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>For Prospective Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Interested in becoming a client? We offer comprehensive financial planning services 
                tailored to your unique needs and goals.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Free initial consultation</li>
                <li>• Personalized financial assessment</li>
                <li>• Custom service recommendations</li>
                <li>• Transparent fee structure</li>
              </ul>
              <Button className="w-full">
                Schedule Free Consultation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Current Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Already a client? Access priority support channels and dedicated account management.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>• Priority phone and email support</li>
                <li>• Dedicated account manager</li>
                <li>• Quarterly review meetings</li>
                <li>• Emergency financial support</li>
              </ul>
              <Button variant="outline" className="w-full">
                Access Client Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
