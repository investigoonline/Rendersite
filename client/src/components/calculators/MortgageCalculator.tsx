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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Home, Save, Download, Mail, Lock } from "lucide-react";
import { useCalculatorPermission } from "@/hooks/useCalculatorPermission";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CalculatorDisclaimer from "./CalculatorDisclaimer";

const mortgageSchema = z.object({
  homePrice: z.coerce.number().min(1, "Home price is required"),
  downPayment: z.coerce.number().min(0, "Down payment must be positive"),
  loanTerm: z.coerce.number().min(1).max(50, "Loan term must be between 1 and 50 years"),
  interestRate: z.coerce.number().min(0).max(50, "Interest rate must be between 0 and 50"),
  propertyTax: z.coerce.number().min(0).default(0),
  insurance: z.coerce.number().min(0).default(0),
  pmi: z.coerce.number().min(0).default(0),
  hoaFees: z.coerce.number().min(0).default(0),
});

type MortgageForm = z.infer<typeof mortgageSchema>;

interface MortgageCalculatorProps {
  calculatorName?: string;
  cardTitle?: string;
  cardDescription?: string;
  disclaimer?: string;
}

const defaultDisclaimer = "This example is for illustrative purposes only, and actual outcomes may differ. The information provided does not constitute tax, legal, investment, or retirement advice and should not be used to avoid federal tax penalties. Readers are advised to consult an independent tax, legal, or financial professional before making any decisions. While the content is based on sources believed to be reliable, no guarantee is made for accuracy or completeness. Nothing herein should be interpreted as an offer or solicitation to buy or sell any security.";

// Map calculator name to tab value
const getInitialTab = (calculatorName: string): string => {
  const nameToTab: Record<string, string> = {
    "Home Affordability Calculator": "affordability",
    "home_affordability": "affordability",
    "Mortgage Refinancing Calculator": "refinance",
    "mortgage_refinance": "refinance",
    "Mortgage Acceleration Calculator": "acceleration",
    "mortgage_acceleration": "acceleration",
  };
  return nameToTab[calculatorName] || "affordability";
};

