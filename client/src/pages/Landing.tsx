import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GuestSignupForm from "@/components/guest/GuestSignupForm";
import CalculatorCard from "@/components/calculators/CalculatorCard";
import NetWorthCalculator from "@/components/calculators/NetWorthCalculator";
import GuestAccessModal from "@/components/modals/GuestAccessModal";
import { HTMLContent } from "@/components/HTMLContent";
import {
  PieChart,
  CreditCard,
  Home,
  Car,
  Scale,
  PiggyBank,
  FileText,
  TrendingUp,
  ChartLine,
  Building,
  ShieldCheck,
  Bot,
} from "lucide-react";

const calculatorCategories = [
  {
    title: "Wealth Management",
    description:
      "Net worth tracking, debt ratio analysis, and wealth building strategies.",
    icon: PieChart,
    calculators: ["Total Net Worth Calculator", "Income to Debt Ratio"],
  },
  {
    title: "Loans & Credit Cards",
    description:
      "Payoff strategies, payment schedules, and debt optimization tools.",
    icon: CreditCard,
    calculators: ["Loan Payoff Calculator", "Credit Card Debt Analysis"],
  },
  {
    title: "Real Estate & Housing",
    description:
      "Home affordability, mortgage refinancing, and acceleration strategies.",
    icon: Home,
    calculators: ["Home Affordability Calculator", "Mortgage Refinancing"],
  },
  {
    title: "Vehicle Financing",
    description:
      "Lease vs buy analysis, payment calculations, and affordability assessment.",
    icon: Car,
    calculators: ["Lease Payment Calculator", "Car Affordability Analysis"],
  },
  {
    title: "Retirement & Inflation",
    description:
      "Retirement cost planning, RMD calculations, and inflation impact analysis.",
    icon: PiggyBank,
    calculators: ["Cost of Retirement Calculator", "RMD Calculator"],
  },
  {
    title: "Estate Planning",
    description:
      "Estate tax calculations and planning recommendations for asset transfer.",
    icon: Scale,
    calculators: ["Estate Tax Calculator", "Tax Planning Tools"],
  },
  {
    title: "Taxes & IRAs",
    description:
      "Income tax calculations, IRA eligibility, and Roth conversion analysis.",
    icon: FileText,
    calculators: [
      "Federal Income Tax Calculator",
      "IRA Eligibility Calculator",
    ],
  },
  {
    title: "Credit & Debt Management",
    description:
      "Credit optimization strategies and debt management planning tools.",
    icon: TrendingUp,
    calculators: [
      "Credit Score Impact Analysis",
      "Debt Consolidation Calculator",
    ],
  },
];

export default function Landing() {
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-secondary"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Bot className="mr-1 h-3 w-3" />
                  AI-Powered Platform
                </Badge>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  32+ Calculators
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your Complete
                <span className="text-primary block">
                  Financial Intelligence
                </span>
                Platform
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
                Comprehensive financial planning tools, AI-driven insights, and
                personalized recommendations. From wealth management to
                retirement planning - all in one secure platform.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Button
                  size="lg"
                  onClick={() => setGuestModalOpen(true)}
                  className="text-lg px-8 py-4"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                  onClick={() =>
                    document
                      .getElementById("calculators")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Calculators
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    32+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Financial Calculators
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-1">
                    AI
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Powered Insights
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Platform Access
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <Card className="glassmorphism shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Portfolio Overview
                    </h3>
                    <Badge className="bg-secondary/10 text-secondary">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +12.4%
                    </Badge>
                  </div>

                  {/* Mock chart area */}
                  <div className="h-32 gradient-secondary rounded-lg mb-6 flex items-end justify-center p-4">
                    <div className="flex items-end space-x-2 h-full">
                      <div className="bg-primary w-3 h-16 rounded-t"></div>
                      <div className="bg-primary/70 w-3 h-12 rounded-t"></div>
                      <div className="bg-primary w-3 h-20 rounded-t"></div>
                      <div className="bg-secondary w-3 h-24 rounded-t"></div>
                      <div className="bg-secondary/70 w-3 h-18 rounded-t"></div>
                      <div className="bg-secondary w-3 h-28 rounded-t"></div>
                    </div>
                  </div>

                  {/* Mock data rows */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Net Worth
                      </span>
                      <span className="font-mono font-semibold text-gray-900">
                        $1,247,832
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Monthly Income
                      </span>
                      <span className="font-mono font-semibold text-gray-900">
                        $8,450
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Debt Ratio
                      </span>
                      <span className="font-mono font-semibold text-secondary">
                        18.2%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Categories Section */}
      <section id="calculators" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Financial Calculator Suite
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              32+ professional-grade calculators across 8 categories. From basic
              budgeting to complex estate planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {calculatorCategories.map((category) => (
              <CalculatorCard key={category.title} {...category} />
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setGuestModalOpen(true)}
              className="px-8 py-4 text-lg"
            >
              Access All Calculators
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Free 30-day guest access • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Guest Account System Feature */}
      <section className="py-20 gradient-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Guest Account Flow Visualization */}
            <div className="relative">
              <Card className="shadow-xl border border-gray-200">
                <CardContent className="p-8">
                  {/* Trial Counter Mockup */}
                  <div className="mt-8 p-4 gradient-secondary rounded-lg"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Calculator Interface */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional-Grade Calculators
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the power of our financial calculation engine with this
              interactive Net Worth Calculator.
            </p>
          </div>

          <NetWorthCalculator />

          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              This is just one of our 32+ calculators available to guest users
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Real-time calculations",
                "Save & export results",
                "Professional reports",
                "Mobile optimized",
              ].map((feature) => (
                <Badge key={feature} variant="secondary" className="px-4 py-2">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Company Stats */}

              {/* Leadership Team */}
            </div>

            {/* Company Visual */}
            <div className="relative">{/* Floating elements */}</div>
          </div>
        </div>
      </section>

      <GuestAccessModal
        open={guestModalOpen}
        onOpenChange={setGuestModalOpen}
      />
    </div>
  );
}
