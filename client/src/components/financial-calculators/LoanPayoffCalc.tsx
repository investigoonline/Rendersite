import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NumericInput } from "@/components/ui/numeric-input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer } from "recharts";
import { HelpCircle, Download, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";
import { Link } from "wouter";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function n(v: string) { return parseFloat(v) || 0; }

interface AmortRow { month: number; payment: number; principal: number; interest: number; balance: number; }

function amortize(balance: number, r: number, payment: number, extra: number): AmortRow[] {
  const rows: AmortRow[] = [];
  let bal = balance;
  let month = 0;
  while (bal > 0 && month < 600) {
    month++;
    const interestAmt = bal * r;
    const principalAmt = Math.min(payment - interestAmt + extra, bal);
    const totalPaid = interestAmt + principalAmt;
    bal = Math.max(0, bal - principalAmt);
    rows.push({ month, payment: totalPaid, principal: principalAmt, interest: interestAmt, balance: bal });
    if (bal <= 0) break;
  }
  return rows;
}

function FieldRow({ label, field, value, onChange, tooltip, suffix }: {
  label: string; field: string; value: string; onChange: (f: string, v: string) => void;
  tooltip: string; suffix?: string;
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
        <NumericInput
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className={suffix ? "pr-8" : "pl-7"}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

export default function LoanPayoffCalc() {
  const [form, setForm] = useState({ balance: "", rate: "", months: "", payment: "", extra: "" });
  const [showTable, setShowTable] = useState(false);
  const update = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }));

  const balance = n(form.balance);
  const r = n(form.rate) / 100 / 12;
  const payment = n(form.payment);
  const extra = n(form.extra);
  const months = n(form.months);

  const firstMonthInterest = balance * r;
  const paymentTooLow = payment > 0 && balance > 0 && r > 0 && payment <= firstMonthInterest;

  const standardRows = useMemo(() => (balance > 0 && r > 0 && payment > firstMonthInterest) ? amortize(balance, r, payment, 0) : [], [balance, r, payment, firstMonthInterest]);
  const extraRows = useMemo(() => (balance > 0 && r > 0 && payment > firstMonthInterest) ? amortize(balance, r, payment, extra) : [], [balance, r, payment, extra, firstMonthInterest]);

  const stdMonths = standardRows.length;
  const extMonths = extraRows.length;
  const stdInterest = standardRows.reduce((s, r) => s + r.interest, 0);
  const extInterest = extraRows.reduce((s, r) => s + r.interest, 0);
  const monthsSaved = stdMonths - extMonths;
  const interestSaved = stdInterest - extInterest;

  const chartData = useMemo(() => {
    const data = [];
    const maxLen = Math.max(standardRows.length, extraRows.length);
    const interval = Math.max(1, Math.floor(maxLen / 24));
    for (let i = 0; i < maxLen; i += interval) {
      data.push({
        month: i + 1,
        standard: standardRows[i] ? Math.round(standardRows[i].balance) : 0,
        withExtra: extraRows[i] ? Math.round(extraRows[i].balance) : 0,
      });
    }
    return data;
  }, [standardRows, extraRows]);

  const downloadCSV = () => {
    const header = "Month,Payment,Principal,Interest,Balance\n";
    const rows = extraRows.map(r =>
      `${r.month},${r.payment.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.balance.toFixed(2)}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "amortization.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Inputs */}
      <div>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Loan Details</h3>
            <FieldRow label="What is your loan principal (current outstanding balance)?" field="balance" value={form.balance} onChange={update}
              tooltip="The current outstanding loan balance you want to pay off." />
            <FieldRow label="Annual interest rate (APR) in %?" field="rate" value={form.rate} onChange={update}
              tooltip="The annual percentage rate (APR) of your loan." suffix="%" />
            <FieldRow label="Remaining term in months?" field="months" value={form.months} onChange={update}
              tooltip="How many months remain on your loan." suffix="mo" />
            <FieldRow label="Current monthly payment?" field="payment" value={form.payment} onChange={update}
              tooltip="Your current required monthly payment amount." />
            <FieldRow label="Extra monthly payment (optional)?" field="extra" value={form.extra} onChange={update}
              tooltip="Additional amount you can pay toward principal each month. Enter 0 if none." />

            {paymentTooLow && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">Your monthly payment ({fmt(payment)}) is less than or equal to the first month's interest ({fmt(firstMonthInterest)}). Increase your payment to pay off this loan.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {stdMonths > 0 && extra > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Adding {fmt(extra)}/month saves you:</p>
              <p className="text-sm text-green-700">{monthsSaved} months sooner payoff and {fmt(interestSaved)} in interest.</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Results */}
      <div className="space-y-4">
        {stdMonths > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500 mb-1">Without Extra Payment</p>
                  <p className="text-2xl font-bold text-gray-900">{stdMonths} <span className="text-sm font-normal">months</span></p>
                  <p className="text-sm text-gray-600 mt-1">Total interest:</p>
                  <p className="font-semibold text-red-600">{fmt(stdInterest)}</p>
                </CardContent>
              </Card>
              <Card className="border-primary">
                <CardContent className="pt-4">
                  <p className="text-xs text-primary mb-1">With Extra {fmt(extra)}/month</p>
                  <p className="text-2xl font-bold text-primary">{extMonths} <span className="text-sm font-normal">months</span></p>
                  <p className="text-sm text-gray-600 mt-1">Total interest:</p>
                  <p className="font-semibold text-green-600">{fmt(extInterest)}</p>
                </CardContent>
              </Card>
            </div>

            {monthsSaved > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <TrendingDown className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Months Saved</p>
                  <p className="text-xl font-bold text-primary">{monthsSaved}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <TrendingDown className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Interest Saved</p>
                  <p className="text-xl font-bold text-green-600">{fmt(interestSaved)}</p>
                </div>
              </div>
            )}

            {chartData.length > 1 && (
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs font-medium text-gray-600 mb-3">Balance Over Time</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} />
                      <ReTooltip formatter={(v: number) => fmt(v)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="standard" stroke="#9ca3af" name="Standard" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="withExtra" stroke="#2563eb" name="With Extra" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowTable(t => !t)} className="flex-1 text-xs">
                {showTable ? "Hide" : "Show"} Amortization Table
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCSV} className="flex-1 text-xs">
                <Download className="h-3 w-3 mr-1" /> Download CSV
              </Button>
            </div>

            {showTable && (
              <Card>
                <CardContent className="pt-4 p-0">
                  <div className="overflow-auto max-h-64">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          {["Month", "Payment", "Principal", "Interest", "Balance"].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(extraRows.length > 0 ? extraRows : standardRows).map(row => (
                          <tr key={row.month} className="border-t border-gray-100">
                            <td className="px-3 py-1.5">{row.month}</td>
                            <td className="px-3 py-1.5">${row.payment.toFixed(2)}</td>
                            <td className="px-3 py-1.5">${row.principal.toFixed(2)}</td>
                            <td className="px-3 py-1.5">${row.interest.toFixed(2)}</td>
                            <td className="px-3 py-1.5">${row.balance.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-gray-400 py-16">
              <TrendingDown className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Enter your loan details to see payoff projections</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
