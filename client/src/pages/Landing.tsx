import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GuestSignupForm from "@/components/guest/GuestSignupForm";
import CalculatorCard from "@/components/calculators/CalculatorCard";
import NetWorthCalculator from "@/components/calculators/NetWorthCalculator";
import { HTMLContent } from "@/components/HTMLContent";
import homeHeroImage from "@assets/Home_(2)_1765299273068.png";
import wealthCreationDefault from "@/assets/wealth-creation.png";
import wealthProtectionDefault from "@/assets/wealth-protection.png";
import wealthPreservationDefault from "@/assets/wealth-preservation.png";
import wealthTransferDefault from "@/assets/wealth-transfer.png";
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
import type { RolePermission, PageContent } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { getFieldFontStyle } from "@/hooks/useFieldFontStyles";

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
  const heroImage = useDynamicImage("home", "hero", homeHeroImage);
  const { user } = useAuth();

  // Fetch user permissions
  const { data: userPermissions } = useQuery<RolePermission[]>({
    queryKey: ["/api/user/permissions"],
  });

  // Fetch home page content for wealth pillars
  const { data: homeContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "home"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=home", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch home content");
      return res.json();
    },
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return homeContent?.find((c) => c.section === sectionName);
  };

  // Wealth pillar content
  const wealthCreation = getSection("home_wealth_creation")?.content as any;
  const wealthProtection = getSection("home_wealth_protection")?.content as any;
  const wealthPreservation = getSection("home_wealth_preservation")
    ?.content as any;
  const wealthTransfer = getSection("home_wealth_transfer")?.content as any;

  // Show all categories without filtering
  const filteredCategories = calculatorCategories;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Welcome Message for Logged In Users */}
      {user && user.lastName && (
        <div className="bg-white py-3 text-center">
          <p className="text-lg font-bold text-primary">
            Welcome to IFS Financial Services! {user.lastName}
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section>
        <div className="w-full">
          <img
            src={heroImage}
            alt="Family enjoying financial freedom"
            className="w-full object-contain lg:object-cover lg:object-top h-auto lg:h-[480px]"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-center">
          <p className="text-xl sm:text-2xl text-gray-600 mx-auto leading-relaxed text-center">
            At IFS Wealth Management Inc, we understand that managing wealth is
            not just about numbers; it's about realizing your dreams, securing
            your future, and achieving financial freedom. As a leading wealth
            management firm, we are dedicated to providing personalized
            solutions and expert guidance to help you navigate the complexities
            of financial planning and investment management.
          </p>
        </div>
      </section>

      {/* Wealth Pillars Section */}
      <section className="py-20" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Wealth Creation */}
            <Card className="bg-white border-t-4 border-t-primary shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white">
                    <img
                      src={wealthCreation?.imageUrl || wealthCreationDefault}
                      alt="Wealth Creation"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                    />
                  </div>
                  <div className="sm:w-3/5 p-6 sm:p-8">
                    <h3 className="font-heading text-[28px] font-bold text-gray-900 mb-3" style={getFieldFontStyle(wealthCreation, 'title')}>
                      {wealthCreation?.title || "Wealth Creation"}
                    </h3>
                    <p className="text-[16px] text-gray-600 leading-relaxed whitespace-pre-wrap" style={getFieldFontStyle(wealthCreation, 'description')}>
                      {wealthCreation?.description ||
                        "Placeholder content for Wealth Creation. Edit this from the Content Management page."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wealth Protection */}
            <Card className="bg-white border-t-4 border-t-blue-500 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white">
                    <img
                      src={
                        wealthProtection?.imageUrl || wealthProtectionDefault
                      }
                      alt="Wealth Protection"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                    />
                  </div>
                  <div className="sm:w-3/5 p-6 sm:p-8">
                    <h3 className="font-heading text-[28px] font-bold text-gray-900 mb-3" style={getFieldFontStyle(wealthProtection, 'title')}>
                      {wealthProtection?.title || "Wealth Protection"}
                    </h3>
                    <p className="text-[16px] text-gray-600 leading-relaxed whitespace-pre-wrap" style={getFieldFontStyle(wealthProtection, 'description')}>
                      {wealthProtection?.description ||
                        "Placeholder content for Wealth Protection. Edit this from the Content Management page."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wealth Preservation */}
            <Card className="bg-white border-t-4 border-t-yellow-500 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-white">
                    <img
                      src={
                        wealthPreservation?.imageUrl ||
                        wealthPreservationDefault
                      }
                      alt="Wealth Preservation"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                    />
                  </div>
                  <div className="sm:w-3/5 p-6 sm:p-8">
                    <h3 className="font-heading text-[28px] font-bold text-gray-900 mb-3" style={getFieldFontStyle(wealthPreservation, 'title')}>
                      {wealthPreservation?.title || "Wealth Preservation"}
                    </h3>
                    <p className="text-[16px] text-gray-600 leading-relaxed whitespace-pre-wrap" style={getFieldFontStyle(wealthPreservation, 'description')}>
                      {wealthPreservation?.description ||
                        "Placeholder content for Wealth Preservation. Edit this from the Content Management page."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wealth Transfer & Legacy */}
            <Card className="bg-white border-t-4 border-t-purple-500 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-white">
                    <img
                      src={wealthTransfer?.imageUrl || wealthTransferDefault}
                      alt="Wealth Transfer & Legacy"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                    />
                  </div>
                  <div className="sm:w-3/5 p-6 sm:p-8">
                    <h3 className="font-heading text-[28px] font-bold text-gray-900 mb-3" style={getFieldFontStyle(wealthTransfer, 'title')}>
                      {wealthTransfer?.title || "Wealth Transfer & Legacy"}
                    </h3>
                    <p className="text-[16px] text-gray-600 leading-relaxed whitespace-pre-wrap" style={getFieldFontStyle(wealthTransfer, 'description')}>
                      {wealthTransfer?.description ||
                        "Placeholder content for Wealth Transfer & Legacy. Edit this from the Content Management page."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator Access Button */}
      <section className="py-16" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Explore Our Complete Suite Of Financial Tools
          </p>
          <div className="flex flex-col items-center">
            <Link href="/calculators">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
                Access Financial Calculators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guest Account System Feature */}

      {/* Sample Calculator Interface */}

      {/* About Section */}
      <section className="py-20" style={{ backgroundColor: '#f5f5f5' }}>
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

    </div>
  );
}
