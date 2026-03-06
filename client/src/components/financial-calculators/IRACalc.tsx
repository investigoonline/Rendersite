import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumericInput } from "@/components/ui/numeric-input";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, CheckCircle, XCircle, AlertCircle } from "lucide-react";

function nv(v: string) { return parseFloat(v) || 0; }
function fmt(n: number) { return "$" + n.toLocaleString("en-US"); }

type FilingStatus = "single" | "mfj" | "mfs" | "hoh";
type Eligibility = "full" | "partial" | "ineligible";

// 2024 IRS Roth IRA Phase-Out Ranges
const ROTH_PHASEOUT: Record<FilingStatus, { low: number; high: number }> = {
  single:  { low: 146000, high: 161000 },
  mfj:     { low: 230000, high: 240000 },
  mfs:     { low: 0,      high: 10000  },
  hoh:     { low: 146000, high: 161000 },
};

// 2024 Traditional IRA Deduction Phase-Out (covered by employer plan)
const TRAD_PHASEOUT_COVERED: Record<FilingStatus, { low: number; high: number }> = {
  single:  { low: 77000,  high: 87000  },
  mfj:     { low: 123000, high: 143000 },
  mfs:     { low: 0,      high: 10000  },
  hoh:     { low: 77000,  high: 87000  },
};
// Spouse covered, self not covered
const TRAD_PHASEOUT_SPOUSE: { low: number; high: number } = { low: 230000, high: 240000 };

function getRothEligibility(magi: number, status: FilingStatus): { eligibility: Eligibility; allowedContrib: number; reason: string } {
  const { low, high } = ROTH_PHASEOUT[status];
  const limit = 7000;
  if (magi <= low) return { eligibility: "full", allowedContrib: limit, reason: `MAGI ${fmt(magi)} is below the phase-out threshold (${fmt(low)}).` };
  if (magi >= high) return { eligibility: "ineligible", allowedContrib: 0, reason: `MAGI ${fmt(magi)} exceeds the upper phase-out limit (${fmt(high)}).` };
  const ratio = (magi - low) / (high - low);
  const allowed = Math.floor((limit * (1 - ratio)) / 10) * 10;
  return { eligibility: "partial", allowedContrib: Math.max(0, allowed), reason: `MAGI ${fmt(magi)} is within the phase-out range (${fmt(low)}–${fmt(high)}).` };
}

function getTradDeductibility(magi: number, status: FilingStatus, coveredByEmployer: boolean, spouseCovered: boolean): { status: "full" | "partial" | "none"; reason: string } {
  if (!coveredByEmployer && !spouseCovered) {
    return { status: "full", reason: "Neither you nor your spouse is covered by an employer plan. Full deduction is allowed." };
  }
  const range = coveredByEmployer ? TRAD_PHASEOUT_COVERED[status] : TRAD_PHASEOUT_SPOUSE;
  if (magi <= range.low) return { status: "full", reason: `MAGI ${fmt(magi)} is below the deduction phase-out threshold (${fmt(range.low)}).` };
  if (magi >= range.high) return { status: "none", reason: `MAGI ${fmt(magi)} exceeds the deduction phase-out limit (${fmt(range.high)}). No deduction allowed.` };
  return { status: "partial", reason: `MAGI ${fmt(magi)} falls within the deduction phase-out range (${fmt(range.low)}–${fmt(range.high)}).` };
}

