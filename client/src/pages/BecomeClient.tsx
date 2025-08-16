import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  Award,
  Clock,
  Globe
} from "lucide-react";

const services = [
  {
    title: "Comprehensive Financial Planning",
    description: "Personalized strategies for wealth building, retirement planning, and goal achievement",
    features: ["Custom financial roadmap", "Risk assessment", "Goal-based planning", "Regular reviews"]
  },
  {
    title: "Investment Management",
    description: "Professional portfolio management with institutional-grade investment strategies",
    features: ["Diversified portfolios", "Tax-efficient investing", "Rebalancing", "Performance reporting"]
  },
  {
    title: "Retirement Planning",
    description: "Comprehensive retirement income strategies and distribution planning",
    features: ["401(k) optimization", "IRA strategies", "Social Security planning", "Legacy planning"]
  },
  {
    title: "Tax Planning",
    description: "Year-round tax optimization strategies to minimize your tax burden",
    features: ["Tax-loss harvesting", "Roth conversions", "Estate tax planning", "Business tax strategies"]
  }
];

const clientBenefits = [
  "Dedicated financial advisor relationship",
  "Unlimited access to all calculators and tools",
  "Quarterly portfolio reviews and updates",
  "Priority customer support",
  "Advanced tax planning strategies",
  "Estate planning coordination",
  "Insurance needs analysis",
  "Educational workshops and seminars"
];

export default function BecomeClient() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Premium Client Services
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Take Your Financial Future to the Next Level
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Partner with our experienced financial advisors to create a comprehensive plan 
            tailored to your unique goals, backed by 40+ years of IFS Group expertise.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">40+ Years Experience</h3>
              <p className="text-muted-foreground">
                Decades of financial expertise from IFS Group's trusted professionals.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-8">
              <ShieldCheck className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fiduciary Standard</h3>
              <p className="text-muted-foreground">
                We're legally bound to act in your best interest at all times.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-8">
              <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-muted-foreground">
                Serving clients across 80+ countries with localized expertise.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial services designed to help you achieve your goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Client Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Client Benefits</h2>
            <p className="text-lg text-muted-foreground mb-8">
              As an IFS Group client, you'll enjoy exclusive access to our full suite of 
              financial planning tools and personalized advisory services.
            </p>
            
            <div className="space-y-3">
              {clientBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Dedicated Advisor</h3>
                    <p className="text-sm text-muted-foreground">Personal relationship with certified financial planner</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Work directly with a dedicated advisor who understands your unique situation and goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-secondary mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
                    <p className="text-sm text-muted-foreground">Institutional-grade portfolio analysis and reporting</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Access sophisticated analytics and insights typically reserved for large institutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-8 w-8 text-accent mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">Priority access to our global support team</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get help when you need it with priority support and emergency assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Getting Started */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Getting Started Is Easy</CardTitle>
            <p className="text-muted-foreground">
              Begin your journey to financial success with a complimentary consultation
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Schedule Consultation</h4>
                <p className="text-sm text-muted-foreground">
                  Book a free 30-minute consultation to discuss your financial goals
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Financial Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Complete a comprehensive review of your current financial situation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Custom Plan</h4>
                <p className="text-sm text-muted-foreground">
                  Receive a personalized financial plan tailored to your goals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule your complimentary consultation today and take the first step 
              toward achieving your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Free Consultation
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <Phone className="h-5 w-5 mr-2" />
                Call +1 (555) 123-4567
              </Button>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 inline mr-1" />
              Or email us at <a href="mailto:support@investigoonline.com" className="text-primary hover:underline">support@investigoonline.com</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}