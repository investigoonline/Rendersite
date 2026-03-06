import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer } from "recharts";
import { HelpCircle } from "lucide-react";

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function nv(v: string) { return parseFloat(v) || 0; }

function Field({ label, value, onChange, tooltip, suffix, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; tooltip: string; suffix?: string; placeholder?: string;
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
        {!suffix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>}
        <NumericInput value={value} onChange={e => onChange(e.target.value)}
          className={suffix ? "pr-10" : "pl-7"} placeholder={placeholder || "0"} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultCard({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// 1. Simple Interest
function SimpleInterest() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const P = nv(principal); const R = nv(rate); const T = nv(years);
  const si = P * (R / 100) * T;
  const total = P + si;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Simple Interest Calculator</h3>
        <p className="text-xs text-gray-500 mb-4">Interest is calculated only on the original principal.</p>
        <Field label="Principal amount (P)" value={principal} onChange={setPrincipal} tooltip="The initial amount of money." placeholder="100000" />
        <Field label="Annual interest rate (%)" value={rate} onChange={setRate} tooltip="The annual interest rate." suffix="%" placeholder="8" />
        <Field label="Time period (years)" value={years} onChange={setYears} tooltip="Duration in years." suffix="yrs" placeholder="3" />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Results</h3>
        <div className="grid grid-cols-1 gap-3">
          <ResultCard label="Interest Earned" value={fmt(si)} color="text-green-600" />
          <ResultCard label="Total Amount" value={fmt(total)} color="text-primary" sub={`after ${T} year${T !== 1 ? "s" : ""}`} />
          <ResultCard label="Principal" value={fmt(P)} color="text-gray-600" />
        </div>
      </CardContent></Card>
    </div>
  );
}

// 2. Compound Interest
function CompoundInterest() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [freq, setFreq] = useState("1");
  const P = nv(principal); const R = nv(rate); const T = nv(years); const N = nv(freq);
  const A = P * Math.pow(1 + (R / 100) / N, N * T);
  const ci = A - P;
  const chartData = Array.from({ length: Math.ceil(T) + 1 }, (_, i) => ({
    year: i,
    amount: Math.round(P * Math.pow(1 + (R / 100) / N, N * i)),
    principal: Math.round(P),
  }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Compound Interest Calculator</h3>
        <p className="text-xs text-gray-500 mb-4">Interest is earned on both principal and accumulated interest.</p>
        <Field label="Principal amount (P)" value={principal} onChange={setPrincipal} tooltip="The initial investment amount." placeholder="100000" />
        <Field label="Annual nominal rate (R %)" value={rate} onChange={setRate} tooltip="Annual interest rate." suffix="%" placeholder="8" />
        <Field label="Years (T)" value={years} onChange={setYears} tooltip="Investment duration." suffix="yrs" placeholder="3" />
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">Compounds per year (N)</label>
          <Select value={freq} onValueChange={setFreq}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annual (1x)</SelectItem>
              <SelectItem value="2">Semi-Annual (2x)</SelectItem>
              <SelectItem value="4">Quarterly (4x)</SelectItem>
              <SelectItem value="12">Monthly (12x)</SelectItem>
              <SelectItem value="365">Daily (365x)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-3">Results</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <ResultCard label="Compound Interest" value={fmt(ci)} color="text-green-600" />
          <ResultCard label="Total Amount" value={fmt(A)} color="text-primary" sub={`after ${T} yrs`} />
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} />
            <ReTooltip formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="principal" stroke="#9ca3af" name="Principal" dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="amount" stroke="#2563eb" name="Total Amount" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent></Card>
    </div>
  );
}

// 3. Rule of 72
function RuleOf72() {
  const [rate, setRate] = useState("");
  const R = nv(rate);
  const years = R > 0 ? 72 / R : 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Rule of 72</h3>
        <p className="text-xs text-gray-500 mb-4">Quickly estimate how many years it takes to double your investment.</p>
        <Field label="Expected annual interest rate (%)" value={rate} onChange={setRate} tooltip="Your expected annual return rate." suffix="%" placeholder="9" />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-6">Result</h3>
        {years > 0 ? (
          <>
            <div className="text-center py-8 bg-primary/5 rounded-xl">
              <p className="text-6xl font-bold text-primary">{years.toFixed(1)}</p>
              <p className="text-lg text-gray-600 mt-2">years to double</p>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              At <strong>{R}%</strong> per year, your investment will roughly double in <strong>{years.toFixed(1)} years</strong>.
            </p>
          </>
        ) : (
          <p className="text-gray-400 text-center py-8">Enter an interest rate to see results</p>
        )}
      </CardContent></Card>
    </div>
  );
}

