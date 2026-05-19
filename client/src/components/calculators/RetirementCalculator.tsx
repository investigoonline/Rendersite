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
import { NumericInput } from "@/components/ui/numeric-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PiggyBank, Save, Download, Mail, Lock, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { useCalculatorPermission } from "@/hooks/useCalculatorPermission";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CalculatorDisclaimer from "./CalculatorDisclaimer";

const retirementSchema = z.object({
  currentAge: z.coerce.number().min(18).max(100, "Age must be between 18 and 100"),
  retirementAge: z.coerce.number().min(50).max(80, "Retirement age must be between 50 and 80"),
  currentSavings: z.coerce.number().min(0, "Current savings must be positive"),
  monthlyContribution: z.coerce.number().min(0, "Monthly contribution must be positive"),
  annualIncome: z.coerce.number().min(0, "Annual income must be positive"),
  desiredReplacement: z.coerce.number().min(10).max(100, "Replacement ratio must be between 10 and 100"),
  expectedReturn: z.coerce.number().min(0).max(20, "Expected return must be between 0 and 20"),
  inflationRate: z.coerce.number().min(0).max(10, "Inflation rate must be between 0 and 10"),
  lifeExpectancy: z.coerce.number().min(70).max(120, "Life expectancy must be between 70 and 120"),
});

type RetirementForm = z.infer<typeof retirementSchema>;

interface RetirementCalculatorProps {
  calculatorName?: string;
  cardTitle?: string;
  cardDescription?: string;
  disclaimer?: string;
}

const defaultDisclaimer = "This example is for illustrative purposes only, and actual outcomes may differ. The information provided does not constitute tax, legal, investment, or retirement advice and should not be used to avoid federal tax penalties. Readers are advised to consult an independent tax, legal, or financial professional before making any decisions. While the content is based on sources believed to be reliable, no guarantee is made for accuracy or completeness. Nothing herein should be interpreted as an offer or solicitation to buy or sell any security.";

// Map calculator name to tab value
const getInitialTab = (calculatorName: string): string => {
  const nameToTab: Record<string, string> = {
    "Cost of Retirement Calculator": "cost",
    "retirement_cost": "cost",
    "Required Minimum Distributions (RMD)": "rmd",
    "rmd": "rmd",
    "Impact of Inflation Calculator": "inflation",
    "inflation_impact": "inflation",
    "Retirement Plan Early Distribution": "early",
    "retirement_early": "early",
    "Retirement Portfolio Lifespan": "lifespan",
    "portfolio_lifespan": "lifespan",
  };
  return nameToTab[calculatorName] || "cost";
};

