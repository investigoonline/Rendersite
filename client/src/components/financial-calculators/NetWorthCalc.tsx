import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NumericInput } from "@/components/ui/numeric-input";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  HelpCircle, ChevronRight, ChevronLeft, AlertTriangle,
  CheckCircle2, XCircle, Globe, ShieldAlert, FileWarning, TrendingUp,
} from "lucide-react";
import CalculatorCTAs from "./CalculatorCTAs";

const STEPS = [
  "Personal",
  "Domestic Assets",
  "Overseas Assets",
  "Liabilities",
  "Risk Profile",
  "Estate Planning",
];

const COUNTRIES = [
  "United States", "India", "United Kingdom", "Canada", "Australia",
  "Singapore", "UAE", "Germany", "France", "Netherlands", "Switzerland",
  "Hong Kong", "Japan", "South Korea", "China", "Brazil", "Mexico",
  "South Africa", "Nigeria", "Kenya", "Other",
];

const ASSET_PALETTE = [
  "#1d4ed8","#2563eb","#3b82f6","#60a5fa","#93c5fd",
  "#0d9488","#14b8a6","#2dd4bf",
  "#7c3aed","#a78bfa",
  "#d97706","#f59e0b","#fbbf24","#6b7280",
];

const RISK_RETURNS: Record<string,number> = { conservative: 0.05, moderate: 0.07, aggressive: 0.10 };
const STYLE_RETURNS: Record<string,number> = { income: 0.04, balanced: 0.06, growth: 0.08, speculative: 0.12 };
const RISK_WEIGHT = 0.7;
const STYLE_WEIGHT = 0.3;
const ESTATE_EXEMPTION = 13_600_000;
const ESTATE_TAX_RATE = 0.40;

interface FormData {
  fullName: string; currentAge: string; country: string; citizenship: string;
  countryOfResidence: string; retirementAge: string;
  cash: string; fixedDeposits: string; stocks: string; mutualFunds: string;
  bonds: string; residentialRealEstate: string; commercialRealEstate: string;
  businessEquity: string; gold: string; alternativeInvestments: string; otherDomesticAssets: string;
  foreignCash: string; foreignInvestments: string; otherOverseasAssets: string;
  mortgageLoans: string; personalLoans: string; businessLoans: string;
  creditLines: string; otherLiabilities: string; taxesPayable: string;
  riskAppetite: string; investmentStyle: string;
  will: string; trust: string; powerOfAttorney: string;
  healthcareDirective: string; beneficiaries: string;
}

const blank: FormData = {
  fullName: "", currentAge: "", country: "", citizenship: "",
  countryOfResidence: "", retirementAge: "",
  cash: "", fixedDeposits: "", stocks: "", mutualFunds: "",
  bonds: "", residentialRealEstate: "", commercialRealEstate: "",
  businessEquity: "", gold: "", alternativeInvestments: "", otherDomesticAssets: "",
  foreignCash: "", foreignInvestments: "", otherOverseasAssets: "",
  mortgageLoans: "", personalLoans: "", businessLoans: "",
  creditLines: "", otherLiabilities: "", taxesPayable: "",
  riskAppetite: "", investmentStyle: "",
  will: "", trust: "", powerOfAttorney: "",
  healthcareDirective: "", beneficiaries: "",
};

function n(v: string) { return parseFloat(String(v).replace(/,/g,"")) || 0; }

function fmt(v: number) {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs/1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000)     return `${sign}$${(abs/1_000_000).toFixed(2)}M`;
  return `${sign}$${abs.toLocaleString("en-US",{minimumFractionDigits:0,maximumFractionDigits:0})}`;
}

function Tip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help inline-block" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs"><p className="text-xs">{text}</p></TooltipContent>
    </Tooltip>
  );
}

function MoneyField({ label, field, value, onChange, tip }: {
  label: string; field: keyof FormData; value: string;
  onChange: (f: keyof FormData, v: string) => void; tip: string;
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
        {label} <Tip text={tip} />
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
        <NumericInput value={value} onChange={e => onChange(field, e.target.value)} className="pl-7" />
      </div>
    </div>
  );
}