function EligibilityCard({ title, status, reason, extra }: { title: string; status: "full" | "partial" | "none" | "ineligible"; reason: string; extra?: string }) {
  const config = {
    full:       { icon: <CheckCircle className="h-5 w-5" />, color: "text-green-600", bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-800", label: "Fully Eligible" },
    partial:    { icon: <AlertCircle className="h-5 w-5" />, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-800", label: "Partially Eligible" },
    none:       { icon: <XCircle className="h-5 w-5" />, color: "text-gray-500", bg: "bg-gray-50 border-gray-200", badge: "bg-gray-100 text-gray-700", label: "Not Deductible" },
    ineligible: { icon: <XCircle className="h-5 w-5" />, color: "text-red-600", bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-800", label: "Ineligible" },
  };
  const c = config[status];
  return (
    <div className={`p-4 rounded-lg border ${c.bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={c.color}>{c.icon}</span>
        <span className="font-semibold text-gray-900">{title}</span>
        <Badge className={`ml-auto ${c.badge}`}>{c.label}</Badge>
      </div>
      <p className="text-xs text-gray-600">{reason}</p>
      {extra && <p className="text-xs font-medium text-gray-800 mt-1">{extra}</p>}
    </div>
  );
}

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

export default function IRACalc() {
  const [age, setAge] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus | "">("");
  const [magi, setMagi] = useState("");
  const [earnedIncome, setEarnedIncome] = useState("");
  const [employerPlan, setEmployerPlan] = useState("");
  const [spousePlan, setSpousePlan] = useState("");
  const [plannedContrib, setPlannedContrib] = useState("");

  const ageNum = nv(age);
  const magiNum = nv(magi);
  const earnedNum = nv(earnedIncome);
  const isMarried = filingStatus === "mfj" || filingStatus === "mfs";
  const catchUp = ageNum >= 50;
  const limit = catchUp ? 8000 : 7000;
  const effectiveLimit = Math.min(limit, earnedNum);
  const plannedNum = nv(plannedContrib);
  const coveredByEmployer = employerPlan === "yes";
  const spouseCoveredBool = spousePlan === "yes";

  const roth = filingStatus ? getRothEligibility(magiNum, filingStatus as FilingStatus) : { eligibility: "ineligible" as const, allowedContrib: 0, reason: "Please select a filing status." };
  const trad = filingStatus ? getTradDeductibility(magiNum, filingStatus as FilingStatus, coveredByEmployer, isMarried && spouseCoveredBool) : { status: "none" as const, reason: "Please select a filing status." };
  const plannedOk = plannedNum <= roth.allowedContrib && plannedNum <= effectiveLimit;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Inputs */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Your Information</h3>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm font-medium text-gray-700">Current age?</label>
              <Tooltip><TooltipTrigger><HelpCircle className="h-4 w-4 text-gray-400" /></TooltipTrigger>
                <TooltipContent><p className="text-xs">Age determines catch-up contribution eligibility (50+).</p></TooltipContent></Tooltip>
            </div>
            <NumericInput value={age} onChange={e => setAge(e.target.value)} allowDecimal={false} />
            {catchUp && <p className="text-xs text-green-700 mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> You qualify for catch-up contributions (+$1,000)</p>}
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Tax filing status?</label>
            <Select value={filingStatus} onValueChange={v => setFilingStatus(v as FilingStatus | "")}>
              <SelectTrigger><SelectValue placeholder="Select filing status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="mfj">Married Filing Jointly</SelectItem>
                <SelectItem value="mfs">Married Filing Separately</SelectItem>
                <SelectItem value="hoh">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Field label="Modified Adjusted Gross Income (MAGI)?" value={magi} onChange={setMagi}
            tooltip="Your MAGI determines Roth IRA eligibility and traditional IRA deduction phase-out ranges." />
          <Field label="Total earned income for the year?" value={earnedIncome} onChange={setEarnedIncome}
            tooltip="Includes salary, wages, tips, and self-employment income. IRA contributions cannot exceed earned income." />

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Covered by employer retirement plan?</label>
            <Select value={employerPlan} onValueChange={setEmployerPlan}>
              <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes (401k, 403b, pension, etc.)</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isMarried && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Is your spouse covered by an employer plan?</label>
              <Select value={spousePlan} onValueChange={setSpousePlan}>
                <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="na">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Field label="How much do you plan to contribute?" value={plannedContrib} onChange={setPlannedContrib}
            tooltip="Enter the amount you plan to contribute to your IRA this year." />
        </CardContent>
      </Card>

      {/* Right: Results */}
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Eligibility Results</h3>
            <div className="space-y-3">
              <EligibilityCard
                title="Roth IRA Contribution"
                status={roth.eligibility}
                reason={roth.reason}
                extra={roth.eligibility !== "ineligible" ? `Maximum allowed: ${fmt(roth.allowedContrib)}` : undefined}
              />
              <EligibilityCard
                title="Traditional IRA Deduction"
                status={trad.status}
                reason={trad.reason}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Contribution Summary</h3>
            {[
              ["2024 IRA Contribution Limit", fmt(limit)],
              ["Catch-Up Eligible (Age 50+)", catchUp ? "Yes (+$1,000)" : "No"],
              ["Maximum Allowed Contribution", fmt(Math.min(effectiveLimit, roth.allowedContrib))],
              ["Your Planned Contribution", fmt(plannedNum)],
              ["Contribution Status", plannedOk ? "✓ Within Limit" : "✗ Exceeds Limit"],
              ["Roth IRA", roth.eligibility === "full" ? "Full Contribution Allowed" : roth.eligibility === "partial" ? `Partial (up to ${fmt(roth.allowedContrib)})` : "Not Eligible"],
              ["Traditional IRA Deduction", trad.status === "full" ? "Fully Deductible" : trad.status === "partial" ? "Partially Deductible" : "Non-Deductible"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b last:border-0 text-xs">
                <span className="text-gray-600">{l}</span>
                <span className={`font-semibold ${l === "Contribution Status" ? (plannedOk ? "text-green-600" : "text-red-600") : ""}`}>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className={`p-4 rounded-lg ${roth.eligibility === "full" ? "bg-green-50" : roth.eligibility === "partial" ? "bg-amber-50" : "bg-red-50"}`}>
              <p className={`font-semibold text-sm ${roth.eligibility === "full" ? "text-green-800" : roth.eligibility === "partial" ? "text-amber-800" : "text-red-800"}`}>
                {roth.eligibility === "full" ? "Good News! You are eligible for a full Roth IRA contribution."
                  : roth.eligibility === "partial" ? "You may make a partial Roth IRA contribution."
                  : "You are not eligible to contribute to a Roth IRA this year."}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Maximum contribution allowed: {fmt(roth.allowedContrib)} | Your planned: {fmt(plannedNum)} {plannedOk ? "(Allowed ✓)" : "(Exceeds limit ✗)"}
              </p>
              {catchUp && <p className="text-xs text-gray-600 mt-1">Catch-up contribution: +$1,000 eligible (age 50+)</p>}
              {trad.status !== "full" && <p className="text-xs text-gray-500 mt-2">You may {trad.status === "partial" ? "qualify for a partial tax deduction" : "not deduct"} on a Traditional IRA, depending on final tax calculations.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
