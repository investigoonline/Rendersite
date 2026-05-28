import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer } from "recharts";
import { HelpCircle } from "lucide-react";
import CalculatorCTAs from "./CalculatorCTAs";

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function nv(v: string) { return parseFloat(v) || 0; }

function Field({ label, value, onChange, tooltip, suffix, placeholder, maxDecimals, max }: {
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
        {!suffix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>}
        <NumericInput value={value} onChange={e => onChange(e.target.value)}
          className={suffix ? "pr-10" : "pl-7"} placeholder={placeholder || ""} maxDecimals={maxDecimals ?? 2} max={max} />
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
  const [annualAddition, setAnnualAddition] = useState("");

  const P = nv(principal);
  const R = nv(rate) / 100;
  const T = nv(years);
  const A = nv(annualAddition);

  // True Simple Interest: interest is only ever on the original principal (I = P × R × T)
  // Each annual addition also earns simple interest for the remaining years it is held
  const baseInterest = P * R * T;
  let additionInterest = 0;
  for (let i = 0; i < Math.floor(T); i++) {
    additionInterest += A * R * Math.max(0, T - i - 1);
  }
  const totalInterest = baseInterest + additionInterest;
  const totalContributions = P + A * Math.floor(T);
  const total = totalContributions + totalInterest;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Simple Interest Calculator</h3>
        <p className="text-xs text-gray-500 mb-4">Interest is calculated on the running balance including annual additions.</p>
        <Field label="Principal amount (P)" value={principal} onChange={setPrincipal} tooltip="The initial amount of money." />
        <Field label="Annual interest rate (%)" value={rate} onChange={setRate} tooltip="The annual interest rate." suffix="%" maxDecimals={2} max={100} />
        <Field label="Time period (years)" value={years} onChange={setYears} tooltip="Duration in years." suffix="yrs" max={100} />
        <Field label="Annual Addition" value={annualAddition} onChange={setAnnualAddition} tooltip="Amount added to the balance each year." />
      </CardContent></Card>
      <Card><CardContent className="pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Results</h3>
        <div className="grid grid-cols-1 gap-3">
          <ResultCard label="Total Interest Earned" value={fmt(totalInterest)} color="text-green-600" />
          <ResultCard label="Total Amount" value={fmt(total)} color="text-primary" sub={`after ${T} year${T !== 1 ? "s" : ""}`} />
          <ResultCard label="Principal" value={fmt(P)} color="text-gray-600" />
          {A > 0 && <ResultCard label="Total Contributions" value={fmt(totalContributions)} color="text-gray-600" sub={`principal + ${fmt(A * Math.floor(T))} additions`} />}
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
  const [annualAddition, setAnnualAddition] = useState("");

  const P = nv(principal);
  const R = nv(rate);
  const T = nv(years);
  const N = nv(freq);
  const A = nv(annualAddition);

  // FV of lump sum + FV of annual additions (added once per year, compounded at annual rate)
  const fvLump = P * Math.pow(1 + (R / 100) / N, N * T);
  const annualRate = Math.pow(1 + (R / 100) / N, N) - 1;
  const fvAdditions = A > 0 && annualRate > 0
    ? A * ((Math.pow(1 + annualRate, T) - 1) / annualRate)
    : A * T;
  const totalA = fvLump + fvAdditions;
  const ci = totalA - P - A * T;
  const totalContributions = P + A * Math.floor(T);

  const chartData = Array.from({ length: Math.ceil(T) + 1 }, (_, i) => {
    const lump = Math.round(P * Math.pow(1 + (R / 100) / N, N * i));
    const adds = A > 0 && annualRate > 0
      ? Math.round(A * ((Math.pow(1 + annualRate, i) - 1) / annualRate))
      : Math.round(A * i);
    return {
      year: i,
      amount: lump + adds,
      principal: Math.round(P + A * i),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold text-gray-800 mb-1">Compound Interest Calculator</h3>
        <p className="text-xs text-gray-500 mb-4">Interest is earned on both principal and accumulated interest, with optional annual additions.</p>
        <Field label="Principal amount (P)" value={principal} onChange={setPrincipal} tooltip="The initial investment amount." />
        <Field label="Annual nominal rate (R %)" value={rate} onChange={setRate} tooltip="Annual interest rate." suffix="%" maxDecimals={2} max={100} />
        <Field label="Years (T)" value={years} onChange={setYears} tooltip="Investment duration." suffix="yrs" max={100} />
        <Field label="Annual Addition" value={annualAddition} onChange={setAnnualAddition} tooltip="Amount added to the investment each year." />
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
          <ResultCard label="Total Amount" value={fmt(totalA)} color="text-primary" sub={`after ${T} yrs`} />
        </div>
        {A > 0 && (
          <div className="mb-4">
            <ResultCard label="Total Contributions" value={fmt(totalContributions)} color="text-gray-600" sub={`principal + ${fmt(A * Math.floor(T))} additions`} />
          </div>
        )}
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} />
            <ReTooltip formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="principal" stroke="#9ca3af" name="Contributions" dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="amount" stroke="#2563eb" name="Total Amount" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent></Card>
    </div>
  );
}

export default function InterestCalc() {
  return (
    <div>
      <Tabs defaultValue="simple">
        <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
          <TabsTrigger value="simple" className="text-xs">Simple Interest</TabsTrigger>
          <TabsTrigger value="compound" className="text-xs">Compound Interest</TabsTrigger>
        </TabsList>
        <TabsContent value="simple"><SimpleInterest /></TabsContent>
        <TabsContent value="compound"><CompoundInterest /></TabsContent>
      </Tabs>
      <CalculatorCTAs />
    </div>
  );
}