function SelectField({ label, field, value, onChange, options, tip }: {
  label: string; field: keyof FormData; value: string;
  onChange: (f: keyof FormData, v: string) => void;
  options: { value: string; label: string }[]; tip: string;
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
        {label} <Tip text={tip} />
      </label>
      <Select value={value} onValueChange={v => onChange(field, v)}>
        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResultRow({ label, value, color = "text-gray-900" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function EstateTaxBlock({ label, wealth }: { label: string; wealth: number }) {
  const taxable = Math.max(0, wealth - ESTATE_EXEMPTION);
  const tax = taxable * ESTATE_TAX_RATE;
  const toHeirs = wealth - tax;
  const hasTax = taxable > 0;

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <div className="bg-gray-50 rounded-lg p-3 space-y-1">
        <ResultRow label="Estate Value" value={fmt(wealth)} />
        <ResultRow label="IRS Exemption" value={fmt(ESTATE_EXEMPTION)} color="text-blue-600" />
        <ResultRow label="Taxable Estate" value={fmt(taxable)} color={hasTax ? "text-amber-600" : "text-green-600"} />
        <ResultRow label="Estate Tax (40%)" value={hasTax ? fmt(tax) : "$0"} color={hasTax ? "text-red-600" : "text-green-600"} />
        <ResultRow label="Net to Heirs" value={fmt(toHeirs)} color="text-green-700" />
      </div>
    </div>
  );
}

const docOptions = [
  { value: "yes", label: "Yes – In Place" },
  { value: "in_progress", label: "In Progress" },
  { value: "no", label: "No" },
];

export default function NetWorthCalc() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(blank);

  const update = (field: keyof FormData, val: string) =>
    setForm(p => ({ ...p, [field]: val }));

  const calc = useMemo(() => {
    const domesticAssets = [
      n(form.cash), n(form.fixedDeposits), n(form.stocks), n(form.mutualFunds),
      n(form.bonds), n(form.residentialRealEstate), n(form.commercialRealEstate),
      n(form.businessEquity), n(form.gold), n(form.alternativeInvestments), n(form.otherDomesticAssets),
    ];
    const overseasAssets = [n(form.foreignCash), n(form.foreignInvestments), n(form.otherOverseasAssets)];
    const totalDomestic = domesticAssets.reduce((a,b) => a+b, 0);
    const totalOverseas = overseasAssets.reduce((a,b) => a+b, 0);
    const totalAssets = totalDomestic + totalOverseas;

    const totalLiabilities =
      n(form.mortgageLoans) + n(form.personalLoans) + n(form.businessLoans) +
      n(form.creditLines) + n(form.otherLiabilities) + n(form.taxesPayable);

    const netWorth = totalAssets - totalLiabilities;
    const currentAge = n(form.currentAge);
    const retirementAge = n(form.retirementAge);

    let growthRate = 0;
    if (form.riskAppetite && form.investmentStyle) {
      growthRate = (RISK_WEIGHT * RISK_RETURNS[form.riskAppetite]) +
                  (STYLE_WEIGHT * STYLE_RETURNS[form.investmentStyle]);
    }

    const yearsToRetirement = retirementAge > currentAge ? retirementAge - currentAge : 0;
    const yearsTo90 = 90 > currentAge ? 90 - currentAge : 0;

    const wealthAtRetirement = netWorth > 0 && growthRate > 0 && yearsToRetirement > 0
      ? netWorth * Math.pow(1 + growthRate, yearsToRetirement) : 0;
    const wealthAt90 = netWorth > 0 && growthRate > 0 && yearsTo90 > 0
      ? netWorth * Math.pow(1 + growthRate, yearsTo90) : 0;

    const allocationCategories = [
      { name: "Cash & Bank", value: n(form.cash) },
      { name: "Fixed Deposits", value: n(form.fixedDeposits) },
      { name: "Stocks", value: n(form.stocks) },
      { name: "Mutual Funds", value: n(form.mutualFunds) },
      { name: "Bonds", value: n(form.bonds) },
      { name: "Residential RE", value: n(form.residentialRealEstate) },
      { name: "Commercial RE", value: n(form.commercialRealEstate) },
      { name: "Business Equity", value: n(form.businessEquity) },
      { name: "Gold & Metals", value: n(form.gold) },
      { name: "Alternatives", value: n(form.alternativeInvestments) },
      { name: "Other Domestic", value: n(form.otherDomesticAssets) },
      { name: "Foreign Cash", value: n(form.foreignCash) },
      { name: "Foreign Investments", value: n(form.foreignInvestments) },
      { name: "Other Overseas", value: n(form.otherOverseasAssets) },
    ].filter(c => c.value > 0);

    const concentrationRisks = totalAssets > 0
      ? allocationCategories.filter(c => (c.value / totalAssets) > 0.6)
      : [];

    const repatriationFunds = n(form.foreignCash) + n(form.foreignInvestments) + n(form.otherOverseasAssets);

    const estateGaps: string[] = [];
    if (form.will === "no") estateGaps.push("No Will in place");
    if (form.will === "in_progress") estateGaps.push("Will is in progress – not finalized");
    if (form.trust === "no") estateGaps.push("No Trust established");
    if (form.trust === "in_progress") estateGaps.push("Trust is in progress – not finalized");
    if (form.powerOfAttorney === "no") estateGaps.push("No Power of Attorney");
    if (form.powerOfAttorney === "in_progress") estateGaps.push("Power of Attorney in progress");
    if (form.healthcareDirective === "no") estateGaps.push("No Healthcare Directive");
    if (form.healthcareDirective === "in_progress") estateGaps.push("Healthcare Directive in progress");

    return {
      totalAssets, totalDomestic, totalOverseas, totalLiabilities, netWorth,
      growthRate, wealthAtRetirement, wealthAt90,
      allocationCategories, concentrationRisks,
      repatriationFunds, estateGaps,
      yearsToRetirement, yearsTo90,
    };
  }, [form]);

  const steps = [
    /* Step 0 – Personal */
    <div key="personal">
      <h3 className="font-semibold text-gray-800 mb-4">Personal Details</h3>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
        <Input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="e.g. John Smith" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            Current Age <Tip text="Your age today in years." />
          </label>
          <NumericInput value={form.currentAge} onChange={e => update("currentAge", e.target.value)} placeholder="e.g. 40" />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
            Retirement Age <Tip text="The age at which you plan to retire. Used to project wealth at retirement." />
          </label>
          <NumericInput value={form.retirementAge} onChange={e => update("retirementAge", e.target.value)} placeholder="e.g. 65" />
        </div>
      </div>
      <SelectField label="Country" field="country" value={form.country} onChange={update}
        options={COUNTRIES.map(c => ({ value: c, label: c }))}
        tip="Country where your primary financial assets are held." />
      <SelectField label="Citizenship" field="citizenship" value={form.citizenship} onChange={update}
        options={COUNTRIES.map(c => ({ value: c, label: c }))}
        tip="Your country of citizenship." />
      <SelectField label="Country of Residence" field="countryOfResidence" value={form.countryOfResidence} onChange={update}
        options={COUNTRIES.map(c => ({ value: c, label: c }))}
        tip="Your current country of residence. Affects tax and compliance analysis." />
    </div>,

    /* Step 1 – Domestic Assets */
    <div key="domestic">
      <h3 className="font-semibold text-gray-800 mb-4">Domestic Assets</h3>
      <MoneyField label="Cash & Bank Balance" field="cash" value={form.cash} onChange={update}
        tip="All cash, checking, savings, and money market accounts in your home country." />
      <MoneyField label="Fixed Deposits" field="fixedDeposits" value={form.fixedDeposits} onChange={update}
        tip="Certificates of deposit, term deposits, and similar fixed-income instruments." />
      <MoneyField label="Stocks" field="stocks" value={form.stocks} onChange={update}
        tip="Current market value of individual stocks held in domestic accounts." />
      <MoneyField label="Mutual Funds" field="mutualFunds" value={form.mutualFunds} onChange={update}
        tip="Net asset value of all domestic mutual fund holdings." />
      <MoneyField label="Bonds" field="bonds" value={form.bonds} onChange={update}
        tip="Face or market value of government and corporate bonds held domestically." />
      <MoneyField label="Residential Real Estate" field="residentialRealEstate" value={form.residentialRealEstate} onChange={update}
        tip="Current market value of your primary home and any residential investment properties." />
      <MoneyField label="Commercial Real Estate" field="commercialRealEstate" value={form.commercialRealEstate} onChange={update}
        tip="Market value of office, retail, industrial, or other commercial property holdings." />
      <MoneyField label="Business Equity" field="businessEquity" value={form.businessEquity} onChange={update}
        tip="Estimated value of your ownership stake in any private or closely-held businesses." />
      <MoneyField label="Gold & Precious Metals" field="gold" value={form.gold} onChange={update}
        tip="Current market value of physical gold, silver, platinum, and other precious metals." />
      <MoneyField label="Alternative Investments" field="alternativeInvestments" value={form.alternativeInvestments} onChange={update}
        tip="Private equity, hedge funds, commodities, cryptocurrency, art, collectibles, and similar assets." />
      <MoneyField label="Other Domestic Assets" field="otherDomesticAssets" value={form.otherDomesticAssets} onChange={update}
        tip="Any other domestic assets not captured above (e.g. vehicles, jewellery)." />
    </div>,

    /* Step 2 – Overseas Assets */
    <div key="overseas">
      <h3 className="font-semibold text-gray-800 mb-4">Overseas Assets</h3>
      <p className="text-sm text-gray-500 mb-4">Include all assets held outside your home country.</p>
      <MoneyField label="Foreign Cash / Bank Balance" field="foreignCash" value={form.foreignCash} onChange={update}
        tip="Cash and deposits held in foreign bank accounts." />
      <MoneyField label="Foreign Investments (stocks, mutual funds, etc.)" field="foreignInvestments" value={form.foreignInvestments} onChange={update}
        tip="Stocks, mutual funds, ETFs, and other securities held in foreign markets." />
      <MoneyField label="Other Overseas Assets (Foreign Real Estate, etc.)" field="otherOverseasAssets" value={form.otherOverseasAssets} onChange={update}
        tip="Foreign real estate, foreign business interests, and any other overseas assets." />
    </div>,

    /* Step 3 – Liabilities */
    <div key="liabilities">
      <h3 className="font-semibold text-gray-800 mb-4">Liabilities</h3>
      <MoneyField label="Mortgage Loans" field="mortgageLoans" value={form.mortgageLoans} onChange={update}
        tip="Total outstanding balance on all home mortgage loans." />
      <MoneyField label="Personal Loans" field="personalLoans" value={form.personalLoans} onChange={update}
        tip="Outstanding balance on personal loans, auto loans, and student loans." />
      <MoneyField label="Business Loans" field="businessLoans" value={form.businessLoans} onChange={update}
        tip="Loans taken for business purposes, including lines of credit for your business." />
      <MoneyField label="Credit Lines" field="creditLines" value={form.creditLines} onChange={update}
        tip="Outstanding balances on home equity lines of credit or other revolving credit facilities." />
      <MoneyField label="Other Liabilities (Credit Cards & Car Loans)" field="otherLiabilities" value={form.otherLiabilities} onChange={update}
        tip="Credit card balances, car loans, and any other debt not categorised above." />
      <MoneyField label="Taxes Payable" field="taxesPayable" value={form.taxesPayable} onChange={update}
        tip="Any estimated or confirmed tax liabilities owed to tax authorities." />
    </div>,

    /* Step 4 – Risk Profile */
    <div key="risk">
      <h3 className="font-semibold text-gray-800 mb-4">Risk Profile</h3>
      <SelectField label="Risk Appetite" field="riskAppetite" value={form.riskAppetite} onChange={update}
        options={[
          { value: "conservative", label: "Conservative (5% return)" },
          { value: "moderate", label: "Moderate (7% return)" },
          { value: "aggressive", label: "Aggressive (10% return)" },
        ]}
        tip="How much investment risk you are willing to accept. Conservative = lower risk/return; Aggressive = higher risk/return." />
      <SelectField label="Investment Style" field="investmentStyle" value={form.investmentStyle} onChange={update}
        options={[
          { value: "income", label: "Income (4% return)" },
          { value: "balanced", label: "Balanced (6% return)" },
          { value: "growth", label: "Growth (8% return)" },
          { value: "speculative", label: "Speculative (12% return)" },
        ]}
        tip="Your preferred approach to investing. Income = dividend focus; Speculative = high-risk high-reward." />
      {form.riskAppetite && form.investmentStyle && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-1">Blended Annual Return</p>
          <p className="text-2xl font-bold text-blue-700">{(calc.growthRate * 100).toFixed(1)}%</p>
          <p className="text-xs text-blue-600 mt-1">
            Risk weight: 70% × {(RISK_RETURNS[form.riskAppetite]*100).toFixed(0)}% +
            Style weight: 30% × {(STYLE_RETURNS[form.investmentStyle]*100).toFixed(0)}%
          </p>
        </div>
      )}
    </div>,

    /* Step 5 – Estate Planning */
    <div key="estate">
      <h3 className="font-semibold text-gray-800 mb-4">Estate Planning</h3>
      <SelectField label="Will" field="will" value={form.will} onChange={update}
        options={docOptions} tip="A legal document specifying how your assets are to be distributed after death." />
      <SelectField label="Trust" field="trust" value={form.trust} onChange={update}
        options={docOptions} tip="A fiduciary arrangement that allows a third party to hold assets on behalf of beneficiaries." />
      <SelectField label="Power of Attorney" field="powerOfAttorney" value={form.powerOfAttorney} onChange={update}
        options={docOptions} tip="A legal document granting someone authority to act on your behalf for financial and legal matters." />
      <SelectField label="Healthcare Directive" field="healthcareDirective" value={form.healthcareDirective} onChange={update}
        options={docOptions} tip="A legal document specifying your medical care preferences if you become incapacitated." />
      <div className="mb-4">
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
          Beneficiaries <Tip text="Names or descriptions of the individuals or entities designated to inherit your estate." />
        </label>
        <Input value={form.beneficiaries} onChange={e => update("beneficiaries", e.target.value)}
          placeholder="e.g. Spouse, Children, Charitable Trust" />
      </div>
    </div>,
  ];

  const hasAnyData = calc.totalAssets > 0 || calc.totalLiabilities > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Wizard */}
      <div>
        {/* Stepper */}
        <div className="mb-5">
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1 text-xs font-medium transition-colors px-1 ${
                    i === step ? "text-primary" : i < step ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                    i === step ? "border-primary bg-primary text-white" :
                    i < step ? "border-green-600 bg-green-600 text-white" :
                    "border-gray-300 text-gray-400"
                  }`}>{i + 1}</span>
                  <span className="hidden md:inline whitespace-nowrap">{s}</span>
                </button>
                {i < STEPS.length - 1 && <div className={`w-4 h-0.5 mx-0.5 flex-shrink-0 ${i < step ? "bg-green-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">Step {step + 1} of {STEPS.length}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {steps[step]}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {step < STEPS.length - 1 && (
                <Button onClick={() => setStep(s => s + 1)} className="flex-1">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Results */}
      <div className="space-y-4">

        {/* Net Worth Summary */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-base font-bold text-gray-900">Net Worth Summary</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {!hasAnyData ? (
              <p className="text-sm text-gray-400 text-center py-6">Enter your assets and liabilities to see your net worth</p>
            ) : (
              <>
                <ResultRow label="Domestic Assets" value={fmt(calc.totalDomestic)} color="text-green-600" />
                <ResultRow label="Overseas Assets" value={fmt(calc.totalOverseas)} color="text-green-600" />
                <ResultRow label="Total Assets" value={fmt(calc.totalAssets)} color="text-green-700" />
                <ResultRow label="Total Liabilities" value={fmt(calc.totalLiabilities)} color="text-red-600" />
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Net Worth</span>
                  <span className={`font-bold text-xl ${calc.netWorth >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {fmt(calc.netWorth)}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Wealth Projections */}
        {calc.growthRate > 0 && calc.netWorth > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-bold text-gray-900">Projected Wealth</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-gray-500 mb-3">
                Blended return: <span className="font-semibold text-blue-700">{(calc.growthRate*100).toFixed(1)}%/yr</span>
              </p>
              {calc.wealthAtRetirement > 0 && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500">At Retirement (Age {form.retirementAge} · {calc.yearsToRetirement} yrs)</p>
                  <p className="text-2xl font-bold text-blue-700 mt-0.5">{fmt(calc.wealthAtRetirement)}</p>
                </div>
              )}
              {calc.wealthAt90 > 0 && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-500">At Age 90 · {calc.yearsTo90} yrs</p>
                  <p className="text-2xl font-bold text-purple-700 mt-0.5">{fmt(calc.wealthAt90)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Estate Tax */}
        {(calc.wealthAtRetirement > 0 || calc.wealthAt90 > 0) && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-bold text-gray-900">Estate Tax Analysis (US)</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-gray-500 mb-3">IRS Exemption: {fmt(ESTATE_EXEMPTION)} · Tax Rate: 40%</p>
              {calc.wealthAtRetirement > 0 && (
                <EstateTaxBlock label={`At Retirement (Age ${form.retirementAge})`} wealth={calc.wealthAtRetirement} />
              )}
              {calc.wealthAt90 > 0 && (
                <EstateTaxBlock label="At Age 90" wealth={calc.wealthAt90} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Asset Allocation Pie */}
        {calc.allocationCategories.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-bold text-gray-900">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={calc.allocationCategories}
                    cx="50%" cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent > 0.06 ? `${(percent*100).toFixed(0)}%` : ""
                    }
                    labelLine={false}
                  >
                    {calc.allocationCategories.map((_, i) => (
                      <Cell key={i} fill={ASSET_PALETTE[i % ASSET_PALETTE.length]} />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(v: number) => [
                      `${fmt(v)} (${calc.totalAssets > 0 ? ((v/calc.totalAssets)*100).toFixed(1) : 0}%)`,
                      ""
                    ]}
                  />
                  <Legend
                    formatter={(value) => <span className="text-xs">{value}</span>}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {calc.concentrationRisks.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {calc.concentrationRisks.map(r => (
                    <div key={r.name} className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                      <span className="text-amber-800 font-medium">Concentration Risk:</span>
                      <span className="text-amber-700">
                        {r.name} is {calc.totalAssets > 0 ? ((r.value/calc.totalAssets)*100).toFixed(0) : 0}% of your portfolio
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Repatriation Funds */}
        {calc.repatriationFunds > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                Repatriation Funds Identified
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="p-3 bg-blue-50 rounded-lg mb-3">
                <p className="text-xs text-gray-500">Total Overseas Assets</p>
                <p className="text-xl font-bold text-blue-700">{fmt(calc.repatriationFunds)}</p>
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Potential Risks & Gaps:</p>
              <div className="space-y-1.5">
                {[
                  { icon: ShieldAlert, text: "Dual Taxation Risk – assets may be taxed in both countries", color: "text-red-700", bg: "bg-red-50 border-red-200" },
                  { icon: FileWarning, text: "Audits & Penalties – undeclared foreign assets may trigger audits", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
                  { icon: AlertTriangle, text: "Compliance Issues – FBAR, FATCA, and local reporting obligations", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
                  { icon: TrendingUp, text: "Idle Capital – overseas funds may not be optimally invested", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
                ].map(({ icon: Icon, text, color, bg }) => (
                  <div key={text} className={`flex items-start gap-2 text-xs border rounded-lg px-3 py-2 ${bg}`}>
                    <Icon className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${color}`} />
                    <span className={color}>{text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estate Planning Gaps */}
        {(form.will || form.trust || form.powerOfAttorney || form.healthcareDirective) && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base font-bold text-gray-900">Estate Planning Status</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {[
                  { label: "Will", val: form.will },
                  { label: "Trust", val: form.trust },
                  { label: "Power of Attorney", val: form.powerOfAttorney },
                  { label: "Healthcare Directive", val: form.healthcareDirective },
                ].map(({ label, val }) => {
                  if (!val) return null;
                  const isGood = val === "yes";
                  const isWarning = val === "in_progress";
                  return (
                    <div key={label} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${isGood ? "bg-green-50" : isWarning ? "bg-amber-50" : "bg-red-50"}`}>
                      {isGood
                        ? <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        : isWarning
                        ? <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                        : <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      }
                      <span className={`font-medium ${isGood ? "text-green-700" : isWarning ? "text-amber-700" : "text-red-700"}`}>
                        {label}
                      </span>
                      <span className={`ml-auto text-xs ${isGood ? "text-green-600" : isWarning ? "text-amber-600" : "text-red-600"}`}>
                        {isGood ? "In Place" : isWarning ? "In Progress" : "Missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
              {calc.estateGaps.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Planning Gaps Detected
                  </p>
                  <ul className="space-y-1">
                    {calc.estateGaps.map(g => (
                      <li key={g} className="text-xs text-red-600 flex items-start gap-1.5">
                        <span className="mt-1 flex-shrink-0">•</span>{g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {form.beneficiaries && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Beneficiaries</p>
                  <p className="text-sm text-gray-800 mt-0.5">{form.beneficiaries}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <CalculatorCTAs />
      </div>
    </div>
  );
}
