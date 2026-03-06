import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NumericInput } from "@/components/ui/numeric-input";
import { PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer } from "recharts";
import { HelpCircle, ChevronRight, ChevronLeft, Calendar, Phone } from "lucide-react";
import { Link } from "wouter";

const STEPS = ["Assets", "Real Estate", "Other Assets", "Liabilities"];

interface FormData {
  cash: string;
  investments: string;
  real_estate_value: string;
  real_estate_equity: string;
  other_assets: string;
  mortgage_balance: string;
  other_loans: string;
  credit_debt: string;
  other_liabilities: string;
}

const defaults: FormData = {
  cash: "0", investments: "0", real_estate_value: "0", real_estate_equity: "0",
  other_assets: "0", mortgage_balance: "0", other_loans: "0", credit_debt: "0", other_liabilities: "0",
};

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function n(v: string) { return parseFloat(v) || 0; }

function FieldRow({ label, field, value, onChange, tooltip, placeholder }: {
  label: string; field: string; value: string; onChange: (f: string, v: string) => void;
  tooltip: string; placeholder?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Tooltip>
          <TooltipTrigger><HelpCircle className="h-4 w-4 text-gray-400" /></TooltipTrigger>
          <TooltipContent className="max-w-xs"><p className="text-xs">{tooltip}</p></TooltipContent>
        </Tooltip>
      </div>
      {placeholder && <p className="text-xs text-gray-400 mb-1">{placeholder}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>
        <NumericInput
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="pl-7"
        />
      </div>
    </div>
  );
}

export default function NetWorthCalc() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaults);

  const update = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }));

  const totalAssets = n(form.cash) + n(form.investments) + n(form.real_estate_equity) + n(form.other_assets);
  const totalLiabilities = n(form.mortgage_balance) + n(form.other_loans) + n(form.credit_debt) + n(form.other_liabilities);
  const netWorth = totalAssets - totalLiabilities;
  const isPositive = netWorth >= 0;

  const pieData = totalAssets + totalLiabilities > 0
    ? [
        { name: "Assets", value: totalAssets, color: "#16a34a" },
        { name: "Liabilities", value: totalLiabilities, color: "#dc2626" },
      ].filter(d => d.value > 0)
    : [];

  const steps = [
    <>
      <h3 className="font-semibold text-gray-800 mb-4">Calculate Your Assets</h3>
      <FieldRow label="What is the value of your cash & bank balances?" field="cash" value={form.cash} onChange={update}
        tooltip="Include all checking, savings, money market, and CD accounts."
        placeholder="Enter cash holdings and balances in checking & savings accounts." />
      <FieldRow label="Total market value of investments (stocks, mutual funds, bonds)?" field="investments" value={form.investments} onChange={update}
        tooltip="Include stocks, mutual funds, bonds, ETFs, and other investment holdings."
        placeholder="Include stocks, mutual funds, bonds, and other investment holdings." />
    </>,
    <>
      <h3 className="font-semibold text-gray-800 mb-4">Real Estate</h3>
      <FieldRow label="Current value of real estate you own?" field="real_estate_value" value={form.real_estate_value} onChange={update}
        tooltip="The current market value of all real estate properties you own."
        placeholder="Enter the current market value of your property." />
      <FieldRow label="How much equity do you have in the property?" field="real_estate_equity" value={form.real_estate_equity} onChange={update}
        tooltip="Current value minus outstanding mortgage balance. Optional if you provide mortgage separately in liabilities."
        placeholder="Current value minus outstanding mortgage (equity portion only)." />
    </>,
    <>
      <h3 className="font-semibold text-gray-800 mb-4">Other Assets</h3>
      <FieldRow label="Value of vehicles, jewellery, and other assets?" field="other_assets" value={form.other_assets} onChange={update}
        tooltip="Include cars, motorcycles, jewellery, collectibles, business interests, and any other valuable assets."
        placeholder="Include vehicles, jewellery, collectibles, and other valuables." />
    </>,
    <>
      <h3 className="font-semibold text-gray-800 mb-4">Your Liabilities</h3>
      <FieldRow label="Outstanding mortgage balance?" field="mortgage_balance" value={form.mortgage_balance} onChange={update}
        tooltip="The remaining balance on your home mortgage(s)."
        placeholder="Total remaining mortgage balance." />
      <FieldRow label="Outstanding car or other loans?" field="other_loans" value={form.other_loans} onChange={update}
        tooltip="Auto loans, personal loans, student loans, or any other installment debt."
        placeholder="Car loans, personal loans, student loans, etc." />
      <FieldRow label="Outstanding credit card balances or other debts?" field="credit_debt" value={form.credit_debt} onChange={update}
        tooltip="Total outstanding credit card balances and revolving credit."
        placeholder="Total credit card and revolving debt balances." />
      <FieldRow label="Any other liabilities?" field="other_liabilities" value={form.other_liabilities} onChange={update}
        tooltip="Any additional debts not listed above (medical bills, tax obligations, etc.)."
        placeholder="Any remaining debts or financial obligations." />
    </>,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Form */}
      <div>
        {/* Stepper */}
        <div className="mb-6">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    i === step ? "text-primary" : i < step ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                    i === step ? "border-primary bg-primary text-white" :
                    i < step ? "border-green-600 bg-green-600 text-white" :
                    "border-gray-300 text-gray-400"
                  }`}>{i + 1}</span>
                  <span className="hidden sm:inline">{s}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-green-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">Step {step + 1} of {STEPS.length}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">{step + 1}</span>
              <h2 className="font-bold text-gray-900">{STEPS[step]}</h2>
            </div>
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

      {/* Right: Results */}
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Your Results</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <ReTooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Enter values to see your chart</div>
            )}

            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Assets</span>
                <span className="font-semibold text-green-600">{fmt(totalAssets)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Liabilities</span>
                <span className="font-semibold text-red-600">{fmt(totalLiabilities)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-bold text-gray-900 text-lg">Net Worth</span>
                <span className={`font-bold text-xl ${isPositive ? "text-green-600" : "text-red-600"}`}>{fmt(netWorth)}</span>
              </div>
            </div>

            {totalAssets > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Assets</span><span>Liabilities</span>
                </div>
                <Progress value={totalAssets / (totalAssets + totalLiabilities) * 100} className="h-3" />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href="/contact">
              <Calendar className="h-4 w-4 mr-2" /> Book an Appointment
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/contact">
              <Phone className="h-4 w-4 mr-2" /> Speak to Expert
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => alert("Save Snapshot: Sign in to save your net worth snapshot and track changes over time.")}>
            Save Snapshot
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => alert("Compare to Previous: Sign in to compare your current net worth with past snapshots.")}>
            Compare to Previous
          </Button>
        </div>
      </div>
    </div>
  );
}
