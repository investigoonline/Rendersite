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
} from "lucide-react";
import type { PageContent } from "@shared/schema";

export default function Home() {
  // Fetch home page content
  const { data: homeContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content?page=home'],
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return homeContent?.find(c => c.section === sectionName);
  };

  // Extract content sections
  const heroContent = getSection('home_hero')?.content as any;
  const statsContent = getSection('home_stats')?.content as any;
  const portfolioContent = getSection('home_portfolio')?.content as any;

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Sparkles,
      Calculator,
      Clock,
      TrendingUp,
    };
    return icons[iconName] || Sparkles;
  };

  const stats = statsContent?.stats || [];
  const Badge1Icon = heroContent?.badge1Icon ? getIcon(heroContent.badge1Icon) : Sparkles;
  const Badge2Icon = heroContent?.badge2Icon ? getIcon(heroContent.badge2Icon) : Calculator;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left side - Hero Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                  <Badge1Icon className="h-4 w-4 mr-2" />
                  {heroContent?.badge1 || "AI-Powered Platform"}
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                  <Badge2Icon className="h-4 w-4 mr-2" />
                  {heroContent?.badge2 || "32+ Calculators"}
                </Badge>
              </div>

              {/* Main Title with Highlight */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">
                  {heroContent?.titlePart1 || "Your Complete"}
                </span>
                <br />
                <span className="text-primary">
                  {heroContent?.titleHighlight || "Financial Intelligence"}
                </span>
                <br />
                <span className="text-gray-900">
                  {heroContent?.titlePart2 || "Platform"}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                {heroContent?.subtitle || "Comprehensive financial planning tools, AI-driven insights, and personalized recommendations. From wealth management to retirement planning - all in one secure platform."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="px-8" data-testid="button-primary-cta">
                  <Link href="/auth/login">
                    {heroContent?.primaryCTA || "Start Free Trial"}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8" data-testid="button-secondary-cta">
                  <Link href="/calculators">
                    {heroContent?.secondaryCTA || "Explore Calculators"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat: any, index: number) => (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Portfolio Overview */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {portfolioContent?.title || "Portfolio Overview"}
                  </CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {portfolioContent?.growthPercent || "+12.4%"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Simple Chart Visualization */}
                <div className="flex items-end justify-around h-32 gap-2">
                  <div className="w-full bg-primary/30 rounded-t" style={{ height: '45%' }}></div>
                  <div className="w-full bg-primary/50 rounded-t" style={{ height: '65%' }}></div>
                  <div className="w-full bg-primary/70 rounded-t" style={{ height: '85%' }}></div>
                  <div className="w-full bg-primary rounded-t" style={{ height: '100%' }}></div>
                </div>

                {/* Financial Metrics */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Net Worth</span>
                    <span className="text-lg font-bold text-gray-900">
                      {portfolioContent?.totalNetWorth || "$1,247,832"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Income</span>
                    <span className="text-lg font-bold text-gray-900">
                      {portfolioContent?.monthlyIncome || "$8,450"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Debt Ratio</span>
                    <span className="text-lg font-bold text-gray-900">
                      {portfolioContent?.debtRatio || "18.2%"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