// 4. Fixed vs Floating
function FixedVsFloating() {
  const [principal, setPrincipal] = useState("");
  const [fixedRate, setFixedRate] = useState("");
  const [floatRate, setFloatRate] = useState("");
  const [years, setYears] = useState("");
  const P = nv(principal); const rf = nv(fixedRate) / 100; const rfl = nv(floatRate) / 100; const T = nv(years);
  const aFixed = P * Math.pow(1 + rf, T);
  const aFloat = P * Math.pow(1 + rfl, T);
  const diff = aFixed - aFloat;
  const floatIsCheaper = diff > 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Fixed vs Floating Rate</h3>
        <p className="text-xs text-gray-500 mb-4">Compare total cost under fixed vs variable interest rate.</p>
        <Field label="Principal / Loan amount" value={principal} onChange={setPrincipal} tooltip="The initial loan or investment amount." placeholder="1000000" />
        <Field label="Fixed nominal annual rate (%)" value={fixedRate} onChange={setFixedRate} tooltip="The fixed interest rate." suffix="%" placeholder="8" />
        <Field label="Floating nominal annual rate (%)" value={floatRate} onChange={setFloatRate} tooltip="The variable interest rate (assumed constant for comparison)." suffix="%" placeholder="7" />
        <Field label="Period (years)" value={years} onChange={setYears} tooltip="Duration of the loan/investment." suffix="yrs" placeholder="5" />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Comparison</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">Fixed @ {fixedRate}%</p>
            <p className="text-xl font-bold text-gray-900">{fmt(aFixed)}</p>
            <p className="text-xs text-gray-400 mt-1">total after {T} yrs</p>
          </div>
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">Floating @ {floatRate}%</p>
            <p className="text-xl font-bold text-primary">{fmt(aFloat)}</p>
            <p className="text-xs text-gray-400 mt-1">total after {T} yrs</p>
          </div>
        </div>
        <div className={`p-4 rounded-lg ${floatIsCheaper ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
          <p className="text-xs text-gray-500">Difference</p>
          <p className={`text-2xl font-bold ${floatIsCheaper ? "text-green-600" : "text-amber-600"}`}>{fmt(Math.abs(diff))}</p>
          <p className="text-xs text-gray-600 mt-1">
            {floatIsCheaper
              ? `Floating rate saves ${fmt(Math.abs(diff))} over ${T} years (if floating stays at ${floatRate}%)`
              : `Fixed rate saves ${fmt(Math.abs(diff))} over ${T} years (if floating rises above ${fixedRate}%)`}
          </p>
        </div>
      </CardContent></Card>
    </div>
  );
}

// 5. Tax Rate Impact
function TaxRateImpact() {
  const [interest, setInterest] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const I = nv(interest); const TR = nv(taxRate);
  const tax = I * (TR / 100);
  const afterTax = I - tax;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Tax Rate Impact</h3>
        <p className="text-xs text-gray-500 mb-4">See how taxes reduce your effective interest income.</p>
        <Field label="Interest earned" value={interest} onChange={setInterest} tooltip="Total interest income earned." placeholder="50000" />
        <Field label="Applicable tax rate (%)" value={taxRate} onChange={setTaxRate} tooltip="Your marginal tax rate applicable to interest income." suffix="%" placeholder="30" />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Results</h3>
        <div className="space-y-3">
          <ResultCard label="Interest Before Tax" value={fmt(I)} color="text-gray-900" />
          <ResultCard label="Tax Payable" value={fmt(tax)} color="text-red-600" sub={`at ${taxRate}% rate`} />
          <ResultCard label="Interest After Tax" value={fmt(afterTax)} color="text-green-600" sub="your actual take-home return" />
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Effective return retained: <strong>{I > 0 ? ((afterTax / I) * 100).toFixed(1) : 0}%</strong> of gross interest</p>
        </div>
      </CardContent></Card>
    </div>
  );
}

// 6. Inflation Rate Impact
function InflationImpact() {
  const [pv, setPv] = useState("");
  const [inflRate, setInflRate] = useState("");
  const [years, setYears] = useState("");
  const PV = nv(pv); const infl = nv(inflRate) / 100; const T = nv(years);
  const realValue = PV / Math.pow(1 + infl, T);
  const nominalNeeded = PV * Math.pow(1 + infl, T);
  const powerLoss = PV - realValue;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Inflation Rate Impact</h3>
        <p className="text-xs text-gray-500 mb-4">See how inflation erodes your purchasing power over time.</p>
        <Field label="Present value / amount today" value={pv} onChange={setPv} tooltip="The current amount in today's dollars." placeholder="100000" />
        <Field label="Expected annual inflation rate (%)" value={inflRate} onChange={setInflRate} tooltip="The expected average annual inflation rate." suffix="%" placeholder="6" />
        <Field label="Years into the future" value={years} onChange={setYears} tooltip="How many years ahead you want to project." suffix="yrs" placeholder="5" />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Results</h3>
        <div className="space-y-3">
          <ResultCard label="Today's Value" value={fmt(PV)} color="text-gray-900" />
          <ResultCard label={`Purchasing Power in ${T} Years`} value={fmt(realValue)} color="text-amber-600" sub="in today's dollars" />
          <ResultCard label="Purchasing Power Lost" value={fmt(powerLoss)} color="text-red-600" />
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-gray-700">
            <strong>{fmt(PV)}</strong> today will have the purchasing power of <strong>≈{fmt(realValue)}</strong> in today's dollars after {T} years at {inflRate}% inflation.
            You would need <strong>{fmt(nominalNeeded)}</strong> nominally to match today's purchasing power.
          </p>
        </div>
      </CardContent></Card>
    </div>
  );
}

export default function InterestCalc() {
  return (
    <Tabs defaultValue="simple">
      <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
        <TabsTrigger value="simple" className="text-xs">Simple Interest</TabsTrigger>
        <TabsTrigger value="compound" className="text-xs">Compound Interest</TabsTrigger>
        <TabsTrigger value="rule72" className="text-xs">Rule of 72</TabsTrigger>
        <TabsTrigger value="fixedvsfloat" className="text-xs">Fixed vs Floating</TabsTrigger>
        <TabsTrigger value="tax" className="text-xs">Tax Impact</TabsTrigger>
        <TabsTrigger value="inflation" className="text-xs">Inflation Impact</TabsTrigger>
      </TabsList>
      <TabsContent value="simple"><SimpleInterest /></TabsContent>
      <TabsContent value="compound"><CompoundInterest /></TabsContent>
      <TabsContent value="rule72"><RuleOf72 /></TabsContent>
      <TabsContent value="fixedvsfloat"><FixedVsFloating /></TabsContent>
      <TabsContent value="tax"><TaxRateImpact /></TabsContent>
      <TabsContent value="inflation"><InflationImpact /></TabsContent>
    </Tabs>
  );
}
