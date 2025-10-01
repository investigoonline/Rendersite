import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <Construction className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Under Construction
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            We're working hard to bring you this content. Please check back soon!
          </p>
          <Button asChild size="lg">
            <Link href="/" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
