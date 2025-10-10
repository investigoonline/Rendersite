import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Construction, Home, Mail } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Construction className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Page Under Construction</CardTitle>
          <CardDescription className="text-lg">
            We're working hard to bring you this feature. This page will be available soon!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 space-y-2">
            <h3 className="font-semibold text-gray-900">What's Coming:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Enhanced features and functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Improved user experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Additional tools and resources</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" data-testid="button-back-home">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" data-testid="button-contact-us">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Have questions? Reach out to our team at{" "}
            <a href="mailto:support@investigoonline.com" className="text-primary hover:underline">
              support@investigoonline.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
