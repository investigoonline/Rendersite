import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sparkles,
  Calculator,
  Clock,
  TrendingUp,
  PieChart,
  CreditCard,
  Building,
  Car,
  Shield,
  DollarSign,
} from "lucide-react";
import type { PageContent } from "@shared/schema";

export default function HomeDesignOptions() {
  const [selectedDesign, setSelectedDesign] = useState<number>(1);

  const { data: homeContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content?page=home'],
  });

  const getSection = (sectionName: string) => {
    return homeContent?.find(c => c.section === sectionName);
  };

  const heroContent = getSection('home_hero')?.content as any;
  const statsContent = getSection('home_stats')?.content as any;
  const portfolioContent = getSection('home_portfolio')?.content as any;
  const calculatorCategoriesContent = getSection('home_calculator_categories')?.content as any;

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Sparkles, Calculator, Clock, TrendingUp, PieChart,
      CreditCard, Building, Car, Shield, DollarSign,
    };
    return icons[iconName] || Calculator;
  };

  const stats = statsContent?.stats || [];
  const Badge1Icon = heroContent?.badge1Icon ? getIcon(heroContent.badge1Icon) : Sparkles;
  const Badge2Icon = heroContent?.badge2Icon ? getIcon(heroContent.badge2Icon) : Calculator;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Design Selector */}
      <div className="bg-background border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-3">Select Home Page Design</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={selectedDesign === 1 ? "default" : "outline"}
              onClick={() => setSelectedDesign(1)}
            >
              Option 1: Centered with Badges
            </Button>
            <Button 
              variant={selectedDesign === 2 ? "default" : "outline"}
              onClick={() => setSelectedDesign(2)}
            >
              Option 2: Clean Minimal
            </Button>
            <Button 
              variant={selectedDesign === 3 ? "default" : "outline"}
              onClick={() => setSelectedDesign(3)}
            >
              Option 3: Left-Aligned Professional
            </Button>
            <Button 
              variant={selectedDesign === 4 ? "default" : "outline"}
              onClick={() => setSelectedDesign(4)}
            >
              Option 4: Two-Column Layout
            </Button>
          </div>
        </div>
      </div>

      {/* Design 1: Simple Centered with Badges */}
      {selectedDesign === 1 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                  <Badge1Icon className="h-4 w-4 mr-2" />
                  {heroContent?.badge1 || "AI-Powered Platform"}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                  <Badge2Icon className="h-4 w-4 mr-2" />
                  {heroContent?.badge2 || "32+ Calculators"}
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-center">
                <span className="text-gray-900">{heroContent?.titlePart1 || "Your Complete"} </span>
                <span className="text-primary">{heroContent?.titleHighlight || "Financial Intelligence"} </span>
                <span className="text-gray-900">{heroContent?.titlePart2 || "Platform"}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed text-center">
                {heroContent?.subtitle || "Comprehensive financial planning tools"}
              </p>
            </div>
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}

      {/* Design 2: Clean Minimal (No Badges) */}
      {selectedDesign === 2 && (
        <div className="bg-background py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">{heroContent?.titlePart1 || "Your Complete"} </span>
                <span className="text-primary">{heroContent?.titleHighlight || "Financial Intelligence"} </span>
                <span className="text-gray-900">{heroContent?.titlePart2 || "Platform"}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {heroContent?.subtitle || "Comprehensive financial planning tools"}
              </p>
            </div>
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}

      {/* Design 3: Left-Aligned Professional */}
      {selectedDesign === 3 && (
        <div className="bg-background py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                  <Badge1Icon className="h-4 w-4 mr-2" />
                  {heroContent?.badge1 || "AI-Powered Platform"}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                  <Badge2Icon className="h-4 w-4 mr-2" />
                  {heroContent?.badge2 || "32+ Calculators"}
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">{heroContent?.titlePart1 || "Your Complete"}</span>
                <br />
                <span className="text-primary">{heroContent?.titleHighlight || "Financial Intelligence"}</span>
                <br />
                <span className="text-gray-900">{heroContent?.titlePart2 || "Platform"}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {heroContent?.subtitle || "Comprehensive financial planning tools"}
              </p>
            </div>
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}

      {/* Design 4: Two-Column with Background */}
      {selectedDesign === 4 && (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                    <Badge1Icon className="h-4 w-4 mr-2" />
                    {heroContent?.badge1 || "AI-Powered Platform"}
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700">
                    <Badge2Icon className="h-4 w-4 mr-2" />
                    {heroContent?.badge2 || "32+ Calculators"}
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">{heroContent?.titlePart1 || "Your Complete"}</span>
                  <br />
                  <span className="text-primary">{heroContent?.titleHighlight || "Financial Intelligence"}</span>
                  <br />
                  <span className="text-gray-900">{heroContent?.titlePart2 || "Platform"}</span>
                </h1>
              </div>
              <div>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {heroContent?.subtitle || "Comprehensive financial planning tools"}
                </p>
              </div>
            </div>
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}
    </div>
  );
}

function renderCalculatorCategories(calculatorCategoriesContent: any, getIcon: any) {
  if (!calculatorCategoriesContent?.categories?.length) return null;
  
  return (
    <div className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {calculatorCategoriesContent.title}
        </h2>
        <p className="text-base text-gray-600 max-w-3xl mx-auto">
          {calculatorCategoriesContent.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {calculatorCategoriesContent.categories?.slice(0, 4).map((category: any) => {
          const CategoryIcon = getIcon(category.icon);
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{category.description}</p>
                <ul className="space-y-1">
                  {category.calculators?.slice(0, 3).map((calc: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      {calc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="text-center mt-8">
        <Button size="lg" className="px-8">Access All Calculators</Button>
      </div>
    </div>
  );
}
