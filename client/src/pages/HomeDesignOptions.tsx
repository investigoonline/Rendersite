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
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-3">Select Home Page Design</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant={selectedDesign === 1 ? "default" : "outline"}
              onClick={() => setSelectedDesign(1)}
            >
              Option 1: Current Two-Column
            </Button>
            <Button 
              variant={selectedDesign === 2 ? "default" : "outline"}
              onClick={() => setSelectedDesign(2)}
            >
              Option 2: Centered Full-Width
            </Button>
            <Button 
              variant={selectedDesign === 3 ? "default" : "outline"}
              onClick={() => setSelectedDesign(3)}
            >
              Option 3: Card-Based Modular
            </Button>
            <Button 
              variant={selectedDesign === 4 ? "default" : "outline"}
              onClick={() => setSelectedDesign(4)}
            >
              Option 4: Bold Split-Screen
            </Button>
          </div>
        </div>
      </div>

      {/* Design 1: Current Two-Column Layout */}
      {selectedDesign === 1 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 gap-6 lg:gap-8 items-start ${portfolioContent ? 'lg:grid-cols-5' : ''}`}>
              <div className={portfolioContent ? 'lg:col-span-3 space-y-6' : 'space-y-6'}>
                <div className="space-y-5">
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
                  <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                    {heroContent?.subtitle || "Comprehensive financial planning tools"}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="px-8">{heroContent?.primaryCTA || "Start Free Trial"}</Button>
                    <Button size="lg" variant="outline" className="px-8">{heroContent?.secondaryCTA || "Explore Calculators"}</Button>
                  </div>
                </div>
                {stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    {stats.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {portfolioContent && (
                <div className="lg:col-span-2">
                  <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{portfolioContent.title || "Portfolio Overview"}</CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />{portfolioContent.growthPercent || "+12.4%"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-end justify-around h-32 gap-2">
                        <div className="w-full bg-primary/30 rounded-t" style={{ height: '45%' }}></div>
                        <div className="w-full bg-primary/50 rounded-t" style={{ height: '65%' }}></div>
                        <div className="w-full bg-primary/70 rounded-t" style={{ height: '85%' }}></div>
                        <div className="w-full bg-primary rounded-t" style={{ height: '100%' }}></div>
                      </div>
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Net Worth</span>
                          <span className="text-lg font-bold text-gray-900">{portfolioContent.totalNetWorth || "$1,247,832"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Monthly Income</span>
                          <span className="text-lg font-bold text-gray-900">{portfolioContent.monthlyIncome || "$8,450"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Debt Ratio</span>
                          <span className="text-lg font-bold text-gray-900">{portfolioContent.debtRatio || "18.2%"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}

      {/* Design 2: Centered Full-Width */}
      {selectedDesign === 2 && (
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-6">
              <div className="flex justify-center gap-3">
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
                <span className="text-gray-900">{heroContent?.titlePart1 || "Your Complete"} </span>
                <span className="text-primary">{heroContent?.titleHighlight || "Financial Intelligence"} </span>
                <span className="text-gray-900">{heroContent?.titlePart2 || "Platform"}</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {heroContent?.subtitle || "Comprehensive financial planning tools"}
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="px-8">{heroContent?.primaryCTA || "Start Free Trial"}</Button>
                <Button size="lg" variant="outline" className="px-8">{heroContent?.secondaryCTA || "Explore Calculators"}</Button>
              </div>
              {stats.length > 0 && (
                <div className="flex justify-center gap-12 pt-8">
                  {stats.map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {portfolioContent && (
              <Card className="shadow-xl max-w-4xl mx-auto">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{portfolioContent.title || "Portfolio Overview"}</CardTitle>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />{portfolioContent.growthPercent || "+12.4%"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-around h-40 gap-3 mb-6">
                    <div className="w-full bg-primary/30 rounded-t" style={{ height: '45%' }}></div>
                    <div className="w-full bg-primary/50 rounded-t" style={{ height: '65%' }}></div>
                    <div className="w-full bg-primary/70 rounded-t" style={{ height: '85%' }}></div>
                    <div className="w-full bg-primary rounded-t" style={{ height: '100%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t">
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Total Net Worth</span>
                      <span className="text-xl font-bold text-gray-900">{portfolioContent.totalNetWorth || "$1,247,832"}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Monthly Income</span>
                      <span className="text-xl font-bold text-gray-900">{portfolioContent.monthlyIncome || "$8,450"}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Debt Ratio</span>
                      <span className="text-xl font-bold text-gray-900">{portfolioContent.debtRatio || "18.2%"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}

      {/* Design 3: Card-Based Modular */}
      {selectedDesign === 3 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Card className="shadow-xl bg-white">
              <CardContent className="p-8 lg:p-12">
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
                  <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                    {heroContent?.subtitle || "Comprehensive financial planning tools"}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="px-8">{heroContent?.primaryCTA || "Start Free Trial"}</Button>
                    <Button size="lg" variant="outline" className="px-8">{heroContent?.secondaryCTA || "Explore Calculators"}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {stats.length > 0 && (
              <Card className="shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {stats.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {portfolioContent && (
              <Card className="shadow-xl bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{portfolioContent.title || "Portfolio Overview"}</CardTitle>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />{portfolioContent.growthPercent || "+12.4%"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end justify-around h-32 gap-2">
                    <div className="w-full bg-primary/30 rounded-t" style={{ height: '45%' }}></div>
                    <div className="w-full bg-primary/50 rounded-t" style={{ height: '65%' }}></div>
                    <div className="w-full bg-primary/70 rounded-t" style={{ height: '85%' }}></div>
                    <div className="w-full bg-primary rounded-t" style={{ height: '100%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Total Net Worth</span>
                      <span className="text-lg font-bold text-gray-900">{portfolioContent.totalNetWorth || "$1,247,832"}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Monthly Income</span>
                      <span className="text-lg font-bold text-gray-900">{portfolioContent.monthlyIncome || "$8,450"}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-600 block mb-1">Debt Ratio</span>
                      <span className="text-lg font-bold text-gray-900">{portfolioContent.debtRatio || "18.2%"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {renderCalculatorCategories(calculatorCategoriesContent, getIcon)}
          </div>
        </div>
      )}

      {/* Design 4: Bold Split-Screen */}
      {selectedDesign === 4 && (
        <div className="min-h-screen">
          <div className="grid lg:grid-cols-2 min-h-screen">
            <div className="bg-gradient-to-br from-primary to-blue-800 text-white p-8 lg:p-16 flex items-center">
              <div className="space-y-6 max-w-xl">
                <div className="flex flex-wrap gap-3">
                  <Badge className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
                    <Badge1Icon className="h-4 w-4 mr-2" />
                    {heroContent?.badge1 || "AI-Powered Platform"}
                  </Badge>
                  <Badge className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
                    <Badge2Icon className="h-4 w-4 mr-2" />
                    {heroContent?.badge2 || "32+ Calculators"}
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  {heroContent?.titlePart1 || "Your Complete"}<br />
                  {heroContent?.titleHighlight || "Financial Intelligence"}<br />
                  {heroContent?.titlePart2 || "Platform"}
                </h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  {heroContent?.subtitle || "Comprehensive financial planning tools"}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="px-8 bg-white text-primary hover:bg-white/90">{heroContent?.primaryCTA || "Start Free Trial"}</Button>
                  <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white/10">{heroContent?.secondaryCTA || "Explore Calculators"}</Button>
                </div>
                {stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    {stats.map((stat: any, index: number) => (
                      <div key={index}>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-8 lg:p-16 flex items-center">
              <div className="space-y-6 w-full max-w-xl mx-auto">
                {portfolioContent && (
                  <Card className="shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{portfolioContent.title || "Portfolio Overview"}</CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />{portfolioContent.growthPercent || "+12.4%"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-end justify-around h-32 gap-2">
                        <div className="w-full bg-primary/30 rounded-t" style={{ height: '45%' }}></div>
                        <div className="w-full bg-primary/50 rounded-t" style={{ height: '65%' }}></div>
                        <div className="w-full bg-primary/70 rounded-t" style={{ height: '85%' }}></div>
                        <div className="w-full bg-primary rounded-t" style={{ height: '100%' }}></div>
                      </div>
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Net Worth</span>
                          <span className="text-lg font-bold">{portfolioContent.totalNetWorth || "$1,247,832"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Monthly Income</span>
                          <span className="text-lg font-bold">{portfolioContent.monthlyIncome || "$8,450"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Debt Ratio</span>
                          <span className="text-lg font-bold">{portfolioContent.debtRatio || "18.2%"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {calculatorCategoriesContent?.categories?.slice(0, 2).map((category: any) => {
                  const CategoryIcon = getIcon(category.icon);
                  return (
                    <Card key={category.id} className="shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <CategoryIcon className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-bold text-lg">{category.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
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
