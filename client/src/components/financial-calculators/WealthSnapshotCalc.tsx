import { useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { NumericInput } from "@/components/ui/numeric-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  HelpCircle,
  CheckCircle2,
  TrendingUp,
  Building2,
  Globe2,
  CreditCard,
  ShieldCheck,
  ScrollText,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import CalculatorCTAs from "./CalculatorCTAs";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "assets", label: "Assets", icon: Building2 },
  { id: "nondom", label: "Non-Domicile", icon: Globe2 },
  { id: "liabilities", label: "Liabilities", icon: CreditCard },
  { id: "risk", label: "Risk Profile", icon: ShieldCheck },
  { id: "estate", label: "Estate Planning", icon: ScrollText },
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India",
  "Singapore", "United Arab Emirates", "Hong Kong", "Germany", "France",
  "Switzerland", "Japan", "China", "Brazil", "South Africa", "New Zealand",
  "Netherlands", "Sweden", "Norway", "Denmark", "Ireland", "Spain", "Italy",
  "Portugal", "Belgium", "Mexico", "Argentina", "Saudi Arabia", "Qatar",
  "Kuwait", "Bahrain", "Oman", "Malaysia", "Indonesia", "Philippines",
  "Thailand", "South Korea", "Israel", "Turkey", "Egypt", "Nigeria", "Kenya",
  "Ghana", "Other",
];

const US_BANKS = [
  "JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank",
  "Capital One", "PNC Bank", "TD Bank", "U.S. Bank", "Truist",
  "Goldman Sachs (Marcus)", "Other",
];

const ACCOUNT_TYPES = ["Checking", "Savings", "Money Market", "CD/FD", "Other"];
const INVESTMENT_TYPES = ["Stocks", "Mutual Funds", "Bonds", "Other"];
const PROPERTY_TYPES = ["Land", "Vacation Home", "Secondary Residence", "Other"];

const GROWTH_RATES: Record<string, number> = {
  conservative: 0.05,
  moderate: 0.07,
  aggressive: 0.1,
};

const STYLE_RATES: Record<string, number> = {
  income: 0.04,
  balanced: 0.06,
  growth: 0.08,
  speculative: 0.12,
};

const RISK_WEIGHT = 0.7;
const STYLE_WEIGHT = 0.3;

const PIE_COLORS = [
  "#1e5fad", "#0a7c59", "#2eaad1", "#6366f1", "#f59e0b",
  "#10b981", "#ef4444", "#8b5cf6", "#f97316", "#14b8a6",
  "#e11d48", "#0891b2",
];

const COLOR_DOM = "#1e5fad";
const COLOR_NONDOM = "#0a7c59";
const COLOR_LIB = "#ef4444";

// Bar chart colors matched to projection milestone card colors
const BAR_COLOR_NOW = "#16a34a";        // green  — matches Now card
const BAR_COLOR_RETIREMENT = "#1e5fad"; // primary — matches custom retirement card
const BAR_COLOR_65 = "#3b82f6";         // blue   — matches 65Y card
const BAR_COLOR_75 = "#0d9488";         // teal   — matches 75Y card
const BAR_COLOR_85 = "#7c3aed";         // purple — matches 85Y card

