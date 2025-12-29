import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Building, Award, Globe, CheckCircle, ExternalLink } from "lucide-react";

export default function Custodian() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Trusted Partnership
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Custodian Partners
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your assets are safeguarded by leading institutional custodians with decades of trust and expertise.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-6 w-6 mr-2 text-primary" />
              Institutional Grade Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              IFS Group partners with premier institutional custodians to ensure your assets are protected 
              with the highest levels of security, regulatory compliance, and operational excellence.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Security Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    SIPC insurance protection
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Segregated client accounts
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Bank-level encryption
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    24/7 monitoring systems
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Regulatory Compliance</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    SEC registered
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    FINRA member
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    SOC 2 Type II certified
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Annual third-party audits
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-secondary" />
                Asset Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your investments are held in your name at qualified custodians, completely separate 
                from IFS Group's corporate assets.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Assets held in segregated accounts</li>
                <li>• SIPC insurance up to $500,000</li>
                <li>• Additional excess coverage available</li>
                <li>• Independent monthly statements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-accent" />
                Industry Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our custodian partners are recognized leaders in the financial services industry 
                with proven track records of excellence.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Decades of institutional experience</li>
                <li>• Cutting-edge technology platforms</li>
                <li>• Global reach and capabilities</li>
                <li>• Award-winning customer service</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What This Means for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Peace of Mind</h4>
                <p className="text-sm text-muted-foreground">
                  Your assets are protected by institutional-grade security and insurance
                </p>
              </div>
              <div className="text-center">
                <Building className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  Direct access to account statements and real-time portfolio values
                </p>
              </div>
              <div className="text-center">
                <ShieldCheck className="h-8 w-8 text-accent mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Control</h4>
                <p className="text-sm text-muted-foreground">
                  You retain full ownership and control of your investment accounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Questions About Custody?
            </h3>
            <p className="text-muted-foreground mb-6">
              Learn more about how we protect your assets and ensure the highest standards of security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>
                Contact Our Team
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Disclosures
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}