import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NumericInput } from "@/components/ui/numeric-input";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, Legend } from "recharts";
import { HelpCircle, Home, TrendingUp, DollarSign, Shield } from "lucide-react";
import CalculatorCTAs from "./CalculatorCTAs";

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return n.toFixed(2) + "%"; }
function n(v: string) { return parseFloat(v) || 0; }

function FieldRow({ label, value, onChange, tooltip, suffix, placeholder, maxDecimals, max }: {
  label: string; value: string; onChange: (v: string) => void; tooltip: string; suffix?: string; placeholder?: string; maxDecimals?: number; max?: number;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Tooltip>
          <TooltipTrigger><HelpCircle className="h-4 w-4 text-gray-400" /></TooltipTrigger>
          <TooltipContent className="max-w-xs"><p className="text-xs">{tooltip}</p></TooltipContent>
        </Tooltip>
      </div>
      <div className="relative">
        {!suffix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>}
        <NumericInput value={value} onChange={e => onChange(e.target.value)}
          className={suffix ? "pr-10" : "pl-7"}
          placeholder={placeholder || ""}
          maxDecimals={maxDecimals ?? 2}
          max={max} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`font-semibold ${color || "text-gray-900"}`}>{value}</span>
    </div>
  );
}

// Tab 1 — Equity
function EquityTab() {
  const [homeValue, setHomeValue] = useState("");
  const [mortgageBalance, setMortgageBalance] = useState("");
  const hv = n(homeValue); const mb = n(mortgageBalance);
  const equity = hv - mb;
  const equityPct = hv > 0 ? (equity / hv) * 100 : 0;
  const pieData = hv > 0 ? [
    { name: "Equity", value: Math.max(0, equity), color: "#16a34a" },
    { name: "Mortgage", value: mb, color: "#dc2626" },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Home className="h-4 w-4 text-primary" /> Home Equity</h3>
        <FieldRow label="Current home market value?" value={homeValue} onChange={setHomeValue} tooltip="The current estimated market value of your home." />
        <FieldRow label="Outstanding mortgage balance?" value={mortgageBalance} onChange={setMortgageBalance} tooltip="The remaining balance you owe on your mortgage." />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Your Home Equity</h3>
        {pieData.length > 0 && (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <ReTooltip formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        )}
        <ResultRow label="Home Value" value={fmt(hv)} />
        <ResultRow label="Mortgage Balance" value={fmt(mb)} color="text-red-600" />
        <ResultRow label="Home Equity" value={fmt(equity)} color={equity >= 0 ? "text-green-600" : "text-red-600"} />
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Equity {fmtPct(equityPct)}</span><span>Mortgage {fmtPct(100 - equityPct)}</span></div>
          <Progress value={Math.max(0, equityPct)} className="h-3" />
        </div>
      </CardContent></Card>
    </div>
  );
}

