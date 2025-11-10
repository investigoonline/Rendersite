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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary">Welcome to IFS Wealth Management Inc- Your Trusted Partner in Wealth Management</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At IFS Wealth Management Inc, we understand that managing wealth is not just about numbers; it's about realizing your dreams, securing your future, and achieving financial freedom. As a leading wealth management firm, we are dedicated to providing personalized solutions and expert guidance to help you navigate the complexities of financial planning and investment management.
            </p>
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

          
        </div>
      </section>

      {/* Guest Account System Feature */}

      {/* Sample Calculator Interface */}

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
