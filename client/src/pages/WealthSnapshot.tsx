import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { NumericInput } from "@/components/ui/numeric-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  User, Building2, Globe2, CreditCard, ShieldCheck, ScrollText,
  ChevronRight, ChevronLeft, CheckCircle2, HelpCircle, TrendingUp,
  Home, Briefcase, Coins, Landmark, FileText, Heart, Users,
  RefreshCw, Calendar, Phone,
} from "lucide-react";
import { Link } from "wouter";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Personal {
  fullName: string;
  currentAge: string;
  country: string;
  citizenship: string;
  countryOfResidence: string;
}

interface DomesticAssets {
  cashBank: string;
  fixedDeposits: string;
  stocks: string;
  mutualFunds: string;
  bonds: string;
  residentialRealEstate: string;
  commercialRealEstate: string;
  businessEquity: string;
  goldPreciousMetals: string;
  alternativeInvestments: string;
  otherAssets: string;
}

interface OverseasAssets {
  foreignCashBank: string;
  foreignInvestments: string;
  otherOverseasAssets: string;
}

interface Liabilities {
  mortgageLoans: string;
  personalLoans: string;
  businessLoans: string;
  creditLines: string;
  otherLiabilities: string;
  taxesPayable: string;
}

interface RiskProfile {
  riskAppetite: "conservative" | "moderate" | "aggressive" | "";
  investmentStyle: "income" | "balanced" | "growth" | "speculative" | "";
}

interface EstatePlanning {
  will: boolean | null;
  trust: boolean | null;
  powerOfAttorney: boolean | null;
  healthcareDirective: boolean | null;
  beneficiaries: string;
}

interface FormData {
  personal: Personal;
  domestic: DomesticAssets;
  overseas: OverseasAssets;
  liabilities: Liabilities;
  risk: RiskProfile;
  estate: EstatePlanning;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 0, label: "Personal", icon: User },
  { id: 1, label: "Domestic Assets", icon: Building2 },
  { id: 2, label: "Overseas Assets", icon: Globe2 },
  { id: 3, label: "Liabilities", icon: CreditCard },
  { id: 4, label: "Risk Profile", icon: ShieldCheck },
  { id: 5, label: "Estate Planning", icon: ScrollText },
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India",
  "Singapore", "United Arab Emirates", "Hong Kong", "Germany", "France",
  "Switzerland", "Japan", "China", "Brazil", "South Africa",
  "New Zealand", "Netherlands", "Sweden", "Norway", "Denmark",
  "Ireland", "Spain", "Italy", "Portugal", "Belgium",
  "Mexico", "Argentina", "Saudi Arabia", "Qatar", "Kuwait",
  "Bahrain", "Oman", "Malaysia", "Indonesia", "Philippines",
  "Thailand", "South Korea", "Israel", "Turkey", "Egypt",
  "Nigeria", "Kenya", "Ghana", "Other",
];

const GROWTH_RATES: Record<string, number> = {
  conservative: 0.04,
  moderate: 0.06,
  aggressive: 0.08,
  "": 0.05,
};

const COLORS = [
  "#1e5fad", "#0a7c59", "#2eaad1", "#6366f1", "#f59e0b",
  "#10b981", "#ef4444", "#8b5cf6", "#f97316", "#14b8a6",
];

const DOMESTIC_ASSET_COLORS = "#1e5fad";
const OVERSEAS_ASSET_COLOR = "#0a7c59";
const LIABILITY_COLOR = "#ef4444";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function n(v: string) { return parseFloat(v.replace(/,/g, "")) || 0; }

function fmt(num: number) {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  return "$" + Math.round(num).toLocaleString("en-US");
}

function fmtFull(num: number) {
  return "$" + Math.round(num).toLocaleString("en-US");
}

function compound(principal: number, rate: number, years: number) {
  if (years <= 0) return principal;
  return principal * Math.pow(1 + rate, years);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ label, tooltip }: { label: string; tooltip?: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function MoneyField({
  label, value, onChange, tooltip,
}: {
  label: string; value: string; onChange: (v: string) => void; tooltip?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} tooltip={tooltip} />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
        <NumericInput
          className="pl-7"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
        />
      </div>
    </div>
  );
}