// Tab 2 — ROI
function ROITab() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [annualExpenses, setAnnualExpenses] = useState("");
  const pp = n(purchasePrice); const cv = n(currentValue); const mr = n(monthlyRent); const ae = n(annualExpenses);
  const yearsOwned = purchaseDate ? Math.max(0, (Date.now() - new Date(purchaseDate).getTime()) / (365.25 * 24 * 3600 * 1000)) : 0;
  const appreciation = cv - pp;
  const totalRent = mr * 12 * yearsOwned;
  const totalExpenses = ae * yearsOwned;
  const netProfit = appreciation + totalRent - totalExpenses;
  const roi = pp > 0 ? (netProfit / pp) * 100 : 0;
  const annualizedROI = yearsOwned > 0 ? (Math.pow(1 + roi / 100, 1 / yearsOwned) - 1) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Real Estate ROI</h3>
        <FieldRow label="Purchase price?" value={purchasePrice} onChange={setPurchasePrice} tooltip="The original price you paid for the property." />
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium text-gray-700">Purchase date?</label>
            <Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-gray-400" /></TooltipTrigger>
              <TooltipContent><p className="text-xs">The date you purchased the property. Used to calculate years owned.</p></TooltipContent>
            </Tooltip>
          </div>
          <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
        </div>
        <FieldRow label="Current home value?" value={currentValue} onChange={setCurrentValue} tooltip="The current estimated market value of your property." />
        <FieldRow label="Monthly rental income (optional)?" value={monthlyRent} onChange={setMonthlyRent} tooltip="Monthly rent received if the property is rented out. Enter 0 if owner-occupied." />
        <FieldRow label="Total annual expenses (tax + insurance + maintenance)?" value={annualExpenses} onChange={setAnnualExpenses} tooltip="All annual ownership costs including property tax, insurance, repairs, and maintenance." />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-1">ROI Analysis</h3>
        <p className="text-xs text-gray-500 mb-4">Years owned: {yearsOwned.toFixed(1)}</p>
        <ResultRow label="Purchase Price" value={fmt(pp)} />
        <ResultRow label="Current Value" value={fmt(cv)} />
        <ResultRow label="Appreciation" value={fmt(appreciation)} color={appreciation >= 0 ? "text-green-600" : "text-red-600"} />
        <ResultRow label="Total Rental Income" value={fmt(totalRent)} color="text-green-600" />
        <ResultRow label="Total Expenses" value={fmt(totalExpenses)} color="text-red-600" />
        <ResultRow label="Net Profit" value={fmt(netProfit)} color={netProfit >= 0 ? "text-green-600" : "text-red-600"} />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Total ROI</p>
            <p className="text-2xl font-bold text-primary">{fmtPct(roi)}</p>
            <p className="text-xs text-gray-500">over {yearsOwned.toFixed(1)} yrs</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Annualized Return</p>
            <p className="text-2xl font-bold text-green-600">{fmtPct(annualizedROI)}</p>
            <p className="text-xs text-gray-500">per year</p>
          </div>
        </div>
      </CardContent></Card>
    </div>
  );
}

// Tab 3 — Mortgage EMI
function MortgageEMITab() {
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [termYears, setTermYears] = useState("");
  const P = n(loanAmount); const annualRate = n(rate); const years = n(termYears);
  const r = annualRate / 100 / 12; const nMonths = years * 12;
  const emi = P > 0 && r > 0 && nMonths > 0
    ? P * r * Math.pow(1 + r, nMonths) / (Math.pow(1 + r, nMonths) - 1)
    : 0;
  const totalPaid = emi * nMonths;
  const totalInterest = totalPaid - P;
  const pieData = P > 0 ? [
    { name: "Principal", value: P, color: "#2563eb" },
    { name: "Interest", value: Math.max(0, totalInterest), color: "#f59e0b" },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Mortgage EMI</h3>
        <FieldRow label="Loan amount?" value={loanAmount} onChange={setLoanAmount} tooltip="The total mortgage loan amount." />
        <FieldRow label="Annual mortgage interest rate (%)?" value={rate} onChange={v => setRate(v)} tooltip="The annual interest rate on your mortgage." suffix="%" maxDecimals={2} max={100} />
        <FieldRow label="Loan term (years)?" value={termYears} onChange={setTermYears} tooltip="The total number of years for the mortgage." suffix="yrs" max={100} />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Monthly Payment</h3>
        {emi > 0 ? (
          <>
            <div className="text-center py-4 bg-primary/10 rounded-lg mb-4">
              <p className="text-xs text-gray-600">Monthly EMI</p>
              <p className="text-4xl font-bold text-primary">{fmt(Math.round(emi))}</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <ReTooltip formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <ResultRow label="Total Payment" value={fmt(Math.round(totalPaid))} />
            <ResultRow label="Principal" value={fmt(P)} color="text-primary" />
            <ResultRow label="Total Interest" value={fmt(Math.round(totalInterest))} color="text-amber-600" />
          </>
        ) : <p className="text-gray-400 text-sm text-center py-8">Enter loan details to calculate EMI</p>}
      </CardContent></Card>
    </div>
  );
}