export default function RetirementCalculator({ 
  calculatorName = "Cost of Retirement Calculator",
  cardTitle,
  cardDescription,
  disclaimer = defaultDisclaimer
}: RetirementCalculatorProps = {}) {
  const { toast } = useToast();
  const [calculatorType, setCalculatorType] = useState(() => getInitialTab(calculatorName));
  
  const { hasPermission, isLoading: permissionLoading } = useCalculatorPermission(calculatorName);
  
  const [results, setResults] = useState<{
    retirementGoal: number;
    monthlyNeeded: number;
    projectedSavings: number;
    shortfall: number;
    rmdAmount?: number;
    portfolioLifespan?: number;
    earlyDistributionPenalty?: number;
    earlyDistributionTax?: number;
    earlyDistributionNet?: number;
    inflationAdjustedValue?: number;
    inflationLoss?: number;
  } | null>(null);

  const form = useForm<RetirementForm>({
    resolver: zodResolver(retirementSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 65,
      currentSavings: 0,
      monthlyContribution: 0,
      annualIncome: 0,
      desiredReplacement: 80,
      expectedReturn: 7,
      inflationRate: 3,
      lifeExpectancy: 85,
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
        description: "Your retirement calculation has been saved to your account.",
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

  const calculateRetirement = (data: RetirementForm) => {
    const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
    const yearsInRetirement = Math.max(1, data.lifeExpectancy - data.retirementAge);
    const realReturn = (data.expectedReturn - data.inflationRate) / 100;
    
    const desiredAnnualIncome = data.annualIncome * (data.desiredReplacement / 100);
    
    let retirementGoal: number;
    let projectedSavings: number;
    
    if (Math.abs(realReturn) < 0.0001) {
      retirementGoal = desiredAnnualIncome * yearsInRetirement;
      projectedSavings = data.currentSavings + (data.monthlyContribution * 12 * yearsToRetirement);
    } else {
      retirementGoal = desiredAnnualIncome * 
        (1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn;
      const futureValueCurrentSavings = data.currentSavings * 
        Math.pow(1 + realReturn, yearsToRetirement);
      const futureValueContributions = data.monthlyContribution * 12 * 
        (Math.pow(1 + realReturn, yearsToRetirement) - 1) / realReturn;
      projectedSavings = futureValueCurrentSavings + futureValueContributions;
    }
    
    const shortfall = Math.max(0, retirementGoal - projectedSavings);
    let monthlyNeeded = 0;
    if (shortfall > 0) {
      if (Math.abs(realReturn) < 0.0001) {
        monthlyNeeded = yearsToRetirement > 0 ? shortfall / (12 * yearsToRetirement) : shortfall;
      } else {
        monthlyNeeded = (shortfall * realReturn) / (12 * (Math.pow(1 + realReturn, yearsToRetirement) - 1));
      }
    }

    // Calculate RMD
    let rmdAmount;
    if (calculatorType === "rmd") {
      const age = data.currentAge;
      const distributionPeriods: Record<number, number> = {
        73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
        79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8,
        85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2,
      };
      const period = distributionPeriods[age] || Math.max(10, 27.4 - (age - 72) * 0.9);
      rmdAmount = data.currentSavings / period;
    }

    // Calculate early distribution
    let earlyDistributionPenalty, earlyDistributionTax, earlyDistributionNet;
    if (calculatorType === "early") {
      const distributionAmount = data.currentSavings;
      const taxRate = (data.expectedReturn || 22) / 100;
      earlyDistributionPenalty = data.currentAge < 59.5 ? distributionAmount * 0.10 : 0;
      earlyDistributionTax = distributionAmount * taxRate;
      earlyDistributionNet = distributionAmount - earlyDistributionPenalty - earlyDistributionTax;
    }

    // Calculate inflation impact
    let inflationAdjustedValue, inflationLoss;
    if (calculatorType === "inflation") {
      const years = 10;
      const rate = data.inflationRate / 100;
      inflationAdjustedValue = data.currentSavings / Math.pow(1 + rate, years);
      inflationLoss = data.currentSavings - inflationAdjustedValue;
    }

    // Calculate portfolio lifespan
    let portfolioLifespan;
    if (calculatorType === "lifespan") {
      const annualWithdrawal = data.annualIncome > 0 ? data.annualIncome : data.currentSavings * 0.04;
      const returnRate = (data.expectedReturn || 7) / 100;
      if (annualWithdrawal >= data.currentSavings * returnRate) {
        portfolioLifespan = data.currentSavings / (annualWithdrawal - data.currentSavings * returnRate + annualWithdrawal * 0.01);
      } else {
        portfolioLifespan = 100;
      }
      portfolioLifespan = Math.min(portfolioLifespan, 100);
    }

    setResults({
      retirementGoal,
      monthlyNeeded,
      projectedSavings,
      shortfall,
      rmdAmount,
      portfolioLifespan,
      earlyDistributionPenalty,
      earlyDistributionTax,
      earlyDistributionNet,
      inflationAdjustedValue,
      inflationLoss,
    });
  };

  const handleSave = () => {
    if (results) {
      const formData = form.getValues();
      saveCalculationMutation.mutate({
        calculatorType: `retirement_${calculatorType}`,
        category: "retirement_inflation",
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
              <PiggyBank className="mr-3 h-6 w-6" />
              {cardTitle || "Retirement Planning Calculator"}
            </CardTitle>
            <p className="text-blue-100">{cardDescription || "Plan for a secure and comfortable retirement"}</p>
          </div>
          {results && (
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">
                {formatCurrency(results.retirementGoal)}
              </div>
              <div className="text-sm text-blue-100">Retirement Goal</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Tabs value={calculatorType} onValueChange={setCalculatorType} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cost">Retirement Cost</TabsTrigger>
            <TabsTrigger value="rmd">RMD Calculator</TabsTrigger>
            <TabsTrigger value="early">Early Distribution</TabsTrigger>
            <TabsTrigger value="inflation">Inflation Impact</TabsTrigger>
            <TabsTrigger value="lifespan">Portfolio Lifespan</TabsTrigger>
          </TabsList>

          <TabsContent value="cost" className="mt-6">
            <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateRetirement)} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Age</FormLabel>
                          <FormControl>
                            <NumericInput
                              placeholder="30"
                              className="font-mono"
                              max={100}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="retirementAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retirement Age</FormLabel>
                          <FormControl>
                            <NumericInput
                              placeholder="65"
                              className="font-mono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Annual Income</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput
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
                    name="desiredReplacement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Income Replacement</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <NumericInput
                              placeholder="80"
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

                  <FormField
                    control={form.control}
                    name="lifeExpectancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Life Expectancy</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <NumericInput
                              placeholder="85"
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
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Financial Details</h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentSavings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Retirement Savings</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput
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
                    name="monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Contribution</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput
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
                      name="expectedReturn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Annual Return</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <NumericInput
                                placeholder="7"
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

                    <FormField
                      control={form.control}
                      name="inflationRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Inflation Rate</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <NumericInput
                                placeholder="3"
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
                  Calculate Retirement Plan
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

          <TabsContent value="rmd" className="mt-6">
            <div className="text-center py-12">
              <PiggyBank className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Required Minimum Distributions</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Calculate your required minimum distributions from retirement accounts based on IRS life expectancy tables.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateRetirement)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="currentAge" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Age</FormLabel>
                        <FormControl><NumericInput placeholder="72" className="font-mono" max={100} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentSavings" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Balance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput placeholder="0" className="pl-8 font-mono" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button type="submit" size="lg" className="px-8" disabled={!hasPermission || permissionLoading}>
                      {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                      Calculate RMD
                    </Button>
                  </div>
                  {!hasPermission && !permissionLoading && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This calculator requires an upgraded account. <a href="/contact" className="underline font-medium">Contact us to upgrade</a>.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="early" className="mt-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Retirement Plan Early Distribution</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Calculate the impact of early withdrawals from retirement accounts, including penalties and taxes before age 59½.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateRetirement)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="currentAge" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Current Age</FormLabel>
                        <FormControl><NumericInput placeholder="45" className="font-mono" max={100} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentSavings" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distribution Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput placeholder="0" className="pl-8 font-mono" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="annualIncome" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Income</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput placeholder="0" className="pl-8 font-mono" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="expectedReturn" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Federal Tax Rate (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <NumericInput placeholder="22" className="font-mono" {...field} />
                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button type="submit" size="lg" className="px-8" disabled={!hasPermission || permissionLoading}>
                      {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                      Calculate Early Distribution
                    </Button>
                  </div>
                  {!hasPermission && !permissionLoading && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This calculator requires an upgraded account. <a href="/contact" className="underline font-medium">Contact us to upgrade</a>.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="inflation" className="mt-6">
            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inflation Impact Calculator</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                See how inflation affects your purchasing power and retirement savings over time.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateRetirement)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="currentSavings" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput placeholder="0" className="pl-8 font-mono" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="inflationRate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Inflation Rate</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute right-3 top-3 text-gray-500">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button type="submit" size="lg" className="px-8" disabled={!hasPermission || permissionLoading}>
                      {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                      Calculate Impact
                    </Button>
                  </div>
                  {!hasPermission && !permissionLoading && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This calculator requires an upgraded account. <a href="/contact" className="underline font-medium">Contact us to upgrade</a>.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="lifespan" className="mt-6">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Lifespan Calculator</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Determine how long your retirement savings will last based on withdrawal rates.
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(calculateRetirement)} className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="currentSavings" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Portfolio Value</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput placeholder="0" className="pl-8 font-mono" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="annualIncome" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Withdrawal</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <NumericInput placeholder="0" className="pl-8 font-mono" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="flex justify-center pt-4">
                    <Button type="submit" size="lg" className="px-8" disabled={!hasPermission || permissionLoading}>
                      {!hasPermission && <Lock className="mr-2 h-4 w-4" />}
                      Calculate Lifespan
                    </Button>
                  </div>
                  {!hasPermission && !permissionLoading && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        This calculator requires an upgraded account. <a href="/contact" className="underline font-medium">Contact us to upgrade</a>.
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
            {calculatorType === "cost" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-primary mb-2">
                    {formatCurrency(results.retirementGoal)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Retirement Goal</div>
                </div>
                <div className="text-center p-6 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-secondary mb-2">
                    {formatCurrency(results.projectedSavings)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Projected Savings</div>
                </div>
                <div className="text-center p-6 bg-accent/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-accent mb-2">
                    {formatCurrency(results.shortfall)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Shortfall</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-gray-900 mb-2">
                    {formatCurrency(results.monthlyNeeded)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Monthly Needed</div>
                </div>
              </div>
            )}

            {calculatorType === "rmd" && results.rmdAmount !== undefined && (
              <div className="text-center p-8 bg-primary/5 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Required Minimum Distribution</h3>
                <div className="text-3xl font-bold font-mono text-primary mb-2">
                  {formatCurrency(results.rmdAmount)}
                </div>
                <p className="text-muted-foreground">Annual RMD amount based on your age and account balance</p>
              </div>
            )}

            {calculatorType === "early" && results.earlyDistributionNet !== undefined && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-red-600 mb-2">
                    {formatCurrency(results.earlyDistributionPenalty || 0)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Early Withdrawal Penalty (10%)</div>
                </div>
                <div className="text-center p-6 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-amber-600 mb-2">
                    {formatCurrency(results.earlyDistributionTax || 0)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Income Tax Withholding</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-green-600 mb-2">
                    {formatCurrency(results.earlyDistributionNet)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Net Amount Received</div>
                </div>
              </div>
            )}

            {calculatorType === "inflation" && results.inflationAdjustedValue !== undefined && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-primary mb-2">
                    {formatCurrency(results.inflationAdjustedValue)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Purchasing Power in 10 Years</div>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold font-mono text-red-600 mb-2">
                    {formatCurrency(results.inflationLoss || 0)}
                  </div>
                  <div className="text-sm font-medium text-gray-700">Lost to Inflation</div>
                </div>
              </div>
            )}

            {calculatorType === "lifespan" && results.portfolioLifespan !== undefined && (
              <div className="text-center p-8 bg-secondary/5 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Lifespan</h3>
                <div className="text-3xl font-bold font-mono text-secondary mb-2">
                  {results.portfolioLifespan >= 100 ? "100+ years" : `${results.portfolioLifespan.toFixed(1)} years`}
                </div>
                <p className="text-muted-foreground">Estimated duration your portfolio will sustain withdrawals</p>
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
