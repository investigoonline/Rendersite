import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalculatorIcon, Home, TrendingUp, PiggyBank, Percent, BarChart3, Landmark, Wallet } from "lucide-react";
import NetWorthCalc from "@/components/financial-calculators/NetWorthCalc";
import LoanPayoffCalc from "@/components/financial-calculators/LoanPayoffCalc";
import RealEstateCalc from "@/components/financial-calculators/RealEstateCalc";
import RetirementCalc from "@/components/financial-calculators/RetirementCalc";
import InterestCalc from "@/components/financial-calculators/InterestCalc";
import CAGRCalc from "@/components/financial-calculators/CAGRCalc";
import IRACalc from "@/components/financial-calculators/IRACalc";
import WealthSnapshotCalc from "@/components/financial-calculators/WealthSnapshotCalc";
import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";

const SECTIONS = [
  {
    id: "net-worth",
    label: "Net Worth",
    icon: CalculatorIcon,
    badge: "Wealth Management",
    badgeColor: "bg-blue-100 text-blue-800",
    title: "Net Worth Calculator",
    description: "Calculate your complete financial position — assets vs liabilities — and track your wealth over time.",
    component: NetWorthCalc,
  },
  {
    id: "loan-payoff",
    label: "Loan Payoff",
    icon: TrendingUp,
    badge: "Loans",
    badgeColor: "bg-orange-100 text-orange-800",
    title: "Loan Payoff & Extra-Payment Calculator",
    description: "See exactly how much time and interest you save by making extra payments on your loan.",
    component: LoanPayoffCalc,
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: Home,
    badge: "Real Estate & Housing",
    badgeColor: "bg-green-100 text-green-800",
    title: "Real Estate & Housing Calculator",
    description: "Analyze home equity, investment ROI, mortgage payments, and affordability in one place.",
    component: RealEstateCalc,
  },
  {
    id: "retirement",
    label: "Retirement",
    icon: PiggyBank,
    badge: "Retirement Planning",
    badgeColor: "bg-purple-100 text-purple-800",
    title: "Retirement Calculator",
    description: "Estimate your retirement nest egg, replacement ratio, and whether you're on track to retire comfortably.",
    component: RetirementCalc,
  },
  {
    id: "interest",
    label: "Interest",
    icon: Percent,
    badge: "Interest Tools",
    badgeColor: "bg-yellow-100 text-yellow-800",
    title: "Interest Calculators",
    description: "Six tools in one: simple interest, compound interest, Rule of 72, fixed vs floating rates, tax impact, and inflation impact.",
    component: InterestCalc,
  },
  {
    id: "cagr",
    label: "CAGR",
    icon: BarChart3,
    badge: "Investment Growth",
    badgeColor: "bg-teal-100 text-teal-800",
    title: "CAGR Calculator",
    description: "Calculate the Compound Annual Growth Rate of any investment and visualize its growth trajectory.",
    component: CAGRCalc,
  },
  {
    id: "ira",
    label: "IRA Eligibility",
    icon: Landmark,
    badge: "Retirement Accounts",
    badgeColor: "bg-red-100 text-red-800",
    title: "IRA & Roth IRA Eligibility Calculator",
    description: "Determine your Roth IRA contribution eligibility and Traditional IRA deductibility based on 2024 IRS rules.",
    component: IRACalc,
  },
  {
    id: "wealth-snapshot",
    label: "Wealth Snapshot",
    icon: Wallet,
    badge: "Comprehensive Planning",
    badgeColor: "bg-indigo-100 text-indigo-800",
    title: "Wealth Snapshot",
    description: "Your complete financial profile — personal details, domestic & non-domicile assets, liabilities, risk profile, estate planning, and retirement projections at ages 65, 75 & 85.",
    component: WealthSnapshotCalc,
  },
];

export default function FinancialCalculators() {
  const [activeId, setActiveId] = useState("net-worth");
  const active = SECTIONS.find(s => s.id === activeId)!;
  const ActiveComponent = active.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[hsl(214,88%,36%)] to-[hsl(159,88%,20%)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Financial Calculators
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Professional-grade financial planning tools — net worth, loans, real estate, retirement, interest, and a comprehensive Wealth Snapshot.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Nav */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-20 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 mb-3">Calculators</p>
              {SECTIONS.map(s => {
                const Icon = s.icon;
                const isActive = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveId(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                  {active.title}
                </h2>
                <Badge className={active.badgeColor}>{active.badge}</Badge>
              </div>
              <p className="text-gray-500 text-sm">{active.description}</p>
            </div>

            {/* Calculator */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <ActiveComponent />
            </div>

            {/* Disclaimer */}
            <div className="mt-6">
              <CalculatorDisclaimer />
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex overflow-x-auto z-40 shadow-lg">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-[60px] flex-shrink-0 text-xs font-medium transition-colors ${
                  isActive ? "text-primary border-t-2 border-primary" : "text-gray-500"
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span className="truncate max-w-[56px]">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-16 lg:hidden" />
      </div>
    </div>
  );
}