export default function MortgageCalculator({ 
  calculatorName = "Home Affordability Calculator",
  cardTitle,
  cardDescription,
  disclaimer = defaultDisclaimer
}: MortgageCalculatorProps = {}) {
  const { toast } = useToast();
  const [calculatorType, setCalculatorType] = useState(() => getInitialTab(calculatorName));
  
  const { hasPermission, isLoading: permissionLoading } = useCalculatorPermission(calculatorName);
  
  const [results, setResults] = useState<{
    monthlyPayment: number;
    principal: number;
    totalInterest: number;
    totalPayments: number;
    loanAmount: number;
    downPaymentPercent: number;
    monthlyTaxInsurance: number;
    totalMonthlyPayment: number;
    refinanceSavings?: number;
    refinanceNewPayment?: number;
    refinanceCurrentPayment?: number;
    accelerationMonthsSaved?: number;
    accelerationInterestSaved?: number;
    accelerationNewPayoff?: number;
  } | null>(null);

  const form = useForm<MortgageForm>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      homePrice: 0,
      downPayment: 0,
      loanTerm: 30,
      interestRate: 0,
      propertyTax: 0,
      insurance: 0,
      pmi: 0,
      hoaFees: 0,
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
        description: "Your mortgage calculation has been saved to your account.",
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

  const calculateMortgage = (data: MortgageForm) => {
    const calcMonthlyPayment = (principal: number, rate: number, termYears: number) => {
      const monthlyRate = rate / 100 / 12;
      const numberOfPayments = termYears * 12;
      if (monthlyRate > 0) {
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
      return principal / numberOfPayments;
    };

    let refinanceSavings, refinanceNewPayment, refinanceCurrentPayment;
    let accelerationMonthsSaved, accelerationInterestSaved, accelerationNewPayoff;

    if (calculatorType === "refinance") {
      const currentBalance = data.homePrice;
      const currentRate = data.interestRate;
      const remainingTerm = data.loanTerm;
      const newRate = data.downPayment;

      refinanceCurrentPayment = calcMonthlyPayment(currentBalance, currentRate, remainingTerm);
      refinanceNewPayment = calcMonthlyPayment(currentBalance, newRate, remainingTerm);
      refinanceSavings = (refinanceCurrentPayment - refinanceNewPayment) * remainingTerm * 12;

      const numberOfPayments = remainingTerm * 12;
      const totalPayments = refinanceNewPayment * numberOfPayments;
      const totalInterest = totalPayments - currentBalance;

      setResults({
        monthlyPayment: refinanceNewPayment,
        principal: currentBalance,
        totalInterest,
        totalPayments,
        loanAmount: currentBalance,
        downPaymentPercent: 0,
        monthlyTaxInsurance: 0,
        totalMonthlyPayment: refinanceNewPayment,
        refinanceSavings,
        refinanceNewPayment,
        refinanceCurrentPayment,
      });
    } else if (calculatorType === "acceleration") {
      const currentBalance = data.homePrice;
      const rate = data.interestRate;
      const remainingTerm = data.loanTerm;
      const extraPayment = data.downPayment;

      const basePayment = calcMonthlyPayment(currentBalance, rate, remainingTerm);
      const monthlyRate = rate / 100 / 12;
      const normalPayments = remainingTerm * 12;
      const normalTotal = basePayment * normalPayments;

      let balance = currentBalance;
      let months = 0;
      let totalPaid = 0;
      const acceleratedPayment = basePayment + extraPayment;
      
      if (monthlyRate > 0 && acceleratedPayment <= currentBalance * monthlyRate) {
        accelerationMonthsSaved = 0;
        accelerationInterestSaved = 0;
        accelerationNewPayoff = remainingTerm;
        setResults({
          monthlyPayment: basePayment,
          principal: currentBalance,
          totalInterest: normalTotal - currentBalance,
          totalPayments: normalTotal,
          loanAmount: currentBalance,
          downPaymentPercent: 0,
          monthlyTaxInsurance: 0,
          totalMonthlyPayment: acceleratedPayment,
          accelerationMonthsSaved: 0,
          accelerationInterestSaved: 0,
          accelerationNewPayoff: remainingTerm,
        });
        return;
      }
      
      const maxIterations = normalPayments * 3;
      while (balance > 0 && months < maxIterations) {
        const interest = balance * monthlyRate;
        const principalPaid = Math.min(acceleratedPayment - interest, balance);
        balance = Math.max(0, balance - principalPaid);
        totalPaid += Math.min(acceleratedPayment, principalPaid + interest);
        months++;
      }

      accelerationMonthsSaved = normalPayments - months;
      accelerationInterestSaved = normalTotal - totalPaid;
      accelerationNewPayoff = months / 12;

      setResults({
        monthlyPayment: basePayment,
        principal: currentBalance,
        totalInterest: totalPaid - currentBalance,
        totalPayments: totalPaid,
        loanAmount: currentBalance,
        downPaymentPercent: 0,
        monthlyTaxInsurance: 0,
        totalMonthlyPayment: acceleratedPayment,
        accelerationMonthsSaved,
        accelerationInterestSaved,
        accelerationNewPayoff,
      });
    } else {
      const loanAmount = data.homePrice - data.downPayment;
      const monthlyPayment = calcMonthlyPayment(loanAmount, data.interestRate, data.loanTerm);
      const numberOfPayments = data.loanTerm * 12;
      const totalPayments = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayments - loanAmount;
      const downPaymentPercent = data.homePrice > 0 ? (data.downPayment / data.homePrice) * 100 : 0;
      const monthlyTaxInsurance = (data.propertyTax + data.insurance + data.pmi + data.hoaFees) / 12;
      const totalMonthlyPayment = monthlyPayment + monthlyTaxInsurance;

      setResults({
        monthlyPayment,
        principal: loanAmount,
        totalInterest,
        totalPayments,
        loanAmount,
        downPaymentPercent,
        monthlyTaxInsurance,
        totalMonthlyPayment,
      });
    }
  };

  const handleSave = () => {
    if (results) {
      const formData = form.getValues();
      saveCalculationMutation.mutate({
        calculatorType: `mortgage_${calculatorType}`,
        category: "real_estate",
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
              <Home className="mr-3 h-6 w-6" />
              {cardTitle || "Mortgage & Housing Calculator"}
            </CardTitle>
            <p className="text-blue-100">{cardDescription || "Calculate home affordability and mortgage payments"}</p>
          </div>
          {results && (
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">
                {formatCurrency(results.totalMonthlyPayment)}
              </div>
              <div className="text-sm text-blue-100">Total Monthly Payment</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Tabs value={calculatorType} onValueChange={setCalculatorType} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="affordability">Home Affordability</TabsTrigger>
            <TabsTrigger value="refinance">Mortgage Refinance</TabsTrigger>
            <TabsTrigger value="acceleration">Payment Acceleration</TabsTrigger>
          </TabsList>

          <TabsContent value="affordability" className="mt-6">
            <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateMortgage)} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Loan Details */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Loan Information</h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="homePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Purchase Price</FormLabel>
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
                    name="downPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Down Payment</FormLabel>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Term</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="30"
                                className="pr-16 font-mono"
                                {...field}
                              />
                              <span className="absolute right-3 top-3 text-gray-500">years</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Rate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
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
              </div>

              {/* Additional Costs */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Additional Monthly Costs</h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="propertyTax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Property Tax</FormLabel>
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
                    name="insurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Home Insurance</FormLabel>
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
                    name="pmi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual PMI</FormLabel>
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
                    name="hoaFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual HOA Fees</FormLabel>
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
                  Calculate Mortgage Payment
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

          </form>
            </Form>
          </TabsContent>

          <TabsContent value="refinance" className="mt-6">
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mortgage Refinance Calculator</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Compare your current mortgage with refinancing options to see potential savings.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateMortgage)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="homePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Loan Balance</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Interest Rate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="number" step="0.01" placeholder="0" className="pr-8 font-mono" {...field} />
                              <span className="absolute right-3 top-3 text-gray-500">%</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remaining Term</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="number" placeholder="30" className="pr-16 font-mono" {...field} />
                              <span className="absolute right-3 top-3 text-gray-500">years</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="downPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Interest Rate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="number" step="0.01" placeholder="0" className="pr-8 font-mono" {...field} />
                              <span className="absolute right-3 top-3 text-gray-500">%</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button type="submit" size="lg" className="px-8" disabled={!hasPermission || permissionLoading}>
                      {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                      Calculate Refinance Savings
                    </Button>
                  </div>
                  {!hasPermission && !permissionLoading && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This calculator is not available with your current account. <a href="/contact" className="underline font-medium">Contact us to upgrade</a>.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="acceleration" className="mt-6">
            <div className="text-center py-12">
              <Home className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Acceleration Calculator</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                See how extra payments can help you pay off your mortgage faster and save on interest.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateMortgage)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="homePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Loan Balance</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Rate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="number" step="0.01" placeholder="0" className="pr-8 font-mono" {...field} />
                              <span className="absolute right-3 top-3 text-gray-500">%</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remaining Term</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="number" placeholder="30" className="pr-16 font-mono" {...field} />
                              <span className="absolute right-3 top-3 text-gray-500">years</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="downPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extra Monthly Payment</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button type="submit" size="lg" className="px-8" disabled={!hasPermission || permissionLoading}>
                      {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                      Calculate Payoff Savings
                    </Button>
                  </div>
                  {!hasPermission && !permissionLoading && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This calculator is not available with your current account. <a href="/contact" className="underline font-medium">Contact us to upgrade</a>.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
        {results && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            {calculatorType === "affordability" && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-primary mb-2">
                      {formatCurrency(results.monthlyPayment)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Principal & Interest</div>
                  </div>
                  <div className="text-center p-6 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-secondary mb-2">
                      {formatCurrency(results.monthlyTaxInsurance)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Tax & Insurance</div>
                  </div>
                  <div className="text-center p-6 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-accent mb-2">
                      {formatCurrency(results.totalMonthlyPayment)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Total Monthly</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-gray-900 mb-2">
                      {results.downPaymentPercent.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-gray-700">Down Payment</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Amount</span>
                        <span className="font-mono font-semibold">{formatCurrency(results.loanAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-mono font-semibold">{formatCurrency(results.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Payments</span>
                        <span className="font-mono font-semibold">{formatCurrency(results.totalPayments)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Affordability Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Home Price</span>
                        <span className="font-mono font-semibold">{formatCurrency(form.getValues().homePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Down Payment</span>
                        <span className="font-mono font-semibold">{formatCurrency(form.getValues().downPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Payment</span>
                        <span className="font-mono font-semibold">{formatCurrency(results.totalMonthlyPayment)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {calculatorType === "refinance" && results.refinanceCurrentPayment !== undefined && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-primary mb-2">
                    {formatCurrency(results.refinanceCurrentPayment)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Current Monthly Payment</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-green-600 mb-2">
                    {formatCurrency(results.refinanceNewPayment || 0)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">New Monthly Payment</div>
                </div>
                <div className="text-center p-6 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-secondary mb-2">
                    {formatCurrency(results.refinanceSavings || 0)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Total Savings Over Loan</div>
                </div>
              </div>
            )}

            {calculatorType === "acceleration" && results.accelerationMonthsSaved !== undefined && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-primary mb-2">
                    {results.accelerationMonthsSaved} months
                  </div>
                  <div className="text-sm font-medium text-gray-700">Time Saved</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-green-600 mb-2">
                    {formatCurrency(results.accelerationInterestSaved || 0)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Interest Saved</div>
                </div>
                <div className="text-center p-6 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-secondary mb-2">
                    {(results.accelerationNewPayoff || 0).toFixed(1)} years
                  </div>
                  <div className="text-sm font-medium text-gray-700">New Payoff Time</div>
                </div>
              </div>
            )}

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
              <Button type="button" variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button type="button" variant="secondary" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Email Results
              </Button>
            </div>
          </div>
        )}
        <CalculatorDisclaimer text={disclaimer} />
      </CardContent>
    </Card>
  );
}