// Tab 4 — DTI Affordability
function AffordabilityTab() {
  const [annualIncome, setAnnualIncome] = useState("");
  const [monthlyDebt, setMonthlyDebt] = useState("");
  const [mortgagePayment, setMortgagePayment] = useState("");
  const ai = n(annualIncome); const md = n(monthlyDebt); const mp = n(mortgagePayment);
  const monthlyIncome = ai / 12;
  const dti = monthlyIncome > 0 ? ((md + mp) / monthlyIncome) * 100 : 0;
  const risk = dti <= 36 ? { label: "Safe", color: "text-green-600", bg: "bg-green-50 border-green-200", badgeClass: "bg-green-100 text-green-800", msg: "Your debt-to-income ratio is within the safe range. Lenders will generally approve your mortgage application." }
    : dti <= 43 ? { label: "Moderate Risk", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", badgeClass: "bg-amber-100 text-amber-800", msg: "Your DTI is moderate. Most lenders will accept this, but you have limited financial flexibility." }
    : { label: "High Risk", color: "text-red-600", bg: "bg-red-50 border-red-200", badgeClass: "bg-red-100 text-red-800", msg: "Your DTI exceeds 43%. Many lenders may decline your application. Consider reducing existing debts first." };
  const hasData = !!(annualIncome || monthlyDebt || mortgagePayment);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Affordability (DTI)</h3>
        <FieldRow label="Annual income?" value={annualIncome} onChange={setAnnualIncome} tooltip="Your total gross annual income before taxes." />
        <FieldRow label="Monthly debt payments (existing loans, credit cards, etc.)?" value={monthlyDebt} onChange={setMonthlyDebt} tooltip="Total of all existing monthly debt obligations excluding the proposed mortgage." />
        <FieldRow label="Proposed mortgage payment?" value={mortgagePayment} onChange={setMortgagePayment} tooltip="The monthly mortgage payment you are applying for." />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Affordability Analysis</h3>
        {hasData ? (
          <>
            <ResultRow label="Monthly Income" value={fmt(Math.round(monthlyIncome))} />
            <ResultRow label="Total Monthly Debt" value={fmt(md + mp)} />
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Debt-to-Income Ratio</p>
              <p className={`text-5xl font-bold ${risk.color}`}>{dti.toFixed(1)}%</p>
              <Badge className={`mt-2 ${risk.badgeClass}`}>{risk.label}</Badge>
            </div>
            <Progress value={Math.min(100, dti)} className="h-3 mt-4" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span className="text-green-600">36%</span><span className="text-amber-600">43%</span><span>100%+</span>
            </div>
            <div className={`mt-4 p-3 rounded-lg border ${risk.bg}`}>
              <p className={`text-sm font-medium ${risk.color}`}>{risk.label}</p>
              <p className="text-xs text-gray-600 mt-1">{risk.msg}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
            <Shield className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm">Enter your income and debt details to see your affordability analysis.</p>
          </div>
        )}
      </CardContent></Card>
    </div>
  );
}

export default function RealEstateCalc() {
  return (
    <div>
      <Tabs defaultValue="equity">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6 w-full h-auto">
          <TabsTrigger value="equity" className="text-xs sm:text-sm py-2"><Home className="h-3 w-3 mr-1 hidden sm:inline" />Equity</TabsTrigger>
          <TabsTrigger value="roi" className="text-xs sm:text-sm py-2"><TrendingUp className="h-3 w-3 mr-1 hidden sm:inline" />ROI</TabsTrigger>
          <TabsTrigger value="emi" className="text-xs sm:text-sm py-2"><DollarSign className="h-3 w-3 mr-1 hidden sm:inline" />Mortgage EMI</TabsTrigger>
          <TabsTrigger value="dti" className="text-xs sm:text-sm py-2"><Shield className="h-3 w-3 mr-1 hidden sm:inline" />Affordability</TabsTrigger>
        </TabsList>
        <TabsContent value="equity"><EquityTab /></TabsContent>
        <TabsContent value="roi"><ROITab /></TabsContent>
        <TabsContent value="emi"><MortgageEMITab /></TabsContent>
        <TabsContent value="dti"><AffordabilityTab /></TabsContent>
      </Tabs>
      <CalculatorCTAs />
    </div>
  );
}