function YesNoToggle({
  label, value, onChange, tooltip,
}: {
  label: string; value: boolean | null; onChange: (v: boolean) => void; tooltip?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0">
      <FieldLabel label={label} tooltip={tooltip} />
      <div className="flex gap-2 flex-shrink-0">
        {([true, false] as const).map((bool) => (
          <button
            key={String(bool)}
            onClick={() => onChange(bool)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              value === bool
                ? bool
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {bool ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-5">
        {children}
      </CardContent>
    </Card>
  );
}

function ResultCard({ label, value, sub, color = "text-gray-900" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function RiskButton({ label, desc, selected, onClick, color }: {
  label: string; desc: string; selected: boolean; onClick: () => void; color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected ? `border-${color} bg-${color}/5` : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
      style={selected ? { borderColor: "var(--color-selected)", backgroundColor: "var(--color-selected-bg)" } : {}}
    >
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 transition-all ${selected ? "border-primary" : "border-gray-300"}`}>
          {selected && <div className="h-2 w-2 rounded-full bg-primary m-0.5" />}
        </div>
        <div>
          <p className={`font-semibold text-sm ${selected ? "text-primary" : "text-gray-700"}`}>{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultForm: FormData = {
  personal: { fullName: "", currentAge: "", country: "", citizenship: "", countryOfResidence: "" },
  domestic: {
    cashBank: "0", fixedDeposits: "0", stocks: "0", mutualFunds: "0", bonds: "0",
    residentialRealEstate: "0", commercialRealEstate: "0", businessEquity: "0",
    goldPreciousMetals: "0", alternativeInvestments: "0", otherAssets: "0",
  },
  overseas: { foreignCashBank: "0", foreignInvestments: "0", otherOverseasAssets: "0" },
  liabilities: {
    mortgageLoans: "0", personalLoans: "0", businessLoans: "0",
    creditLines: "0", otherLiabilities: "0", taxesPayable: "0",
  },
  risk: { riskAppetite: "", investmentStyle: "" },
  estate: { will: null, trust: null, powerOfAttorney: null, healthcareDirective: null, beneficiaries: "" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WealthSnapshot() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [showResults, setShowResults] = useState(false);

  // ── Setters ──
  const setPersonal = (k: keyof Personal, v: string) =>
    setForm((f) => ({ ...f, personal: { ...f.personal, [k]: v } }));
  const setDomestic = (k: keyof DomesticAssets, v: string) =>
    setForm((f) => ({ ...f, domestic: { ...f.domestic, [k]: v } }));
  const setOverseas = (k: keyof OverseasAssets, v: string) =>
    setForm((f) => ({ ...f, overseas: { ...f.overseas, [k]: v } }));
  const setLiability = (k: keyof Liabilities, v: string) =>
    setForm((f) => ({ ...f, liabilities: { ...f.liabilities, [k]: v } }));
  const setRisk = (k: keyof RiskProfile, v: string) =>
    setForm((f) => ({ ...f, risk: { ...f.risk, [k]: v as never } }));
  const setEstate = (k: keyof EstatePlanning, v: boolean | string | null) =>
    setForm((f) => ({ ...f, estate: { ...f.estate, [k]: v } }));

  // ── Calculations ──
  const dom = form.domestic;
  const ov = form.overseas;
  const lib = form.liabilities;

  const totalDomestic =
    n(dom.cashBank) + n(dom.fixedDeposits) + n(dom.stocks) + n(dom.mutualFunds) +
    n(dom.bonds) + n(dom.residentialRealEstate) + n(dom.commercialRealEstate) +
    n(dom.businessEquity) + n(dom.goldPreciousMetals) + n(dom.alternativeInvestments) + n(dom.otherAssets);

  const totalOverseas =
    n(ov.foreignCashBank) + n(ov.foreignInvestments) + n(ov.otherOverseasAssets);

  const totalLiabilities =
    n(lib.mortgageLoans) + n(lib.personalLoans) + n(lib.businessLoans) +
    n(lib.creditLines) + n(lib.otherLiabilities) + n(lib.taxesPayable);

  const totalAssets = totalDomestic + totalOverseas;
  const netWorth = totalAssets - totalLiabilities;

  const currentAge = parseInt(form.personal.currentAge) || 0;
  const yearsTo65 = Math.max(0, 65 - currentAge);
  const yearsTo90 = Math.max(0, 90 - currentAge);
  const growthRate = GROWTH_RATES[form.risk.riskAppetite] ?? 0.05;
  const projected65 = compound(Math.max(0, netWorth), growthRate, yearsTo65);
  const projected90 = compound(Math.max(0, netWorth), growthRate, yearsTo90);

  // ── Domestic breakdown chart ──
  const domBreakdown = [
    { name: "Cash & Bank", value: n(dom.cashBank) },
    { name: "Fixed Deposits", value: n(dom.fixedDeposits) },
    { name: "Stocks", value: n(dom.stocks) },
    { name: "Mutual Funds", value: n(dom.mutualFunds) },
    { name: "Bonds", value: n(dom.bonds) },
    { name: "Residential RE", value: n(dom.residentialRealEstate) },
    { name: "Commercial RE", value: n(dom.commercialRealEstate) },
    { name: "Business Equity", value: n(dom.businessEquity) },
    { name: "Gold & Metals", value: n(dom.goldPreciousMetals) },
    { name: "Alternatives", value: n(dom.alternativeInvestments) },
    { name: "Other Assets", value: n(dom.otherAssets) },
  ].filter((d) => d.value > 0);

  const overviewChart = [
    { name: "Domestic Assets", value: totalDomestic },
    { name: "Overseas Assets", value: totalOverseas },
    { name: "Liabilities", value: totalLiabilities },
  ].filter((d) => d.value > 0);

  const projectionChart = currentAge > 0 ? [
    { age: `Age ${currentAge} (Now)`, value: Math.max(0, netWorth) },
    ...(yearsTo65 > 0 ? [{ age: "Age 65", value: projected65 }] : []),
    { age: "Age 90", value: projected90 },
  ] : [];

  // ── Estate checklist score ──
  const estateItems = [form.estate.will, form.estate.trust, form.estate.powerOfAttorney, form.estate.healthcareDirective];
  const estateScore = estateItems.filter((v) => v === true).length;
  const estateTotal = estateItems.length;

  // ── Navigation ──
  const canNext = () => {
    if (step === 0) {
      return form.personal.currentAge.trim() !== "" && parseInt(form.personal.currentAge) > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else setShowResults(true);
  };

  const handleBack = () => {
    if (showResults) { setShowResults(false); setStep(STEPS.length - 1); }
    else if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setForm(defaultForm);
    setStep(0);
    setShowResults(false);
  };

  // ─── Step Content ──────────────────────────────────────────────────────────

  function StepPersonal() {
    return (
      <SectionCard icon={User} title="Personal Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldLabel label="Full Name" />
            <Input
              value={form.personal.fullName}
              onChange={(e) => setPersonal("fullName", e.target.value)}
              placeholder="e.g. John Smith"
            />
          </div>
          <div>
            <FieldLabel label="Current Age *" tooltip="Used to auto-calculate retirement projections at ages 65 and 90." />
            <NumericInput
              value={form.personal.currentAge}
              onChange={(e) => setPersonal("currentAge", e.target.value)}
              placeholder="e.g. 45"
              allowDecimal={false}
            />
            {form.personal.currentAge && parseInt(form.personal.currentAge) > 0 && (
              <p className="text-xs text-green-600 mt-1">
                We'll project your wealth at ages 65 and 90.
              </p>
            )}
          </div>
          <div>
            <FieldLabel label="Citizenship" />
            <Select value={form.personal.citizenship} onValueChange={(v) => setPersonal("citizenship", v)}>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FieldLabel label="Country of Residence" />
            <Select value={form.personal.countryOfResidence} onValueChange={(v) => setPersonal("countryOfResidence", v)}>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FieldLabel label="Country (Tax Domicile)" tooltip="The country where your primary tax obligations are based." />
            <Select value={form.personal.country} onValueChange={(v) => setPersonal("country", v)}>
              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>
    );
  }

  function StepDomestic() {
    return (
      <SectionCard icon={Building2} title="Domestic Assets">
        <p className="text-xs text-gray-500 mb-4">Enter the current market value of each asset you hold in your home country.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyField label="Cash & Bank Balance" value={dom.cashBank} onChange={(v) => setDomestic("cashBank", v)} tooltip="Savings, checking, and money market accounts." />
          <MoneyField label="Fixed Deposits" value={dom.fixedDeposits} onChange={(v) => setDomestic("fixedDeposits", v)} tooltip="CDs, term deposits, and fixed-rate instruments." />
          <MoneyField label="Stocks" value={dom.stocks} onChange={(v) => setDomestic("stocks", v)} tooltip="Listed equities and shares at current market value." />
          <MoneyField label="Mutual Funds" value={dom.mutualFunds} onChange={(v) => setDomestic("mutualFunds", v)} tooltip="Total NAV of all mutual fund holdings." />
          <MoneyField label="Bonds" value={dom.bonds} onChange={(v) => setDomestic("bonds", v)} tooltip="Government and corporate bonds at current value." />
          <MoneyField label="Residential Real Estate" value={dom.residentialRealEstate} onChange={(v) => setDomestic("residentialRealEstate", v)} tooltip="Current market value of homes, condos, or rental properties." />
          <MoneyField label="Commercial Real Estate" value={dom.commercialRealEstate} onChange={(v) => setDomestic("commercialRealEstate", v)} tooltip="Office, retail, or industrial property market value." />
          <MoneyField label="Business Equity" value={dom.businessEquity} onChange={(v) => setDomestic("businessEquity", v)} tooltip="Your ownership stake in private businesses." />
          <MoneyField label="Gold & Precious Metals" value={dom.goldPreciousMetals} onChange={(v) => setDomestic("goldPreciousMetals", v)} tooltip="Physical gold, silver, platinum, and other precious metals." />
          <MoneyField label="Alternative Investments" value={dom.alternativeInvestments} onChange={(v) => setDomestic("alternativeInvestments", v)} tooltip="Private equity, hedge funds, collectibles, crypto, etc." />
          <div className="sm:col-span-2">
            <MoneyField label="Other Domestic Assets" value={dom.otherAssets} onChange={(v) => setDomestic("otherAssets", v)} tooltip="Any other domestic assets not listed above." />
          </div>
        </div>
        {totalDomestic > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">Total Domestic Assets</span>
            <span className="text-base font-bold text-primary">{fmtFull(totalDomestic)}</span>
          </div>
        )}
      </SectionCard>
    );
  }

  function StepOverseas() {
    return (
      <SectionCard icon={Globe2} title="Overseas Assets">
        <p className="text-xs text-gray-500 mb-4">Enter the USD equivalent value of assets held outside your home country.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyField label="Foreign Cash / Bank Balance" value={ov.foreignCashBank} onChange={(v) => setOverseas("foreignCashBank", v)} tooltip="Offshore bank accounts and foreign currency holdings." />
          <MoneyField label="Foreign Investments" value={ov.foreignInvestments} onChange={(v) => setOverseas("foreignInvestments", v)} tooltip="International stocks, mutual funds, ETFs, and similar." />
          <div className="sm:col-span-2">
            <MoneyField label="Other Overseas Assets" value={ov.otherOverseasAssets} onChange={(v) => setOverseas("otherOverseasAssets", v)} tooltip="Foreign real estate, businesses, or any other international assets." />
          </div>
        </div>
        {totalOverseas > 0 && (
          <div className="mt-4 p-3 bg-teal-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-teal-700 font-medium">Total Overseas Assets</span>
            <span className="text-base font-bold text-secondary">{fmtFull(totalOverseas)}</span>
          </div>
        )}
      </SectionCard>
    );
  }

  function StepLiabilities() {
    return (
      <SectionCard icon={CreditCard} title="Liabilities">
        <p className="text-xs text-gray-500 mb-4">Enter the current outstanding balance of each liability.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyField label="Mortgage Loans" value={lib.mortgageLoans} onChange={(v) => setLiability("mortgageLoans", v)} tooltip="Outstanding balance on home loans." />
          <MoneyField label="Personal Loans" value={lib.personalLoans} onChange={(v) => setLiability("personalLoans", v)} tooltip="Unsecured personal loans and consumer credit." />
          <MoneyField label="Business Loans" value={lib.businessLoans} onChange={(v) => setLiability("businessLoans", v)} tooltip="Outstanding loans tied to your business operations." />
          <MoneyField label="Credit Lines" value={lib.creditLines} onChange={(v) => setLiability("creditLines", v)} tooltip="Home equity lines, margin accounts, and revolving credit." />
          <MoneyField label="Other Liabilities" value={lib.otherLiabilities} onChange={(v) => setLiability("otherLiabilities", v)} tooltip="Credit card balances, car loans, and any other debts." />
          <MoneyField label="Taxes Payable" value={lib.taxesPayable} onChange={(v) => setLiability("taxesPayable", v)} tooltip="Estimated taxes owed but not yet paid." />
        </div>
        {totalLiabilities > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-red-700 font-medium">Total Liabilities</span>
            <span className="text-base font-bold text-red-600">{fmtFull(totalLiabilities)}</span>
          </div>
        )}
      </SectionCard>
    );
  }

  function StepRisk() {
    const appetiteOptions = [
      { value: "conservative", label: "Conservative", desc: "Capital preservation first — lower risk, ~4% projected annual growth", icon: "🛡️" },
      { value: "moderate", label: "Moderate", desc: "Balanced approach — medium risk, ~6% projected annual growth", icon: "⚖️" },
      { value: "aggressive", label: "Aggressive", desc: "Growth-focused — higher risk tolerance, ~8% projected annual growth", icon: "🚀" },
    ];
    const styleOptions = [
      { value: "income", label: "Income", desc: "Focus on regular dividends, interest, and cash flow" },
      { value: "balanced", label: "Balanced", desc: "Mix of income and capital appreciation" },
      { value: "growth", label: "Growth", desc: "Prioritise long-term capital gains over income" },
      { value: "speculative", label: "Speculative", desc: "High-risk, high-reward opportunities" },
    ];
    return (
      <SectionCard icon={ShieldCheck} title="Risk Profile">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Risk Appetite</p>
            <p className="text-xs text-gray-500 mb-3">Your selection sets the growth rate used in retirement projections.</p>
            <div className="space-y-2">
              {appetiteOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRisk("riskAppetite", opt.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    form.risk.riskAppetite === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      form.risk.riskAppetite === opt.value ? "border-primary" : "border-gray-300"
                    }`}>
                      {form.risk.riskAppetite === opt.value && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${form.risk.riskAppetite === opt.value ? "text-primary" : "text-gray-700"}`}>
                        {opt.icon} {opt.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Investment Style</p>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRisk("investmentStyle", opt.value)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    form.risk.investmentStyle === opt.value
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <p className={`font-semibold text-sm ${form.risk.investmentStyle === opt.value ? "text-secondary" : "text-gray-700"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    );
  }

  function StepEstate() {
    const items: { key: keyof EstatePlanning; label: string; tooltip: string }[] = [
      { key: "will", label: "Will", tooltip: "A legal document directing how your estate is distributed after death." },
      { key: "trust", label: "Trust", tooltip: "A legal arrangement managing assets during your lifetime and beyond." },
      { key: "powerOfAttorney", label: "Power of Attorney", tooltip: "Grants someone authority to act on your behalf for financial/legal matters." },
      { key: "healthcareDirective", label: "Healthcare Directive", tooltip: "Also known as a living will — outlines your medical care wishes." },
    ];
    return (
      <SectionCard icon={ScrollText} title="Estate Planning">
        <p className="text-xs text-gray-500 mb-4">Indicate which estate planning documents you currently have in place.</p>
        <div>
          {items.map(({ key, label, tooltip }) => (
            <YesNoToggle
              key={key}
              label={label}
              value={form.estate[key] as boolean | null}
              onChange={(v) => setEstate(key, v)}
              tooltip={tooltip}
            />
          ))}
        </div>
        <div className="mt-5">
          <FieldLabel label="Beneficiaries" tooltip="List the names of people or entities who will inherit your estate." />
          <Input
            value={form.estate.beneficiaries}
            onChange={(e) => setEstate("beneficiaries", e.target.value)}
            placeholder="e.g. Jane Smith (spouse), John Smith Jr. (son)"
          />
        </div>
        {estateScore > 0 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">{estateScore} of {estateTotal}</span> key documents in place.{" "}
              {estateScore < estateTotal && "Consider completing your estate plan with an advisor."}
            </p>
          </div>
        )}
      </SectionCard>
    );
  }

  // ─── Results Panel ────────────────────────────────────────────────────────

  function Results() {
    const riskLabel = { conservative: "Conservative", moderate: "Moderate", aggressive: "Aggressive", "": "Not specified" };
    const styleLabel = { income: "Income", balanced: "Balanced", growth: "Growth", speculative: "Speculative", "": "Not specified" };
    const netColor = netWorth >= 0 ? "text-primary" : "text-red-600";
    const name = form.personal.fullName || "Your";

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="text-center pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">
            {name !== "Your" ? `${name}'s` : "Your"} Wealth Snapshot
          </h2>
          {currentAge > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Based on your profile at age {currentAge}
              {form.personal.countryOfResidence && ` · ${form.personal.countryOfResidence}`}
            </p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultCard label="Total Assets" value={fmt(totalAssets)} color="text-primary" />
          <ResultCard label="Total Liabilities" value={fmt(totalLiabilities)} color="text-red-600" />
          <ResultCard
            label="Net Worth"
            value={fmt(netWorth)}
            color={netColor}
            sub={netWorth < 0 ? "Liabilities exceed assets" : undefined}
          />
          <ResultCard
            label="Asset Coverage"
            value={totalLiabilities > 0 ? `${((totalAssets / totalLiabilities) * 100).toFixed(0)}%` : "—"}
            sub="Assets vs liabilities"
          />
        </div>

        {/* Domestic vs Overseas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Building2 className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Domestic Assets</p>
            <p className="text-lg font-bold text-primary">{fmt(totalDomestic)}</p>
            <p className="text-xs text-gray-400">{totalAssets > 0 ? `${((totalDomestic / totalAssets) * 100).toFixed(1)}% of total` : "—"}</p>
          </div>
          <div className="bg-teal-50 rounded-xl p-4 text-center">
            <Globe2 className="h-5 w-5 text-secondary mx-auto mb-1" />
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Overseas Assets</p>
            <p className="text-lg font-bold text-secondary">{fmt(totalOverseas)}</p>
            <p className="text-xs text-gray-400">{totalAssets > 0 ? `${((totalOverseas / totalAssets) * 100).toFixed(1)}% of total` : "—"}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <CreditCard className="h-5 w-5 text-red-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Total Liabilities</p>
            <p className="text-lg font-bold text-red-600">{fmt(totalLiabilities)}</p>
            <p className="text-xs text-gray-400">{totalAssets > 0 ? `${((totalLiabilities / totalAssets) * 100).toFixed(1)}% of assets` : "—"}</p>
          </div>
        </div>

        {/* Overview Pie Chart */}
        {overviewChart.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-gray-700">Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={overviewChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {overviewChart.map((_, i) => (
                      <Cell key={i} fill={[DOMESTIC_ASSET_COLORS, OVERSEAS_ASSET_COLOR, LIABILITY_COLOR][i]} />
                    ))}
                  </Pie>
                  <ReTooltip formatter={(v: number) => fmtFull(v)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Domestic Breakdown */}
        {domBreakdown.length > 1 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-gray-700">Domestic Asset Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={domBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={2}>
                    {domBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <ReTooltip formatter={(v: number) => fmtFull(v)} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Retirement Projections */}
        {currentAge > 0 && netWorth > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Retirement Wealth Projections
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Projected using{" "}
                <span className="font-medium text-gray-700">
                  {form.risk.riskAppetite
                    ? `${form.risk.riskAppetite} profile (${(growthRate * 100).toFixed(0)}% p.a.)`
                    : `estimated 5% p.a.`}
                </span>{" "}
                compounded annually on current net worth.
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                    Projected at Age 65
                    {yearsTo65 > 0 ? ` (${yearsTo65} yrs)` : " (Reached)"}
                  </p>
                  <p className="text-2xl font-bold text-primary">{fmt(projected65)}</p>
                  {yearsTo65 > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {((projected65 / netWorth - 1) * 100).toFixed(0)}% growth from today
                    </p>
                  )}
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                    Projected at Age 90 ({yearsTo90} yrs)
                  </p>
                  <p className="text-2xl font-bold text-secondary">{fmt(projected90)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((projected90 / netWorth - 1) * 100).toFixed(0)}% growth from today
                  </p>
                </div>
              </div>

              {projectionChart.length > 1 && (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={projectionChart} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="age" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 10 }} width={60} />
                    <ReTooltip formatter={(v: number) => [fmtFull(v), "Projected Net Worth"]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {projectionChart.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#94a3b8" : i === 1 ? DOMESTIC_ASSET_COLORS : OVERSEAS_ASSET_COLOR} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                * Projections are illustrative only and assume consistent annual growth. Actual returns will vary. This is not financial advice.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Risk Profile Summary */}
        {(form.risk.riskAppetite || form.risk.investmentStyle) && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Risk Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Risk Appetite</p>
                  <p className="font-semibold text-gray-800 text-sm capitalize">{form.risk.riskAppetite || "Not set"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Investment Style</p>
                  <p className="font-semibold text-gray-800 text-sm capitalize">{form.risk.investmentStyle || "Not set"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estate Planning Summary */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-primary" />
              Estate Planning Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(estateScore / estateTotal) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">{estateScore}/{estateTotal}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Will", val: form.estate.will },
                { label: "Trust", val: form.estate.trust },
                { label: "Power of Attorney", val: form.estate.powerOfAttorney },
                { label: "Healthcare Directive", val: form.estate.healthcareDirective },
              ].map(({ label, val }) => (
                <div key={label} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${val === true ? "bg-green-50 text-green-700" : val === false ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-500"}`}>
                  <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${val === true ? "text-green-500" : "text-gray-300"}`} />
                  <span className="font-medium">{label}</span>
                  <span className="ml-auto">{val === true ? "✓" : val === false ? "✗" : "—"}</span>
                </div>
              ))}
            </div>
            {form.estate.beneficiaries && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Beneficiaries:</span> {form.estate.beneficiaries}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/contact">
                <Calendar className="h-4 w-4 mr-2" /> Book an Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/contact">
                <Phone className="h-4 w-4 mr-2" /> Speak to an Advisor
              </Link>
            </Button>
          </div>
          <Button variant="outline" onClick={handleReset} className="w-full text-gray-600">
            <RefreshCw className="h-4 w-4 mr-2" /> Start a New Snapshot
          </Button>
        </div>
      </div>
    );
  }

  // ─── Step Content Map ─────────────────────────────────────────────────────

  const stepContent = [
    <StepPersonal />,
    <StepDomestic />,
    <StepOverseas />,
    <StepLiabilities />,
    <StepRisk />,
    <StepEstate />,
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-10 sm:py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Coins className="h-4 w-4" />
            Wealth Snapshot Calculator
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-3">
            Your Complete Financial Profile
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
            Build a comprehensive picture of your wealth — assets, liabilities, risk profile, estate planning — and see projections for ages 65 and 90.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!showResults ? (
          <>
            {/* Step Progress */}
            <div className="mb-6">
              {/* Progress bar */}
              <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5 mb-4" />

              {/* Step pills — scrollable on mobile */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  const isActive = s.id === step;
                  const isDone = s.id < step;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                        isActive
                          ? "bg-primary text-white"
                          : isDone
                          ? "bg-primary/15 text-primary"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-6">{stepContent[step]}</div>

            {/* Live Summary Bar (steps 1–3) */}
            {step >= 1 && step <= 3 && (
              <div className="mb-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-400">Assets</p>
                    <p className="text-sm font-bold text-primary">{fmt(totalAssets)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Liabilities</p>
                    <p className="text-sm font-bold text-red-500">{fmt(totalLiabilities)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Net Worth</p>
                    <p className={`text-sm font-bold ${netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(netWorth)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canNext()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {step === STEPS.length - 1 ? (
                  <><TrendingUp className="h-4 w-4 mr-2" /> View My Snapshot</>
                ) : (
                  <>Next <ChevronRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Results />
            <div className="mt-4">
              <Button variant="outline" onClick={handleBack} className="w-full">
                <ChevronLeft className="h-4 w-4 mr-1" /> Edit My Profile
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
