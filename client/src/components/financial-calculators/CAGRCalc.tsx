import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NumericInput } from "@/components/ui/numeric-input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { HelpCircle, TrendingUp } from "lucide-react";

function fmt(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return n.toFixed(2) + "%"; }
function nv(v: string) { return parseFloat(v) || 0; }

function Field({ label, value, onChange, tooltip, suffix }: {
  label: string; value: string; onChange: (v: string) => void; tooltip: string; suffix?: string;
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
        <NumericInput value={value} onChange={e => onChange(e.target.value)} className={suffix ? "pr-10" : "pl-7"} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

export default function CAGRCalc() {
  const [bv, setBv] = useState("");
  const [ev, setEv] = useState("");
  const [years, setYears] = useState("");

  const BV = nv(bv); const EV = nv(ev); const n = nv(years);

  const cagr = BV > 0 && n > 0 ? (Math.pow(EV / BV, 1 / n) - 1) * 100 : 0;
  const absoluteReturn = BV > 0 ? ((EV - BV) / BV) * 100 : 0;
  const totalProfit = EV - BV;
  const wealthMultiple = BV > 0 ? EV / BV : 0;

  const chartData = Array.from({ length: Math.ceil(n) + 1 }, (_, i) => ({
    year: i,
    value: Math.round(BV * Math.pow(1 + cagr / 100, i)),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Inputs */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-1">CAGR Calculator</h3>
          <p className="text-xs text-gray-500 mb-4">Compound Annual Growth Rate — the mean annual growth rate of an investment over a period longer than one year.</p>
          <Field label="What was your initial investment value?" value={bv} onChange={setBv}
            tooltip="The starting value or beginning investment amount." />
          <Field label="What is the current or final value?" value={ev} onChange={setEv}
            tooltip="The ending or current value of the investment." />
          <Field label="How many years was the investment held?" value={years} onChange={setYears}
            tooltip="The number of years the investment was held." suffix="yrs" />
        </CardContent>
      </Card>

      {/* Right: Results */}
      <div className="space-y-4">
        {cagr !== 0 && (
          <>
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Compound Annual Growth Rate</p>
                <p className="text-6xl font-bold text-primary">{fmtPct(cagr)}</p>
                <p className="text-sm text-gray-500 mt-1">per year over {n} years</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-xs text-gray-500">Absolute Return</p>
                  <p className="text-lg font-bold text-green-600">{fmtPct(absoluteReturn)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-xs text-gray-500">Total Profit</p>
                  <p className="text-lg font-bold text-green-600">{fmt(totalProfit)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <p className="text-xs text-gray-500">Wealth Multiple</p>
                  <p className="text-lg font-bold text-primary">{wealthMultiple.toFixed(2)}x</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-4">
                <p className="text-xs font-medium text-gray-600 mb-3">Investment Growth Over Time</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} />
                    <ReTooltip formatter={(v: number) => fmt(v)} labelFormatter={l => `Year ${l}`} />
                    <ReferenceLine y={EV} stroke="#dc2626" strokeDasharray="3 3" label={{ value: "Final", position: "right", fontSize: 9 }} />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" name="Value" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                {[
                  ["Beginning Value", fmt(BV)],
                  ["Ending Value", fmt(EV)],
                  ["Years Held", n.toString()],
                  ["Total Profit", fmt(totalProfit)],
                  ["Wealth Multiple", wealthMultiple.toFixed(2) + "x"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b last:border-0 text-xs">
                    <span className="text-gray-600">{l}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
        {cagr === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-gray-400 py-16">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Enter your investment values to calculate CAGR</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
