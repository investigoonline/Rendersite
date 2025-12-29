import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Save, Download, Mail, Lock } from "lucide-react";
import { useCalculatorPermission } from "@/hooks/useCalculatorPermission";
import { Alert, AlertDescription } from "@/components/ui/alert";

const taxSchema = z.object({
  filingStatus: z.enum(["single", "married_filing_jointly", "married_filing_separately", "head_of_household"]),
  annualIncome: z.coerce.number().min(0, "Annual income must be positive"),
  deductions: z.coerce.number().min(0).default(0),
  exemptions: z.coerce.number().min(0).default(0),
  stateTax: z.coerce.number().min(0).max(15, "State tax rate must be between 0 and 15").default(0),
  // Estate tax specific fields
  estateValue: z.coerce.number().min(0).default(0),
  exemptionAmount: z.coerce.number().min(0).default(12920000), // 2023 federal exemption
  // IRA specific fields
  iraContribution: z.coerce.number().min(0).default(0),
  age: z.coerce.number().min(18).max(100).default(30),
  employerPlan: z.boolean().default(false),
});

type TaxForm = z.infer<typeof taxSchema>;

interface TaxCalculatorProps {
  calculatorName?: string;
}

export default function TaxCalculator({ calculatorName = "Federal Income Tax Calculator" }: TaxCalculatorProps = {}) {
  const { toast } = useToast();
  const [calculatorType, setCalculatorType] = useState("federal_tax");
  
  const { hasPermission, isLoading: permissionLoading } = useCalculatorPermission(calculatorName);
  
  const [results, setResults] = useState<{
    federalTax: number;
    stateTax: number;
    totalTax: number;
    afterTaxIncome: number;
    effectiveRate: number;
    marginalRate: number;
    estateRax?: number;
    iraEligible?: boolean;
    iraContributionLimit?: number;
    taxSavings?: number;
  } | null>(null);

  const form = useForm<TaxForm>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      filingStatus: "single",
      annualIncome: 0,
      deductions: 14600, // 2023 standard deduction for single
      exemptions: 0,
      stateTax: 0,
      estateValue: 0,
      exemptionAmount: 12920000,
      iraContribution: 0,
      age: 30,
      employerPlan: false,
    },
  });

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/calculations", "POST", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Calculation Saved",
        description: "Your tax calculation has been saved to your account.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save calculation",
        variant: "destructive",
      });
    },
  });

  const calculateTaxes = (data: TaxForm) => {
    // Federal tax brackets for 2023 (simplified)
    const taxBrackets = {
      single: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182050, rate: 0.24 },
        { min: 182050, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: Infinity, rate: 0.37 },
      ],
      married_filing_jointly: [
        { min: 0, max: 22000, rate: 0.10 },
        { min: 22000, max: 89450, rate: 0.12 },
        { min: 89450, max: 190750, rate: 0.22 },
        { min: 190750, max: 364200, rate: 0.24 },
        { min: 364200, max: 462500, rate: 0.32 },
        { min: 462500, max: 693750, rate: 0.35 },
        { min: 693750, max: Infinity, rate: 0.37 },
      ],
    };

    const brackets = taxBrackets[data.filingStatus as keyof typeof taxBrackets] || taxBrackets.single;
    const taxableIncome = Math.max(0, data.annualIncome - data.deductions - data.exemptions);
    
    let federalTax = 0;
    let marginalRate = 0;
    
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInThisBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        federalTax += taxableInThisBracket * bracket.rate;
        marginalRate = bracket.rate;
      }
    }

    const stateTax = taxableIncome * (data.stateTax / 100);
    const totalTax = federalTax + stateTax;
    const afterTaxIncome = data.annualIncome - totalTax;
    const effectiveRate = data.annualIncome > 0 ? (totalTax / data.annualIncome) * 100 : 0;

    // Estate tax calculation
    const estateRax = calculatorType === "estate_tax" 
      ? Math.max(0, (data.estateValue - data.exemptionAmount) * 0.40) 
      : undefined;

    // IRA eligibility calculation
    const iraEligible = calculatorType === "ira_eligibility" 
      ? data.age >= 18 && data.age < 70.5 
      : undefined;
    
    const iraContributionLimit = calculatorType === "ira_eligibility" 
      ? (data.age >= 50 ? 7500 : 6500) // 2023 limits with catch-up
      : undefined;

    const taxSavings = calculatorType === "tax_deferred" 
      ? data.iraContribution * marginalRate 
      : undefined;

    setResults({
      federalTax,
      stateTax,
      totalTax,
      afterTaxIncome,
      effectiveRate: effectiveRate,
      marginalRate: marginalRate * 100,
      estateRax,
      iraEligible,
      iraContributionLimit,
      taxSavings,
    });
  };

  const handleSave = () => {
    if (results) {
      const formData = form.getValues();
      saveCalculationMutation.mutate({
        calculatorType: `tax_${calculatorType}`,
        category: calculatorType.includes("estate") ? "estate_planning" : "taxes_iras",
        inputs: formData,
        results,
        saved: true,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="max-w-6xl mx-auto shadow-xl border border-gray-200 overflow-hidden">
      {/* Calculator Header */}
      <CardHeader className="gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2 flex items-center">
              <FileText className="mr-3 h-6 w-6" />
              Tax Planning Calculator
            </CardTitle>
            <p className="text-blue-100">Federal and state tax calculations, estate planning, and IRA analysis</p>
          </div>
          {results && (
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">
                {calculatorType === "estate_tax" 
                  ? formatCurrency(results.estateRax || 0)
                  : formatCurrency(results.totalTax)
                }
              </div>
              <div className="text-sm text-blue-100">
                {calculatorType === "estate_tax" ? "Estate Tax" : "Total Tax"}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Tabs value={calculatorType} onValueChange={setCalculatorType} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="federal_tax">Federal Tax</TabsTrigger>
            <TabsTrigger value="tax_deferred">Tax-Deferred</TabsTrigger>
            <TabsTrigger value="ira_eligibility">IRA Eligibility</TabsTrigger>
            <TabsTrigger value="estate_tax">Estate Tax</TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateTaxes)} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Income Information */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Income Information</h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="filingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filing Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select filing status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                            <SelectItem value="married_filing_separately">Married Filing Separately</SelectItem>
                            <SelectItem value="head_of_household">Head of Household</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Gross Income</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="pl-8 font-mono"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Deductions</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <Input
                              type="number"
                              placeholder="14600"
                              className="pl-8 font-mono"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stateTax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State Tax Rate</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0"
                              className="pr-8 font-mono"
                              {...field}
                            />
                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Fields based on calculator type */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">
                  {calculatorType === "estate_tax" ? "Estate Information" :
                   calculatorType === "ira_eligibility" ? "IRA Information" :
                   "Additional Information"}
                </h4>
                
                <div className="space-y-4">
                  {calculatorType === "estate_tax" && (
                    <>
                      <FormField
                        control={form.control}
                        name="estateValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Estate Value</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-8 font-mono"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="exemptionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Federal Exemption Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <Input
                                  type="number"
                                  placeholder="12920000"
                                  className="pl-8 font-mono"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {(calculatorType === "ira_eligibility" || calculatorType === "tax_deferred") && (
                    <>
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="30"
                                className="font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="iraContribution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Planned IRA Contribution</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-8 font-mono"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="px-8"
                  disabled={!hasPermission || permissionLoading}
                  data-testid="button-calculate"
                >
                  {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                  Calculate Taxes
                </Button>
              </div>
              
              {!hasPermission && !permissionLoading && (
                <Alert className="border-amber-200 bg-amber-50">
                  <Lock className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This calculator is not available with your current account. <a href="/contact" className="underline font-medium">Contact us to upgrade your account</a> and unlock all features.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Results Section */}
            {results && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                {calculatorType === "federal_tax" && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold font-mono text-primary mb-2">
                        {formatCurrency(results.federalTax)}
                      </div>
                      <div className="text-sm font-medium text-gray-700">Federal Tax</div>
                    </div>
                    <div className="text-center p-6 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold font-mono text-secondary mb-2">
                        {formatCurrency(results.stateTax)}
                      </div>
                      <div className="text-sm font-medium text-gray-700">State Tax</div>
                    </div>
                    <div className="text-center p-6 bg-accent/5 rounded-lg">
                      <div className="text-2xl font-bold font-mono text-accent mb-2">
                        {results.effectiveRate.toFixed(1)}%
                      </div>
                      <div className="text-sm font-medium text-gray-700">Effective Rate</div>
                    </div>
                    <div className="text-center p-6 bg-background rounded-lg">
                      <div className="text-2xl font-bold font-mono text-gray-900 mb-2">
                        {formatCurrency(results.afterTaxIncome)}
                      </div>
                      <div className="text-sm font-medium text-gray-700">After-Tax Income</div>
                    </div>
                  </div>
                )}

                {calculatorType === "estate_tax" && results.estateRax !== undefined && (
                    <div className="text-center p-8 bg-primary/5 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Federal Estate Tax
                      </h3>
                      <div className="text-3xl font-bold font-mono text-primary mb-2">
                        {formatCurrency(results.estateRax)}
                      </div>
                      <p className="text-muted-foreground">
                        Tax owed on estate value above federal exemption
                      </p>
                    </div>
                )}

                {calculatorType === "ira_eligibility" && results.iraEligible !== undefined && (
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="text-center p-6 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {results.iraEligible ? "Eligible" : "Not Eligible"}
                        </div>
                        <div className="text-sm font-medium text-gray-700">IRA Eligibility</div>
                      </div>
                      <div className="text-center p-6 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold font-mono text-secondary mb-2">
                          {formatCurrency(results.iraContributionLimit || 0)}
                        </div>
                        <div className="text-sm font-medium text-gray-700">Contribution Limit</div>
                      </div>
                    </div>
                )}

                {calculatorType === "tax_deferred" && results.taxSavings !== undefined && (
                    <div className="text-center p-8 bg-secondary/5 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Tax Savings from IRA Contribution
                      </h3>
                      <div className="text-3xl font-bold font-mono text-secondary mb-2">
                        {formatCurrency(results.taxSavings)}
                      </div>
                      <p className="text-muted-foreground">
                        Annual tax savings from traditional IRA contributions
                      </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="flex-1"
                    disabled={saveCalculationMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Results
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Results
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}