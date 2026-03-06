import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NumericInput } from "@/components/ui/numeric-input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { HelpCircle, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return n.toFixed(1) + "%"; }
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
        {!suffix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">$</span>}
        <NumericInput value={value} onChange={e => onChange(e.target.value)}
          className={suffix ? "pr-10" : "pl-7"} placeholder={placeholder || "0"} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h4 className="font-semibold text-sm text-primary uppercase tracking-wide mb-3 mt-5 first:mt-0 border-b border-primary/20 pb-1">{title}</h4>;
}

export default function RetirementCalc() {
  const [age, setAge] = useState("");
  const [retireAge, setRetireAge] = useState("");
  const [lifeExp, setLifeExp] = useState("");
  const [currentIncome, setCurrentIncome] = useState("");
  const [desiredIncome, setDesiredIncome] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContrib, setMonthlyContrib] = useState("");
  const [returnPre, setReturnPre] = useState("");
  const [returnPost, setReturnPost] = useState("");
  const [inflation, setInflation] = useState("");

  const a = nv(age); const ra = nv(retireAge); const le = nv(lifeExp);
  const ci = nv(currentIncome); const di = nv(desiredIncome);
  const cs = nv(currentSavings); const mc = nv(monthlyContrib);
  const rPre = nv(returnPre) / 100; const rPost = nv(returnPost) / 100;
  const infl = nv(inflation) / 100;

  const yearsToRetire = Math.max(0, ra - a);
  const retirementYears = Math.max(0, le - ra);
  const replacementRatio = ci > 0 ? (di / ci) * 100 : 0;

  // Inflation-adjusted income at retirement
  const futureIncome = di * Math.pow(1 + infl, yearsToRetire);

  // Nest egg needed (annuity formula)
  const nestEgg = rPost > 0 && retirementYears > 0
    ? futureIncome * (1 - Math.pow(1 + rPost, -retirementYears)) / rPost
    : futureIncome * retirementYears;

  // FV of current savings
  const fvSavings = cs * Math.pow(1 + rPre, yearsToRetire);

  // FV of monthly contributions
  const rMonthly = rPre / 12;
  const nMonths = yearsToRetire * 12;
  const fvContrib = rMonthly > 0
    ? mc * (Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly
    : mc * nMonths;

  const totalSavings = fvSavings + fvContrib;
  const gap = totalSavings - nestEgg;
  const isOnTrack = gap >= 0;
  const progressPct = nestEgg > 0 ? Math.min(100, (totalSavings / nestEgg) * 100) : 0;

  const replacementLabel = replacementRatio >= 90 ? { text: "Premium Lifestyle", cls: "bg-purple-100 text-purple-800" }
    : replacementRatio >= 70 ? { text: "Comfortable Retirement", cls: "bg-green-100 text-green-800" }
    : { text: "Basic Lifestyle", cls: "bg-amber-100 text-amber-800" };

  const chartData = [
    { name: "FV Savings", value: Math.round(fvSavings), fill: "#2563eb" },
    { name: "FV Contributions", value: Math.round(fvContrib), fill: "#16a34a" },
    { name: "Required Corpus", value: Math.round(nestEgg), fill: "#dc2626" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Inputs */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle title="Personal & Timeline" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Current Age</label>
              <NumericInput value={age} onChange={e => setAge(e.target.value)} allowDecimal={false} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Retire Age</label>
              <NumericInput value={retireAge} onChange={e => setRetireAge(e.target.value)} allowDecimal={false} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Life Expectancy</label>
              <NumericInput value={lifeExp} onChange={e => setLifeExp(e.target.value)} allowDecimal={false} />
            </div>
          </div>
          <SectionTitle title="Income" />
          <Field label="Current annual income?" value={currentIncome} onChange={setCurrentIncome}
            tooltip="Your current total annual gross income." />
          <Field label="Desired annual income in retirement (today's dollars)?" value={desiredIncome} onChange={setDesiredIncome}
            tooltip="How much annual income you want during retirement, in today's dollars. Will be inflation-adjusted." />
          <SectionTitle title="Savings & Contributions" />
          <Field label="Current retirement savings (total)?" value={currentSavings} onChange={setCurrentSavings}
            tooltip="Total of all retirement savings including 401(k), IRA, pension, and other investment accounts." />
          <Field label="Monthly contribution toward retirement?" value={monthlyContrib} onChange={setMonthlyContrib}
            tooltip="How much you contribute to retirement savings each month." />
          <SectionTitle title="Investment Assumptions" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <label className="text-xs font-medium text-gray-700">Pre-Ret. Return</label>
                <Tooltip><TooltipTrigger><HelpCircle className="h-3 w-3 text-gray-400" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs">Expected annual investment return before retirement.</p></TooltipContent></Tooltip>
              </div>
              <div className="relative"><NumericInput value={returnPre} onChange={e => setReturnPre(e.target.value)} className="pr-6" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">%</span></div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <label className="text-xs font-medium text-gray-700">Post-Ret. Return</label>
                <Tooltip><TooltipTrigger><HelpCircle className="h-3 w-3 text-gray-400" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs">Expected annual return after retiring (usually lower, more conservative).</p></TooltipContent></Tooltip>
              </div>
              <div className="relative"><NumericInput value={returnPost} onChange={e => setReturnPost(e.target.value)} className="pr-6" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">%</span></div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <label className="text-xs font-medium text-gray-700">Inflation</label>
                <Tooltip><TooltipTrigger><HelpCircle className="h-3 w-3 text-gray-400" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs">Expected annual inflation rate.</p></TooltipContent></Tooltip>
              </div>
              <div className="relative"><NumericInput value={inflation} onChange={e => setInflation(e.target.value)} className="pr-6" /><span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">%</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right: Results */}
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">Retirement Outlook</h3>
              <Badge className={replacementLabel.cls}>{replacementLabel.text}</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-4">Replacement ratio: {fmtPct(replacementRatio)} • {yearsToRetire} yrs to retirement • {retirementYears} yrs in retirement</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Required Nest Egg</p>
                <p className="text-lg font-bold text-red-700">{fmt(Math.round(nestEgg))}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Projected Savings</p>
                <p className="text-lg font-bold text-primary">{fmt(Math.round(totalSavings))}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress toward nest egg</span>
                <span>{fmtPct(progressPct)}</span>
              </div>
              <Progress value={progressPct} className="h-3" />
            </div>

            <div className={`p-3 rounded-lg border ${isOnTrack ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-start gap-2">
                {isOnTrack
                  ? <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  : <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className={`text-sm font-semibold ${isOnTrack ? "text-green-800" : "text-red-800"}`}>
                    {isOnTrack ? `Surplus: ${fmt(Math.round(gap))}` : `Shortfall: ${fmt(Math.round(Math.abs(gap)))}`}
                  </p>
                  <p className={`text-xs mt-0.5 ${isOnTrack ? "text-green-700" : "text-red-700"}`}>
                    {isOnTrack
                      ? "You are on track for a comfortable retirement. Keep it up!"
                      : "Consider increasing your monthly contribution or adjusting your retirement age to close the gap."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-medium text-gray-600 mb-3">Savings Breakdown vs Required Corpus</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => "$" + (v / 1000000 >= 1 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "k")} />
                <ReTooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-medium text-gray-600 mb-3">Detailed Summary</p>
            {[
              ["Inflation-Adjusted Income Needed", fmt(Math.round(futureIncome)) + "/yr"],
              ["FV of Current Savings", fmt(Math.round(fvSavings))],
              ["FV of Monthly Contributions", fmt(Math.round(fvContrib))],
              ["Total Projected Savings", fmt(Math.round(totalSavings))],
              ["Required Nest Egg", fmt(Math.round(nestEgg))],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b last:border-0 text-xs">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold">{val}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="w-full"><Link href="/contact">Book Appointment</Link></Button>
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white"><Link href="/contact">Speak to Expert</Link></Button>
        </div>
      </div>
    </div>
  );
}
