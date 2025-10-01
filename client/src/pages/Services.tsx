import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Shield, 
  PiggyBank, 
  FileText, 
  Users, 
  Database,
  CheckCircle,
  ArrowRight,
  Calendar,
  Phone
} from "lucide-react";
import type { PageContent } from "@shared/schema";

interface ServiceContent {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  color: string;
}

const defaultServices: ServiceContent[] = [
  {
    id: "investment_management",
    title: "Investment Management",
    icon: "TrendingUp",
    description: "Professional portfolio management with institutional-grade strategies and ongoing oversight.",
    features: [
      "Diversification & asset allocation",
      "Tax-efficient investing",
      "Quarterly performance reports",
      "Monthly statements & yearly reviews",
      "Online account access"
    ],
    color: "primary"
  },
  {
    id: "strategic_planning",
    title: "Strategic Financial Planning",
    icon: "FileText",
    description: "Comprehensive financial strategies tailored to your life goals and circumstances.",
    features: [
      "Retirement planning strategies",
      "Pension optimization",
      "Stock options planning",
      "Education funding strategies",
      "Goal-based financial planning"
    ],
    color: "secondary"
  },
  {
    id: "legacy_planning",
    title: "Legacy Planning",
    icon: "Users",
    description: "Preserve and transfer your wealth according to your values and family goals.",
    features: [
      "Estate planning documents review",
      "Beneficiary review and updates",
      "Philanthropic planning",
      "Charitable trust strategies",
      "Private foundations",
      "Trust management services",
      "Business succession/exit planning"
    ],
    color: "accent"
  },
  {
    id: "risk_management",
    title: "Risk Management",
    icon: "Shield",
    description: "Protect your assets and family with comprehensive insurance and risk analysis.",
    features: [
      "Asset protection strategies",
      "Life insurance analysis & review",
      "Disability insurance analysis & review",
      "Personal liability insurance review",
      "Long-Term Care insurance planning"
    ],
    color: "primary"
  },
  {
    id: "special_situations",
    title: "Special Situations Planning",
    icon: "PiggyBank",
    description: "Specialized financial guidance for unique life circumstances and transitions.",
    features: [
      "Divorce financial planning and income replacement",
      "Foundation and endowment guidance",
      "Financial windfall planning",
      "Structured settlements",
      "Special Needs Trusts - asset management"
    ],
    color: "secondary"
  },
  {
    id: "account_aggregation",
    title: "Account Aggregation",
    icon: "Database",
    description: "Centralized view and management of all your financial accounts and documents.",
    features: [
      "View all bank and brokerage accounts in one secure place",
      "Balance sheet/Net worth statements",
      "Financial goals/plans tracking",
      "Asset allocation strategy oversight",
      "Tax documents, trusts, wills and other private records",
      "Insurance policies and coverages management"
    ],
    color: "accent"
  }
];

export default function Services() {
  // Fetch services content with proper query parameter
  const { data: servicesContent, isLoading, isError } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'services'],
    queryFn: async () => {
      const res = await fetch('/api/content?page=services', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get icon component by name with type safety
  type ServiceIcon = 'TrendingUp' | 'Shield' | 'PiggyBank' | 'FileText' | 'Users' | 'Database';
  
  const iconMap: Record<ServiceIcon, typeof TrendingUp> = {
    TrendingUp,
    Shield,
    PiggyBank,
    FileText,
    Users,
    Database,
  };
  
  const getIcon = (iconName: string) => {
    if (iconName in iconMap) {
      return iconMap[iconName as ServiceIcon];
    }
    console.warn(`Unknown icon name: ${iconName}, falling back to FileText`);
    return FileText;
  };

  // Extract and transform services from database content with validation
  let services: ServiceContent[] = defaultServices;
  
  if (servicesContent && servicesContent.length > 0) {
    try {
      const parsedServices = servicesContent
        .map(content => content.content as ServiceContent)
        .filter(service => service && service.id && service.title);
      
      if (parsedServices.length > 0) {
        services = parsedServices;
      }
    } catch (error) {
      console.error("Error parsing services content:", error);
    }
  }

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
            {[1, 2, 3, 4, 5, 6].map(i => (
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 sm:mb-6">
            Professional Services
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Comprehensive Financial Services
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our full-service approach addresses every aspect of your financial life, 
            from investment management to legacy planning, with 40+ years of expertise.
          </p>
        </div>

        {/* Services Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16 px-4">
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">6</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Service Areas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">40+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Years Experience</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Fiduciary Standard</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-6 text-center">
              <Database className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Account Access</div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-4">
          {services.map((service, index) => {
            const IconComponent = getIcon(service.icon);
            return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-${service.color}/10 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 text-${service.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-6 group">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Process Section */}
        <Card className="mb-12 sm:mb-16 mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">Our Service Process</CardTitle>
            <p className="text-muted-foreground">
              A systematic approach to delivering comprehensive financial guidance
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Discovery</h4>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of your current financial situation and goals
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Custom financial plan development tailored to your unique circumstances
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Implementation</h4>
                <p className="text-sm text-muted-foreground">
                  Execution of your financial plan with ongoing coordination
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Regular reviews and adjustments to keep you on track
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Our Services */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Services</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fiduciary Standard</h4>
                  <p className="text-muted-foreground text-sm">
                    We're legally bound to act in your best interest at all times, ensuring unbiased advice.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Comprehensive Approach</h4>
                  <p className="text-muted-foreground text-sm">
                    All aspects of your financial life coordinated under one roof for seamless planning.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Institutional Expertise</h4>
                  <p className="text-muted-foreground text-sm">
                    Access to institutional-grade investment strategies and professional resources.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ongoing Support</h4>
                  <p className="text-muted-foreground text-sm">
                    Regular monitoring, reviews, and adjustments to keep your plan current.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Service Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client Review Frequency</span>
                  <Badge>Quarterly</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <Badge>24 Hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Access</span>
                  <Badge>24/7 Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Performance Reports</span>
                  <Badge>Monthly</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Planning Updates</span>
                  <Badge>As Needed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Our Services?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a consultation to learn how our comprehensive approach can help 
              you achieve your financial goals with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Phone className="h-5 w-5 mr-2" />
                Call +1 (555) 123-4567
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}