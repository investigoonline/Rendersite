import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GuestSignupForm from "@/components/guest/GuestSignupForm";
import CalculatorCard from "@/components/calculators/CalculatorCard";
import NetWorthCalculator from "@/components/calculators/NetWorthCalculator";
import GuestAccessModal from "@/components/modals/GuestAccessModal";
import { HTMLContent } from "@/components/HTMLContent";
import homeHeroImage from "@assets/Home_(2)_1765299273068.png";
import { useDynamicImage } from "@/hooks/useDynamicImage";
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
import type { RolePermission } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const calculatorCategories = [
  {
    id: "wealth_management",
    title: "Wealth Management",
    description:
      "Net worth tracking, debt ratio analysis, and wealth building strategies.",
    icon: PieChart,
    calculators: ["Total Net Worth Calculator", "Income to Debt Ratio"],
  },
  {
    id: "loans_credit",
    title: "Loans & Credit Cards",
    description:
      "Payoff strategies, payment schedules, and debt optimization tools.",
    icon: CreditCard,
    calculators: ["Loan Payoff Calculator", "Credit Card Debt Analysis"],
  },
  {
    id: "real_estate",
    title: "Real Estate & Housing",
    description:
      "Home affordability, mortgage refinancing, and acceleration strategies.",
    icon: Home,
    calculators: ["Home Affordability Calculator", "Mortgage Refinancing"],
  },
  {
    id: "vehicle_financing",
    title: "Vehicle Financing",
    description:
      "Lease vs buy analysis, payment calculations, and affordability assessment.",
    icon: Car,
    calculators: ["Lease Payment Calculator", "Car Affordability Analysis"],
  },
  {
    id: "retirement_inflation",
    title: "Retirement & Inflation",
    description:
      "Retirement cost planning, RMD calculations, and inflation impact analysis.",
    icon: PiggyBank,
    calculators: ["Cost of Retirement Calculator", "RMD Calculator"],
  },
  {
    id: "estate_planning",
    title: "Estate Planning",
    description:
      "Estate tax calculations and planning recommendations for asset transfer.",
    icon: Scale,
    calculators: ["Estate Tax Calculator", "Tax Planning Tools"],
  },
  {
    id: "taxes_iras",
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
    id: "credit_debt",
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
  const heroImage = useDynamicImage('home', 'hero', homeHeroImage);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const { user } = useAuth();

  // Fetch user permissions
  const { data: userPermissions } = useQuery<RolePermission[]>({
    queryKey: ["/api/user/permissions"],
  });

  // Show all categories without filtering
  const filteredCategories = calculatorCategories;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full mb-12">
          <img
            src={heroImage}
            alt="Family enjoying financial freedom"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="mx-auto space-y-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-center">
            <span className="text-primary">
              Welcome to IFS Wealth Management Inc- Your Trusted Partner in Wealth Management
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mx-auto leading-relaxed text-center">
            At IFS Wealth Management Inc, we understand that managing wealth is not just about numbers; it's about realizing your dreams, securing your future, and achieving financial freedom. As a leading wealth management firm, we are dedicated to providing personalized solutions and expert guidance to help you navigate the complexities of financial planning and investment management.
          </p>
        </div>
      </section>

      {/* Calculator Categories Section */}
      <section id="calculators" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Complete Financial Calculator Suite
            </h2>
            <p className="text-2xl sm:text-3xl text-muted-foreground mx-auto">
              32+ professional-grade calculators across 8 categories. From basic budgeting to complex estate planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredCategories.map((category) => (
              <CalculatorCard key={category.id} {...category} />
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
