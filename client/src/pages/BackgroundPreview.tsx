import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

export default function BackgroundPreview() {
  const options = [
    {
      name: "Option 1: Soft Cream",
      color: "hsl(40, 33%, 98%)",
      hex: "#FDFBF7",
      description: "Warm, elegant - great for financial sites",
      route: "/preview-option-1"
    },
    {
      name: "Option 2: Light Gray",
      color: "hsl(210, 17%, 97%)",
      hex: "#F8F9FA",
      description: "Clean, modern - makes content pop",
      route: "/preview-option-2"
    },
    {
      name: "Option 3: Light Blue-Gray",
      color: "hsl(210, 40%, 96%)",
      hex: "#F0F4F8",
      description: "Professional trust - financial industry favorite",
      route: "/preview-option-3"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Background Color Options - Side by Side Preview
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Click "View Full Site" to see how each option looks on the actual pages
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <div key={index} className="flex flex-col">
              <h2 className="text-white font-semibold mb-3 text-center">{option.name}</h2>
              
              <div 
                className="rounded-lg overflow-hidden shadow-xl flex-1"
                style={{ backgroundColor: option.color }}
              >
                <div className="p-6">
                  <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded"></div>
                      <div>
                        <div className="font-semibold text-gray-900">IFS Wealth Management</div>
                        <div className="text-sm text-gray-500">Financial Planning</div>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Sample Content Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This shows how your content cards will look against this background color.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                    <div className="font-semibold">Primary Button Sample</div>
                    <div className="text-sm opacity-90">CTA elements will stand out</div>
                  </div>
                  
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop"
                    alt="Sample"
                    className="w-full h-32 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
              
              <p className="text-gray-300 text-sm text-center mt-3 mb-2">{option.description}</p>
              <p className="text-gray-400 text-xs text-center mb-3">Color: {option.hex}</p>
              
              <Link href={option.route}>
                <Button className="w-full" data-testid={`button-view-option-${index + 1}`}>
                  <Check className="w-4 h-4 mr-2" />
                  View Full Site with {option.name.split(":")[0]}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="bg-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
