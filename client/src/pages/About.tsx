import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  Globe,
  Award,
  ChartLine,
  ShieldCheck,
  Target,
  Heart,
} from "lucide-react";

const leadershipTeam = [
  {
    name: "Mark Moffat",
    title: "Chief Executive Officer",
    description: "Leading IFS Group's strategic vision and global expansion initiatives.",
  },
  {
    name: "Michael Ouissi",
    title: "Chief Customer Officer",
    description: "Ensuring exceptional client experiences and driving customer success.",
  },
  {
    name: "Christian Pedersen",
    title: "Chief Product Officer",
    description: "Overseeing product development and innovation strategy.",
  },
  {
    name: "Oliver Pilgerstorfer",
    title: "Chief Marketing Officer",
    description: "Leading global marketing and brand strategy initiatives.",
  },
  {
    name: "Helena Nimmo",
    title: "Chief Information Officer",
    description: "Driving digital transformation and technology strategy.",
  },
  {
    name: "Debra McCowan",
    title: "Chief Human Resources Officer",
    description: "Leading talent acquisition and organizational development.",
  },
];

const companyValues = [
  {
    icon: Target,
    title: "Innovation Excellence",
    description: "Continuously advancing financial technology to serve our clients better.",
  },
  {
    icon: Heart,
    title: "Client-Centric Focus",
    description: "Every decision we make prioritizes our clients' financial success.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    description: "Maintaining the highest standards of security and regulatory compliance.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Serving clients across 80+ countries with localized expertise.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            IFS Group
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Trusted Financial Intelligence Since 1983
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built on the foundation of IFS Group's 40+ years of financial expertise, 
            Investigoonline brings professional-grade financial planning tools to everyone.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-2">40+</div>
              <div className="text-sm text-muted-foreground">Years of Excellence</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-secondary mb-2">7,000+</div>
              <div className="text-sm text-muted-foreground">Team Members Globally</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-accent mb-2">80+</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-2">$10B</div>
              <div className="text-sm text-muted-foreground">Company Valuation</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Company Story */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 1983 in Linköping, Sweden, IFS Group began as Industrial and Financial Systems 
                with a vision to revolutionize enterprise software solutions. Over four decades, we've evolved 
                into a global leader in financial technology and business intelligence.
              </p>
              <p>
                Our journey from a small Swedish startup to a $10 billion enterprise reflects our commitment 
                to innovation, client success, and technological excellence. Today, with over 7,000 team members 
                across 80+ countries, we continue to shape the future of financial services.
              </p>
              <p>
                Investigoonline represents the next evolution of our mission - democratizing access to 
                professional-grade financial planning tools while maintaining the enterprise-level security 
                and reliability our clients have trusted for decades.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Mission & Vision</h2>
            <div className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Target className="h-5 w-5 text-primary mr-2" />
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground">
                    To empower individuals and businesses with intelligent financial tools and insights 
                    that drive informed decision-making and long-term prosperity.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <ChartLine className="h-5 w-5 text-secondary mr-2" />
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground">
                    To be the world's most trusted platform for financial intelligence, making 
                    professional-grade financial planning accessible to everyone, everywhere.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((leader, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-sm text-primary text-center mb-3">{leader.title}</p>
                  <p className="text-sm text-muted-foreground text-center">
                    {leader.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Global Presence */}
        <Card className="mb-16">
          <CardContent className="p-12 text-center">
            <Globe className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Global Headquarters</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Linköping, Sweden • Serving clients worldwide
            </p>
            <div className="max-w-2xl mx-auto text-muted-foreground">
              <p>
                From our headquarters in Linköping, Sweden, we coordinate operations across six continents, 
                ensuring 24/7 support and localized expertise for our global client base. Our distributed 
                team model enables us to provide round-the-clock service while maintaining the high standards 
                of quality and security our clients expect.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Technology & Innovation */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardContent className="p-8">
              <ChartLine className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation at Our Core</h3>
              <p className="text-muted-foreground mb-4">
                Our commitment to innovation drives everything we do. From our early days pioneering 
                enterprise software to today's AI-powered financial intelligence platform, we continue 
                to push the boundaries of what's possible in financial technology.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Advanced AI and machine learning algorithms</li>
                <li>• Real-time data processing and analytics</li>
                <li>• Cloud-native architecture for scalability</li>
                <li>• Continuous integration and deployment</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <ShieldCheck className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Compliance</h3>
              <p className="text-muted-foreground mb-4">
                Trust is the foundation of financial services. We maintain the highest standards of 
                security and regulatory compliance, ensuring your financial data is always protected 
                and your privacy is respected.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• SOC 2 Type II certified infrastructure</li>
                <li>• GDPR and CCPA compliant data practices</li>
                <li>• End-to-end encryption for all data</li>
                <li>• Regular security audits and penetration testing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience the Future of Financial Planning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of individuals and businesses who trust IFS Group for their financial intelligence needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = "/calculators"}>
                Explore Our Platform
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/contact"}>
                Contact Our Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