function getBarFill(label: string): string {
  if (label.startsWith("Now")) return BAR_COLOR_NOW;
  if (label === "Age 65") return BAR_COLOR_65;
  if (label === "Age 75") return BAR_COLOR_75;
  if (label === "Age 85") return BAR_COLOR_85;
  return BAR_COLOR_RETIREMENT;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface BankAccount { bankName: string; accountType: string; amount: string; }
interface InvestmentRow { investmentType: string; amount: string; }
interface RealEstateRow { propertyType: string; addressCity: string; amount: string; }
interface BusinessRow { businessName: string; equityValue: string; equityPercent: string; }

interface Form {
  fullName: string;
  currentAge: string;
  citizenship: string;
  taxDomicile: string;
  plannedRetirementAge: string;
  // Assets — single fields
  primaryResidential: string;
  personalProperties: string;
  retirement401k: string;
  iraBalance: string;
  lifeInsuranceCashValue: string;
  // Non-Domicile
  foreignCashBank: string;
  foreignRealEstate: string;
  anyOtherAssets: string;
  // Liabilities
  mortgageLoans: string;
  personalLoans: string;
  businessLoans: string;
  creditLines: string;
  otherLiabilities: string;
  taxesPayable: string;
  // Risk
  roiMode: "risk" | "manual";
  riskAppetite: string;
  investmentStyle: string;
  expectedReturnRate: string;
  annualSavings: string;
  // Estate
  will: boolean | null;
  trust: boolean | null;
  powerOfAttorney: boolean | null;
  healthcareDirective: boolean | null;
}

interface PersonalErrors {
  fullName?: string;
  currentAge?: string;
  citizenship?: string;
  taxDomicile?: string;
  plannedRetirementAge?: string;
}

const defaultForm: Form = {
  fullName: "",
  currentAge: "",
  citizenship: "",
  taxDomicile: "",
  plannedRetirementAge: "",
  primaryResidential: "0",
  personalProperties: "0",
  retirement401k: "0",
  iraBalance: "0",
  lifeInsuranceCashValue: "0",
  foreignCashBank: "0",
  foreignRealEstate: "0",
  anyOtherAssets: "0",
  mortgageLoans: "0",
  personalLoans: "0",
  businessLoans: "0",
  creditLines: "0",
  otherLiabilities: "0",
  taxesPayable: "0",
  roiMode: "risk",
  riskAppetite: "",
  investmentStyle: "",
  expectedReturnRate: "0",
  annualSavings: "0",
  will: null,
  trust: null,
  powerOfAttorney: null,
  healthcareDirective: null,
};

const defaultBankAccount = (): BankAccount => ({ bankName: "", accountType: "", amount: "" });
const defaultInvestment = (): InvestmentRow => ({ investmentType: "", amount: "" });
const defaultRealEstate = (): RealEstateRow => ({ propertyType: "", addressCity: "", amount: "" });
const defaultBusiness = (): BusinessRow => ({ businessName: "", equityValue: "", equityPercent: "" });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function n(v: string) {
  return parseFloat(String(v).replace(/,/g, "")) || 0;
}

function fmt(num: number) {
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  return (num < 0 ? "-$" : "$") + Math.round(abs).toLocaleString("en-US");
}

function fmtFull(num: number) {
  return (num < 0 ? "-$" : "$") + Math.round(Math.abs(num)).toLocaleString("en-US");
}

function fv(pv: number, pmt: number, rate: number, years: number) {
  if (years <= 0) return pv;
  if (rate === 0) return pv + pmt * years;
  return (
    pv * Math.pow(1 + rate, years) +
    pmt * ((Math.pow(1 + rate, years) - 1) / rate)
  );
}

function deriveCountryOfTaxation(citizenship: string, taxDomicile: string): string {
  if (!citizenship && !taxDomicile) return "";
  if (citizenship === "United States") return "United States";
  if (taxDomicile) return taxDomicile;
  return citizenship;
}

// ─── Shared UI (defined outside to prevent remount on re-render) ───────────────

function FL({ label, tooltip }: { label: string; tooltip?: string }) {
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

function MF({
  label, value, onChange, tooltip,
}: {
  label: string; value: string; onChange: (v: string) => void; tooltip?: string;
}) {
  return (
    <div>
      <FL label={label} tooltip={tooltip} />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">$</span>
        <NumericInput className="pl-7" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" />
      </div>
    </div>
  );
}

function QAField({
  question, description, value, onChange, tooltip, error,
}: {
  question: string; description: string; value: string; onChange: (v: string) => void; tooltip?: string; error?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{question}</label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-1">{description}</p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">$</span>
        <NumericInput
          className={`pl-7 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function QAFieldPercent({
  question, description, value, onChange, tooltip,
}: {
  question: string; description: string; value: string; onChange: (v: string) => void; tooltip?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{question}</label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-1">{description}</p>
      <div className="relative">
        <NumericInput className="pr-8" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">%</span>
      </div>
    </div>
  );
}

function QAFieldText({
  question, description, value, onChange, placeholder, tooltip, error,
}: {
  question: string; description: string; value: string; onChange: (v: string) => void;
  placeholder?: string; tooltip?: string; error?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{question}</label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-1">{description}</p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function QAFieldNumber({
  question, description, value, onChange, placeholder, allowDecimal, tooltip, error,
}: {
  question: string; description: string; value: string; onChange: (v: string) => void;
  placeholder?: string; allowDecimal?: boolean; tooltip?: string; error?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{question}</label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-1">{description}</p>
      <NumericInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        allowDecimal={allowDecimal}
        className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function QAFieldSelect({
  question, description, tooltip, children, error,
}: {
  question: string; description: string; tooltip?: string; children: ReactNode; error?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{question}</label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-1">{description}</p>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function PF({ label, value, onChange, tooltip }: { label: string; value: string; onChange: (v: string) => void; tooltip?: string; }) {
  return (
    <div>
      <FL label={label} tooltip={tooltip} />
      <div className="relative">
        <NumericInput className="pr-8" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium pointer-events-none">%</span>
      </div>
    </div>
  );
}

function YesNo({ label, value, onChange, tooltip }: { label: string; value: boolean | null; onChange: (v: boolean) => void; tooltip?: string; }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-100 last:border-b-0">
      <FL label={label} tooltip={tooltip} />
      <div className="flex gap-2 flex-shrink-0">
        {([true, false] as const).map((b) => (
          <button
            key={String(b)}
            type="button"
            onClick={() => onChange(b)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              value === b
                ? b
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {b ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

function TabBtn({
  id, label, icon: Icon, active, completed, onClick,
}: {
  id: string; label: string; icon: React.ElementType; active: boolean; completed: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : completed
            ? "bg-green-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function ResultRow({ label, value, color = "text-gray-900", bold = false }: { label: string; value: string; color?: string; bold?: boolean; }) {
  return (
    <div className={`flex justify-between items-center py-1.5 border-b border-gray-100 last:border-b-0 ${bold ? "border-t border-gray-200 pt-2 mt-1" : ""}`}>
      <span className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-600"}`}>{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function ProjectionCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string; }) {
  return (
    <div className={`rounded-lg p-3 text-center border ${color}`}>
      <p className="text-xs text-gray-500 mb-0.5 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WealthSnapshotCalc() {
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState<Form>(defaultForm);
  const [personalErrors, setPersonalErrors] = useState<PersonalErrors>({});
  const [incompleteDialog, setIncompleteDialog] = useState(false);
  const [pendingTabIndex, setPendingTabIndex] = useState<number | null>(null);

  const set = (k: keyof Form, v: string | boolean | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setCitizenship = (v: string) =>
    setForm((f) => ({ ...f, citizenship: v, taxDomicile: v }));

  const setRoiMode = (mode: "risk" | "manual") =>
    setForm((f) => ({
      ...f,
      roiMode: mode,
      ...(mode === "manual"
        ? { riskAppetite: "", investmentStyle: "" }
        : { expectedReturnRate: "0" }),
    }));

  // ── Dynamic asset arrays ──────────────────────────────────────────────────
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([defaultBankAccount()]);
  const [investments, setInvestments] = useState<InvestmentRow[]>([defaultInvestment()]);
  const [otherRealEstate, setOtherRealEstate] = useState<RealEstateRow[]>([defaultRealEstate()]);
  const [businessEquity, setBusinessEquity] = useState<BusinessRow[]>([defaultBusiness()]);

  const totalCashBank = bankAccounts.reduce((sum, b) => sum + n(b.amount), 0);
  const totalInvestments = investments.reduce((sum, i) => sum + n(i.amount), 0);
  const totalOtherRealEstate = otherRealEstate.reduce((sum, r) => sum + n(r.amount), 0);
  const totalBusinessEquity = businessEquity.reduce((sum, b) => sum + n(b.equityValue), 0);

  // Bank account helpers
  const addBankAccount = () => setBankAccounts((a) => [...a, defaultBankAccount()]);
  const removeBankAccount = (i: number) =>
    setBankAccounts((a) => a.length > 1 ? a.filter((_, idx) => idx !== i) : [defaultBankAccount()]);
  const updateBankAccount = (i: number, field: keyof BankAccount, v: string) =>
    setBankAccounts((a) => a.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  // Investment helpers
  const addInvestment = () => setInvestments((a) => [...a, defaultInvestment()]);
  const removeInvestment = (i: number) =>
    setInvestments((a) => a.length > 1 ? a.filter((_, idx) => idx !== i) : [defaultInvestment()]);
  const updateInvestment = (i: number, field: keyof InvestmentRow, v: string) =>
    setInvestments((a) => a.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  // Real estate helpers
  const addRealEstate = () => setOtherRealEstate((a) => [...a, defaultRealEstate()]);
  const removeRealEstate = (i: number) =>
    setOtherRealEstate((a) => a.length > 1 ? a.filter((_, idx) => idx !== i) : [defaultRealEstate()]);
  const updateRealEstate = (i: number, field: keyof RealEstateRow, v: string) =>
    setOtherRealEstate((a) => a.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  // Business equity helpers
  const addBusiness = () => setBusinessEquity((a) => [...a, defaultBusiness()]);
  const removeBusiness = (i: number) =>
    setBusinessEquity((a) => a.length > 1 ? a.filter((_, idx) => idx !== i) : [defaultBusiness()]);
  const updateBusiness = (i: number, field: keyof BusinessRow, v: string) =>
    setBusinessEquity((a) => a.map((x, idx) => idx === i ? { ...x, [field]: v } : x));

  // ── Calculations ──────────────────────────────────────────────────────────

  const totalDomAssets =
    totalCashBank +
    totalInvestments +
    n(form.primaryResidential) +
    totalOtherRealEstate +
    totalBusinessEquity +
    n(form.personalProperties) +
    n(form.retirement401k) +
    n(form.iraBalance) +
    n(form.lifeInsuranceCashValue);

  const totalNonDomAssets =
    n(form.foreignCashBank) +
    n(form.foreignRealEstate) +
    n(form.anyOtherAssets);

  const totalLiabilities =
    n(form.mortgageLoans) +
    n(form.personalLoans) +
    n(form.businessLoans) +
    n(form.creditLines) +
    n(form.otherLiabilities) +
    n(form.taxesPayable);

  const totalAssets = totalDomAssets + totalNonDomAssets;
  const netWorth = totalAssets - totalLiabilities;

  const currentAge = parseInt(form.currentAge) || 0;
  const retirementAge = parseInt(form.plannedRetirementAge) || 0;
  const annualSavingsAmount = n(form.annualSavings); // used only in projections

  const riskReturn = GROWTH_RATES[form.riskAppetite] ?? null;
  const styleReturn = STYLE_RATES[form.investmentStyle] ?? null;
  const customRate = n(form.expectedReturnRate) / 100;
  const effectiveRate =
    form.roiMode === "manual"
      ? customRate
      : riskReturn !== null && styleReturn !== null
        ? RISK_WEIGHT * riskReturn + STYLE_WEIGHT * styleReturn
        : riskReturn !== null
          ? riskReturn
          : styleReturn !== null
            ? styleReturn
            : 0;

  const projAt = (age: number) => {
    const yrs = Math.max(0, age - currentAge);
    return fv(Math.max(0, netWorth), annualSavingsAmount, effectiveRate, yrs);
  };

  const proj65 = projAt(65);
  const proj75 = projAt(75);
  const proj85 = projAt(85);
  const projRetirement = retirementAge > 0 ? projAt(retirementAge) : null;

  const projectionBars =
    currentAge > 0
      ? [
          { label: `Now (${currentAge})`, value: Math.max(0, netWorth) },
          ...(retirementAge > currentAge && retirementAge !== 65 && retirementAge !== 75 && retirementAge !== 85
            ? [{ label: `Age ${retirementAge}`, value: Math.max(0, projRetirement ?? 0) }]
            : []),
          ...(65 > currentAge ? [{ label: "Age 65", value: proj65 }] : []),
          ...(75 > currentAge ? [{ label: "Age 75", value: proj75 }] : []),
          ...(85 > currentAge ? [{ label: "Age 85", value: proj85 }] : []),
        ]
      : [];

  const overviewPie = [
    { name: "Domestic Assets", value: totalDomAssets },
    { name: "Non-Domicile Assets", value: totalNonDomAssets },
    { name: "Liabilities", value: totalLiabilities },
  ].filter((d) => d.value > 0);

  const domBreakdownPie = [
    { name: "Cash & Bank", value: totalCashBank },
    { name: "Investments", value: totalInvestments },
    { name: "Primary Residence", value: n(form.primaryResidential) },
    { name: "Other Real Estate", value: totalOtherRealEstate },
    { name: "Business Equity", value: totalBusinessEquity },
    { name: "Personal Properties", value: n(form.personalProperties) },
    { name: "401(K)", value: n(form.retirement401k) },
    { name: "IRA", value: n(form.iraBalance) },
    { name: "Life Insurance", value: n(form.lifeInsuranceCashValue) },
  ].filter((d) => d.value > 0);

  const estateItems = [form.will, form.trust, form.powerOfAttorney, form.healthcareDirective];
  const estateScore = estateItems.filter((v) => v === true).length;

  const tabCompleted: Record<string, boolean> = {
    personal: !!(form.fullName && form.currentAge && form.citizenship && form.plannedRetirementAge),
    assets: [
      ...bankAccounts.map((b) => b.amount),
      ...investments.map((i) => i.amount),
      form.primaryResidential,
      ...otherRealEstate.map((r) => r.amount),
      ...businessEquity.map((b) => b.equityValue),
      form.personalProperties,
      form.retirement401k,
      form.iraBalance,
      form.lifeInsuranceCashValue,
    ].some((v) => n(v) > 0),
    nondom: [form.foreignCashBank, form.foreignRealEstate, form.anyOtherAssets].some((v) => n(v) > 0),
    liabilities: [
      form.mortgageLoans, form.personalLoans, form.businessLoans,
      form.creditLines, form.otherLiabilities, form.taxesPayable,
    ].some((v) => n(v) > 0),
    risk:
      form.roiMode === "manual"
        ? n(form.expectedReturnRate) > 0
        : !!(form.riskAppetite || form.investmentStyle),
    estate: estateItems.some((v) => v !== null),
  };

  // ── Navigation ───────────────────────────────────────────────────────────
  const activeTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const goPrev = () => activeTabIndex > 0 && setActiveTab(TABS[activeTabIndex - 1].id);

  const goNext = () => {
    const nextIndex = activeTabIndex + 1;
    if (nextIndex >= TABS.length) return;

    // Req 2: Hard validation on Personal tab
    if (activeTab === "personal") {
      const errors: PersonalErrors = {};
      if (!form.fullName.trim()) errors.fullName = "This field is required";
      if (!form.currentAge) errors.currentAge = "This field is required";
      if (!form.citizenship) errors.citizenship = "This field is required";
      if (!form.taxDomicile) errors.taxDomicile = "This field is required";
      if (!form.plannedRetirementAge) errors.plannedRetirementAge = "This field is required";
      if (Object.keys(errors).length > 0) {
        setPersonalErrors(errors);
        return;
      }
      setPersonalErrors({});
    }

    // Req 6: Soft warning for incomplete sections
    const warnTabs = ["assets", "nondom", "liabilities", "risk"];
    if (warnTabs.includes(activeTab) && !tabCompleted[activeTab]) {
      setPendingTabIndex(nextIndex);
      setIncompleteDialog(true);
      return;
    }

    setActiveTab(TABS[nextIndex].id);
  };

  // ── Tab render functions (called as functions to prevent React remount) ──

  const renderPersonal = () => {
    const countryOfTaxation = deriveCountryOfTaxation(form.citizenship, form.taxDomicile);
    return (
      <div className="space-y-1">
        <QAFieldText
          question="What is your full name?"
          description="Enter your legal name as it appears on official documents."
          value={form.fullName}
          onChange={(v) => { set("fullName", v); if (personalErrors.fullName) setPersonalErrors((e) => ({ ...e, fullName: undefined })); }}
          placeholder="e.g. John Smith"
          error={personalErrors.fullName}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {/* Inline both fields so we can enforce equal label-area height */}
          {[
            {
              question: "How old are you?",
              description: "Your current age in years.",
              value: form.currentAge,
              onChange: (v: string) => { set("currentAge", v); if (personalErrors.currentAge) setPersonalErrors((e) => ({ ...e, currentAge: undefined })); },
              placeholder: "e.g. 45",
              tooltip: "Your age determines how many years remain until ages 65, 75 and 85.",
              error: personalErrors.currentAge,
            },
            {
              question: "At what age do you plan to retire?",
              description: "Adds a personalised milestone to your projections.",
              value: form.plannedRetirementAge,
              onChange: (v: string) => { set("plannedRetirementAge", v); if (personalErrors.plannedRetirementAge) setPersonalErrors((e) => ({ ...e, plannedRetirementAge: undefined })); },
              placeholder: "e.g. 60",
              tooltip: "A custom retirement milestone card will appear in the projections panel.",
              error: personalErrors.plannedRetirementAge,
            },
          ].map((field) => (
            <div key={field.question} className="mb-5 flex flex-col">
              <div className="flex items-start gap-2 mb-1 min-h-[3rem]">
                <label className="text-sm font-medium text-gray-700">{field.question}</label>
                {field.tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0 mt-0.5" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">{field.tooltip}</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-1 min-h-[2rem]">{field.description}</p>
              <NumericInput
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                allowDecimal={false}
                className={field.error ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {field.error && <p className="text-xs text-red-500 mt-1">{field.error}</p>}
            </div>
          ))}
        </div>
        <QAFieldSelect
          question="What is your country of citizenship / tax residency?"
          description="US citizens are subject to US taxation on worldwide income regardless of where they live. Selecting your citizenship pre-fills your tax domicile — adjust below if they differ."
          tooltip="US citizens owe US tax on all worldwide income. Your citizenship determines the initial tax domicile assignment."
          error={personalErrors.citizenship}
        >
          <Select value={form.citizenship} onValueChange={(v) => { setCitizenship(v); setPersonalErrors((e) => ({ ...e, citizenship: undefined, taxDomicile: undefined })); }}>
            <SelectTrigger className={personalErrors.citizenship ? "border-red-500" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </QAFieldSelect>
        <QAFieldSelect
          question="What is your tax domicile country?"
          description="The country where you are primarily taxed. Auto-matched to your citizenship — adjust here if they differ."
          tooltip="Tax domicile affects how non-domicile assets are treated in your financial plan."
          error={personalErrors.taxDomicile}
        >
          <Select value={form.taxDomicile} onValueChange={(v) => { set("taxDomicile", v); setPersonalErrors((e) => ({ ...e, taxDomicile: undefined })); }}>
            <SelectTrigger className={personalErrors.taxDomicile ? "border-red-500" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.citizenship && form.taxDomicile === form.citizenship && (
            <p className="text-xs text-green-600 mt-1">Auto-matched to Citizenship</p>
          )}
        </QAFieldSelect>

        {/* Req 1: Country of Taxation read-only output */}
        {countryOfTaxation && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm font-medium text-gray-700">Country of Taxation</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Derived from your citizenship and tax domicile. US citizens are taxed on worldwide income regardless of residence.
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-gray-400 mb-1">Derived from your citizenship and residency. Read-only.</p>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-blue-800">{countryOfTaxation}</span>
            </div>
          </div>
        )}

        {form.currentAge && parseInt(form.currentAge) > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            Projections will be shown at ages 65, 75 &amp; 85
            {form.plannedRetirementAge && parseInt(form.plannedRetirementAge) > 0
              && `, plus your planned retirement at age ${form.plannedRetirementAge}`}.
          </div>
        )}
      </div>
    );
  };

  const renderAssets = () => (
    <div className="space-y-3">

      {/* a. Cash & Bank Balances */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-700">
            What is the value of your cash &amp; bank balances?
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              Include all checking, savings, money market, and CD accounts.
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          Add each account separately — bank, type, and balance. A total will be calculated automatically.
        </p>
        <div className="space-y-3">
          {bankAccounts.map((acct, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Bank Name</label>
                  <Select value={acct.bankName} onValueChange={(v) => updateBankAccount(i, "bankName", v)}>
                    <SelectTrigger className="h-9 text-sm bg-white">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Account Type</label>
                  <Select value={acct.accountType} onValueChange={(v) => updateBankAccount(i, "accountType", v)}>
                    <SelectTrigger className="h-9 text-sm bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">$</span>
                  <NumericInput
                    className="pl-7 h-9 text-sm bg-white"
                    value={acct.amount}
                    onChange={(e) => updateBankAccount(i, "amount", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeBankAccount(i)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Remove account"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBankAccount}
          className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Another Account
        </button>
        {totalCashBank > 0 && (
          <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-md">
            <span className="text-xs text-blue-700 font-medium">Total Cash &amp; Bank Balance</span>
            <span className="text-sm font-bold text-primary">{fmtFull(totalCashBank)}</span>
          </div>
        )}
      </div>

      {/* b. Investments */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-700">
            Total market value of your investments (stocks, mutual funds, bonds)?
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              Listed equities, ETFs, mutual fund NAV, government and corporate bonds at current market value.
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-xs text-gray-400 mb-2">Add each investment type separately.</p>
        <div className="space-y-2">
          {investments.map((inv, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Investment Type</label>
                  <Select value={inv.investmentType} onValueChange={(v) => updateInvestment(i, "investmentType", v)}>
                    <SelectTrigger className="h-9 text-sm bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Amount ($)</label>
                  <div className="flex items-center gap-1">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">$</span>
                      <NumericInput
                        className="pl-7 h-9 text-sm bg-white"
                        value={inv.amount}
                        onChange={(e) => updateInvestment(i, "amount", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInvestment(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addInvestment}
          className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Another Investment Type
        </button>
        {totalInvestments > 0 && (
          <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-md">
            <span className="text-xs text-blue-700 font-medium">Total Investments</span>
            <span className="text-sm font-bold text-primary">{fmtFull(totalInvestments)}</span>
          </div>
        )}
      </div>

      <QAField
        question="What is the value of your Primary Residence?"
        description="Current market value of your primary home or residence."
        value={form.primaryResidential}
        onChange={(v) => set("primaryResidential", v)}
        tooltip="Current market value of your primary home."
      />

      {/* c. Other Real Estate */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-700">
            What is the total value of your other real estate?
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              Investment properties, land, vacation homes, or secondary residences.
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-xs text-gray-400 mb-2">Add each property separately.</p>
        <div className="space-y-3">
          {otherRealEstate.map((prop, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Property Type</label>
                  <Select value={prop.propertyType} onValueChange={(v) => updateRealEstate(i, "propertyType", v)}>
                    <SelectTrigger className="h-9 text-sm bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Address / City</label>
                  <Input
                    className="h-9 text-sm bg-white"
                    value={prop.addressCity}
                    onChange={(e) => updateRealEstate(i, "addressCity", e.target.value)}
                    placeholder="e.g. Miami, FL"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">$</span>
                  <NumericInput
                    className="pl-7 h-9 text-sm bg-white"
                    value={prop.amount}
                    onChange={(e) => updateRealEstate(i, "amount", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRealEstate(i)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRealEstate}
          className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Another Property
        </button>
        {totalOtherRealEstate > 0 && (
          <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-md">
            <span className="text-xs text-blue-700 font-medium">Total Real Estate Value</span>
            <span className="text-sm font-bold text-primary">{fmtFull(totalOtherRealEstate)}</span>
          </div>
        )}
      </div>

      {/* d. Business Equity */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm font-medium text-gray-700">
            What is your equity in the business?
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              Your ownership stake or share value in any private businesses.
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-xs text-gray-400 mb-2">Add each business separately.</p>
        <div className="space-y-3">
          {businessEquity.map((biz, i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Business Name</label>
                <Input
                  className="h-9 text-sm bg-white"
                  value={biz.businessName}
                  onChange={(e) => updateBusiness(i, "businessName", e.target.value)}
                  placeholder="e.g. Smith Consulting LLC"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Equity Value ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">$</span>
                    <NumericInput
                      className="pl-7 h-9 text-sm bg-white"
                      value={biz.equityValue}
                      onChange={(e) => updateBusiness(i, "equityValue", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Equity %</label>
                  <div className="flex items-center gap-1">
                    <div className="relative flex-1">
                      <NumericInput
                        className="pr-8 h-9 text-sm bg-white"
                        value={biz.equityPercent}
                        onChange={(e) => updateBusiness(i, "equityPercent", e.target.value)}
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBusiness(i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBusiness}
          className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Another Business
        </button>
        {totalBusinessEquity > 0 && (
          <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-blue-50 rounded-md">
            <span className="text-xs text-blue-700 font-medium">Total Business Equity</span>
            <span className="text-sm font-bold text-primary">{fmtFull(totalBusinessEquity)}</span>
          </div>
        )}
      </div>

      <QAField
        question="What is the value of your Personal Properties (gold &amp; precious metals etc)?"
        description="Physical gold, silver, jewellery, collectibles, and other tangible personal assets."
        value={form.personalProperties}
        onChange={(v) => set("personalProperties", v)}
        tooltip="Physical gold, silver, jewellery, and precious metals."
      />
      <Separator className="my-1" />
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        Retirement &amp; Insurance Accounts
      </p>
      <QAField
        question="What is your 401(K) Balance?"
        description="Current balance of your 401(k) employer-sponsored retirement savings account."
        value={form.retirement401k}
        onChange={(v) => set("retirement401k", v)}
        tooltip="The current market value of your 401(k) account, including employer contributions."
      />
      <QAField
        question="What is your IRA Balance?"
        description="Combined balance across Traditional, Roth, or SEP-IRA accounts at current market value."
        value={form.iraBalance}
        onChange={(v) => set("iraBalance", v)}
        tooltip="Individual Retirement Account balance — includes Traditional, Roth, SIMPLE, and SEP-IRA."
      />
      <QAField
        question="What is the cash value of your Life Insurance policies?"
        description="Surrender or cash value of whole life, universal life, or variable life insurance policies."
        value={form.lifeInsuranceCashValue}
        onChange={(v) => set("lifeInsuranceCashValue", v)}
        tooltip="The amount you would receive if you surrendered your life insurance policy today."
      />
      {totalDomAssets > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-blue-700 font-medium">Total Domestic Assets</span>
          <span className="text-base font-bold text-primary">{fmtFull(totalDomAssets)}</span>
        </div>
      )}
    </div>
  );

  const renderNonDom = () => (
    <div className="space-y-1">
      <p className="text-xs text-gray-500 mb-2">
        Enter the USD-equivalent value of assets held outside your home country.
      </p>
      <QAField
        question="What is the value of your Foreign Cash &amp; Bank Balances?"
        description="Offshore bank accounts and foreign currency holdings, in USD equivalent."
        value={form.foreignCashBank}
        onChange={(v) => set("foreignCashBank", v)}
        tooltip="Include all offshore or foreign-held bank accounts, savings, and cash equivalents."
      />
      <QAField
        question="What is the value of your Foreign Real Estate?"
        description="Properties and real estate held outside your home country, in USD equivalent."
        value={form.foreignRealEstate}
        onChange={(v) => set("foreignRealEstate", v)}
        tooltip="Market value of any property you own in a foreign country."
      />
      <QAField
        question="What is the value of any other Foreign Assets?"
        description="Foreign investments, businesses, trusts, or any other international assets in USD equivalent."
        value={form.anyOtherAssets}
        onChange={(v) => set("anyOtherAssets", v)}
        tooltip="Any remaining assets held internationally not captured above."
      />
      {totalNonDomAssets > 0 && (
        <div className="p-3 bg-teal-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-teal-700 font-medium">Total Non-Domicile Assets</span>
          <span className="text-base font-bold text-secondary">{fmtFull(totalNonDomAssets)}</span>
        </div>
      )}
    </div>
  );

  const renderLiabilities = () => (
    <div>
      <QAField
        question="What is your outstanding Mortgage Loan balance?"
        description="Total remaining balance on all home or property mortgage loans."
        value={form.mortgageLoans}
        onChange={(v) => set("mortgageLoans", v)}
        tooltip="Outstanding balance on all home loans and mortgages."
      />
      <QAField
        question="What are your outstanding Personal Loans?"
        description="Unsecured personal loans, consumer credit, student loans, and auto loans."
        value={form.personalLoans}
        onChange={(v) => set("personalLoans", v)}
        tooltip="Unsecured personal loans and consumer credit."
      />
      <QAField
        question="What are your outstanding Business Loans?"
        description="Any loans or financing tied to your business or business operations."
        value={form.businessLoans}
        onChange={(v) => set("businessLoans", v)}
        tooltip="Outstanding loans tied to your business."
      />
      <QAField
        question="What are your outstanding Credit Lines?"
        description="Home equity lines of credit, margin accounts, and revolving credit balances."
        value={form.creditLines}
        onChange={(v) => set("creditLines", v)}
        tooltip="Home equity lines, margin accounts, and revolving credit."
      />
      <QAField
        question="What are your other Liabilities?"
        description="Credit card balances, car loans, medical bills, and any remaining debts."
        value={form.otherLiabilities}
        onChange={(v) => set("otherLiabilities", v)}
        tooltip="Credit card balances, car loans, and any other debts."
      />
      <QAField
        question="What is the amount of Taxes Payable?"
        description="Estimated taxes owed but not yet paid, including income, property, or capital gains tax."
        value={form.taxesPayable}
        onChange={(v) => set("taxesPayable", v)}
        tooltip="Estimated taxes owed but not yet paid."
      />
      {totalLiabilities > 0 && (
        <div className="p-3 bg-red-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-red-700 font-medium">Total Liabilities</span>
          <span className="text-base font-bold text-red-600">{fmtFull(totalLiabilities)}</span>
        </div>
      )}
    </div>
  );

  const renderRisk = () => {
    const appetiteOpts = [
      { value: "conservative", label: "🛡️ Conservative", desc: "Capital preservation — 5% base return p.a." },
      { value: "moderate", label: "⚖️ Moderate", desc: "Balanced approach — 7% base return p.a." },
      { value: "aggressive", label: "🚀 Aggressive", desc: "Growth-focused — 10% base return p.a." },
    ];
    const styleOpts = [
      { value: "income", label: "Income", desc: "Regular dividends & cash flow — 4% p.a." },
      { value: "balanced", label: "Balanced", desc: "Mix of income & capital growth — 6% p.a." },
      { value: "growth", label: "Growth", desc: "Long-term capital appreciation — 8% p.a." },
      { value: "speculative", label: "Speculative", desc: "High-risk, high-reward strategies — 12% p.a." },
    ];
    return (
      <div className="space-y-5">
        {/* Req 4: Annual Savings */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-gray-700">What is your annual savings?</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                The amount you save each year. Used only in retirement projections — not included in your current net worth.
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Used only for retirement projections at Planned Retirement Age, 65, 75 &amp; 85. Not included in your current net worth.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">$</span>
            <NumericInput
              className="pl-7"
              value={form.annualSavings}
              onChange={(e) => set("annualSavings", e.target.value)}
              placeholder="e.g. 12,000"
            />
          </div>
          {n(form.annualSavings) > 0 && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              {fmtFull(n(form.annualSavings))}/year will be added to retirement projections
            </p>
          )}
        </div>

        <Separator />

        {/* ROI Mode toggle */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            How would you like to set your Rate of Return?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Choose whether to use a Risk Profile-based rate or enter a manual ROI.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRoiMode("risk")}
              className={`p-3 rounded-xl border-2 text-left transition-all ${form.roiMode === "risk" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className={`font-semibold text-sm ${form.roiMode === "risk" ? "text-primary" : "text-gray-700"}`}>Risk Profile</p>
              <p className="text-xs text-gray-500 mt-0.5">Based on risk appetite &amp; investment style</p>
            </button>
            <button
              type="button"
              onClick={() => setRoiMode("manual")}
              className={`p-3 rounded-xl border-2 text-left transition-all ${form.roiMode === "manual" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className={`font-semibold text-sm ${form.roiMode === "manual" ? "text-primary" : "text-gray-700"}`}>Manual Rate</p>
              <p className="text-xs text-gray-500 mt-0.5">Enter your own expected return %</p>
            </button>
          </div>
        </div>

        <Separator />

        {form.roiMode === "risk" ? (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">What is your Risk Appetite?</p>
              <p className="text-xs text-gray-500 mb-3">Select how much risk you are comfortable taking.</p>
              <div className="space-y-2">
                {appetiteOpts.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("riskAppetite", opt.value)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${form.riskAppetite === opt.value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${form.riskAppetite === opt.value ? "border-primary" : "border-gray-300"}`}>
                        {form.riskAppetite === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${form.riskAppetite === opt.value ? "text-primary" : "text-gray-700"}`}>{opt.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">What is your preferred Investment Style?</p>
              <p className="text-xs text-gray-500 mb-3">Choose the approach that best reflects how you like to invest.</p>
              <div className="grid grid-cols-2 gap-2">
                {styleOpts.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("investmentStyle", opt.value)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${form.investmentStyle === opt.value ? "border-secondary bg-secondary/5" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <p className={`font-semibold text-sm ${form.investmentStyle === opt.value ? "text-secondary" : "text-gray-700"}`}>{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            {(riskReturn !== null || styleReturn !== null) && (
              <>
                <Separator />
                <div className="rounded-xl bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/20 p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Projected Growth Rate</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      {riskReturn !== null && styleReturn !== null
                        ? "Blended Return"
                        : riskReturn !== null
                          ? `${form.riskAppetite} Risk Profile`
                          : `${form.investmentStyle} Investment Style`}
                    </span>
                    <span className="text-xl font-bold text-primary">{(effectiveRate * 100).toFixed(2)}% p.a.</span>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">What is your expected Rate of Return?</p>
            <p className="text-xs text-gray-500 mb-3">Enter your own estimated annual return percentage. Maximum 50%.</p>
            <div className="relative">
              <NumericInput
                className="pr-8"
                value={form.expectedReturnRate}
                onChange={(e) => {
                  const raw = parseFloat(e.target.value) || 0;
                  set("expectedReturnRate", String(Math.min(50, Math.max(0, raw))));
                }}
                placeholder="e.g. 8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">%</span>
            </div>
            {customRate > 0 && (
              <div className="mt-3 rounded-xl bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/20 p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Projected Growth Rate</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Manual Rate</span>
                  <span className="text-xl font-bold text-primary">{(customRate * 100).toFixed(1)}% p.a.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEstate = () => (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-3">
        Indicate which estate planning documents you currently have in place.
      </p>
      <YesNo label="Will" value={form.will} onChange={(v) => set("will", v)} tooltip="A legal document directing how your estate is distributed after death." />
      <YesNo label="Trust" value={form.trust} onChange={(v) => set("trust", v)} tooltip="A legal arrangement managing assets during your lifetime and beyond." />
      <YesNo label="Power of Attorney" value={form.powerOfAttorney} onChange={(v) => set("powerOfAttorney", v)} tooltip="Grants someone authority to act on your behalf for financial/legal matters." />
      <YesNo label="Healthcare Directive" value={form.healthcareDirective} onChange={(v) => set("healthcareDirective", v)} tooltip="Also known as a living will — outlines your medical care wishes." />
      {estateScore > 0 && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">{estateScore} of 4</span> key documents in place.
            {estateScore < 4 && " Consider completing your estate plan with an advisor."}
          </p>
        </div>
      )}
    </div>
  );

  const tabRenders: Record<string, () => JSX.Element> = {
    personal: renderPersonal,
    assets: renderAssets,
    nondom: renderNonDom,
    liabilities: renderLiabilities,
    risk: renderRisk,
    estate: renderEstate,
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Req 6: Incomplete section warning dialog */}
      <Dialog open={incompleteDialog} onOpenChange={setIncompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Incomplete Section</DialogTitle>
            <DialogDescription>
              Some sections contain incomplete or missing information. Do you want to proceed anyway?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setIncompleteDialog(false)}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all"
            >
              Go Back and Complete
            </button>
            <button
              type="button"
              onClick={() => {
                setIncompleteDialog(false);
                if (pendingTabIndex !== null) {
                  setActiveTab(TABS[pendingTabIndex].id);
                  setPendingTabIndex(null);
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-all"
            >
              Proceed Anyway
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Tabbed Input ───────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Tab nav */}
          <div className="flex flex-wrap gap-1 mb-4">
            {TABS.map((t) => (
              <TabBtn
                key={t.id}
                id={t.id}
                label={t.label}
                icon={t.icon}
                active={activeTab === t.id}
                completed={!!(tabCompleted[t.id] && activeTab !== t.id)}
                onClick={() => setActiveTab(t.id)}
              />
            ))}
          </div>

          {/* Tab content */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                {(() => {
                  const t = TABS.find((t) => t.id === activeTab)!;
                  const Icon = t.icon;
                  return (<><Icon className="h-4 w-4" />{t.label}</>);
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-5">
              {tabRenders[activeTab]()}
            </CardContent>
          </Card>

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={goPrev}
              disabled={activeTabIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-xs text-gray-400 font-medium">
              {activeTabIndex + 1} / {TABS.length}
            </span>
            <button
              onClick={goNext}
              disabled={activeTabIndex === TABS.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Right: Live Results ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Net Worth Summary */}
          <Card>
            <CardContent className="pt-4 px-4 pb-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-gray-500">
                Net Worth Summary
              </h3>

              {overviewPie.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={overviewPie} cx="50%" cy="50%" outerRadius={72} dataKey="value">
                      {overviewPie.map((_, i) => (
                        <Cell key={i} fill={[COLOR_DOM, COLOR_NONDOM, COLOR_LIB][i]} />
                      ))}
                    </Pie>
                    <ReTooltip formatter={(v: number) => fmtFull(v)} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-gray-400 text-xs text-center">
                  Enter values to see your financial overview
                </div>
              )}

              <div className="mt-3 space-y-0">
                <ResultRow label="Domestic Assets" value={fmtFull(totalDomAssets)} color="text-primary" />
                <ResultRow label="Non-Domicile Assets" value={fmtFull(totalNonDomAssets)} color="text-secondary" />
                <ResultRow label="Total Assets" value={fmtFull(totalAssets)} color="text-gray-700" />
                <ResultRow label="Total Liabilities" value={fmtFull(totalLiabilities)} color="text-red-600" />
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-200">
                  <span className="font-bold text-gray-900 text-sm">Net Worth</span>
                  <span className={`font-bold text-lg ${netWorth >= 0 ? "text-primary" : "text-red-600"}`}>
                    {fmt(netWorth)}
                  </span>
                </div>
              </div>

              {totalAssets > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Assets</span>
                    <span>Liabilities</span>
                  </div>
                  <Progress value={(totalAssets / (totalAssets + totalLiabilities)) * 100} className="h-2" />
                  {totalLiabilities > 0 && (
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      Coverage: {((totalAssets / totalLiabilities) * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              )}
              {effectiveRate > 0 && netWorth > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Projected Net Worth (1 yr @ {(effectiveRate * 100).toFixed(1)}%)
                    </span>
                    <span className="text-sm font-semibold text-secondary">
                      {fmt(fv(Math.max(0, netWorth), annualSavingsAmount, effectiveRate, 1))}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Domestic Breakdown */}
          {domBreakdownPie.length > 1 && (
            <Card>
              <CardContent className="pt-4 px-3 pb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                  Domestic Asset Breakdown
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={domBreakdownPie}
                      cx="50%"
                      cy="45%"
                      innerRadius={42}
                      outerRadius={78}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {domBreakdownPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip formatter={(v: number) => fmtFull(v)} />
                    <Legend wrapperStyle={{ fontSize: "10px", lineHeight: "18px" }} iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Retirement Wealth Projection */}
          <Card>
            <CardContent className="pt-4 px-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-gray-900 text-base">Retirement Wealth Projection</h3>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Projected net worth at key retirement milestones —{" "}
                <span className="font-semibold text-gray-700">65Y, 75Y &amp; 85Y</span>
                {retirementAge > 0 && (
                  <> and your planned retirement at{" "}
                    <span className="font-semibold text-gray-700">Age {retirementAge}</span>
                  </>
                )}.
                {annualSavingsAmount > 0 && (
                  <span className="text-green-600"> Includes {fmtFull(annualSavingsAmount)}/yr savings.</span>
                )}
              </p>

              {currentAge > 0 ? (
                <>
                  <div className="text-xs text-gray-400 mb-3">
                    Growth rate:{" "}
                    {form.roiMode === "manual"
                      ? customRate > 0
                        ? `${(customRate * 100).toFixed(1)}% p.a. (manual rate)`
                        : "Enter a manual rate in the Risk Profile tab to see projections"
                      : form.riskAppetite && form.investmentStyle
                        ? `${form.riskAppetite} + ${form.investmentStyle} blend — ${(effectiveRate * 100).toFixed(2)}% p.a. (70% risk / 30% style)`
                        : form.riskAppetite
                          ? `${form.riskAppetite} risk profile — ${(effectiveRate * 100).toFixed(0)}% p.a.`
                          : form.investmentStyle
                            ? `${form.investmentStyle} investment style — ${(effectiveRate * 100).toFixed(0)}% p.a.`
                            : "Select a Risk Profile or Manual Rate in the Risk Profile tab to see projections"}
                  </div>

                  {/* Req 5: Bold / emphasized At Planned Retirement card */}
                  {projRetirement !== null && retirementAge > currentAge && (
                    <div className="mb-3 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 text-center shadow-sm">
                      <p className="text-sm font-bold text-primary mb-0.5">
                        At Planned Retirement (Age {retirementAge})
                      </p>
                      <p className="text-3xl font-extrabold text-primary">
                        {fmt(projRetirement)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.max(0, retirementAge - currentAge)} years from now
                      </p>
                    </div>
                  )}

                  {/* Req 5: Milestone cards with color tokens that match bar chart */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <ProjectionCard
                      label={`Now (${currentAge})`}
                      value={fmt(Math.max(0, netWorth))}
                      sub="Current net worth"
                      color="border-green-200 bg-green-50"
                    />
                    <ProjectionCard
                      label="65Y"
                      value={65 > currentAge ? fmt(proj65) : "—"}
                      sub={65 > currentAge ? `${65 - currentAge} yrs away` : "Passed"}
                      color={65 > currentAge ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}
                    />
                    <ProjectionCard
                      label="75Y"
                      value={75 > currentAge ? fmt(proj75) : "—"}
                      sub={75 > currentAge ? `${75 - currentAge} yrs away` : "Passed"}
                      color={75 > currentAge ? "border-teal-200 bg-teal-50" : "border-gray-100 bg-gray-50"}
                    />
                    <ProjectionCard
                      label="85Y"
                      value={85 > currentAge ? fmt(proj85) : "—"}
                      sub={85 > currentAge ? `${85 - currentAge} yrs away` : "Passed"}
                      color={85 > currentAge ? "border-purple-200 bg-purple-50" : "border-gray-100 bg-gray-50"}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {["65Y", "75Y", "85Y"].map((label) => (
                    <div key={label} className="rounded-lg p-3 text-center border border-dashed border-gray-200 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
                      <p className="text-sm text-gray-300">—</p>
                      <p className="text-xs text-gray-300 mt-0.5">Enter age</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Req 5: Bar colors match card colors */}
              {projectionBars.length > 1 && (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={projectionBars} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 9 }} width={55} />
                    <ReTooltip formatter={(v: number) => [fmtFull(v), "Projected Net Worth"]} />
                    <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                      {projectionBars.map((bar, i) => (
                        <Cell key={i} fill={getBarFill(bar.label)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              <p className="text-xs text-gray-400 mt-2">* Illustrative only. Not financial advice.</p>
            </CardContent>
          </Card>

          {/* Risk + Estate summary */}
          {(form.riskAppetite || form.investmentStyle || (form.roiMode === "manual" && customRate > 0) || estateScore > 0) && (
            <Card>
              <CardContent className="pt-4 px-4 pb-4 space-y-3">
                {form.roiMode === "manual" && customRate > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Manual Rate of Return</p>
                    <p className="text-sm font-semibold text-primary">{(customRate * 100).toFixed(1)}% p.a.</p>
                  </div>
                ) : (form.riskAppetite || form.investmentStyle) ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Risk Appetite</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{form.riskAppetite || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Investment Style</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">{form.investmentStyle || "—"}</p>
                    </div>
                  </div>
                ) : null}
                {estateScore > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs text-gray-500 font-medium">Estate Planning</p>
                      <span className="text-xs font-semibold text-gray-700 ml-auto">{estateScore}/4 documents</span>
                    </div>
                    <Progress value={(estateScore / 4) * 100} className="h-1.5 mb-2" />
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: "Will", val: form.will },
                        { label: "Trust", val: form.trust },
                        { label: "Power of Attorney", val: form.powerOfAttorney },
                        { label: "Healthcare Directive", val: form.healthcareDirective },
                      ].map(({ label, val }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-1.5 text-xs p-1.5 rounded ${val === true ? "text-green-700" : val === false ? "text-red-600" : "text-gray-400"}`}
                        >
                          <CheckCircle2 className={`h-3 w-3 flex-shrink-0 ${val === true ? "text-green-500" : "text-gray-300"}`} />
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <CalculatorCTAs />
        </div>
      </div>
    </>
  );
}
