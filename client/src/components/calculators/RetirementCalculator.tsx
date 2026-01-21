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
import { PiggyBank, Save, Download, Mail, Lock, TrendingUp, Clock } from "lucide-react";
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
}

// Map calculator name to tab value
const getInitialTab = (calculatorName: string): string => {
  const nameToTab: Record<string, string> = {
    "Cost of Retirement Calculator": "cost",
    "retirement_cost": "cost",
    "Required Minimum Distributions (RMD)": "rmd",
    "rmd": "rmd",
    "Impact of Inflation Calculator": "inflation",
    "inflation_impact": "inflation",
    "Retirement Plan Early Distribution": "cost",
    "retirement_early": "cost",
    "Retirement Portfolio Lifespan": "lifespan",
    "portfolio_lifespan": "lifespan",
  };
  return nameToTab[calculatorName] || "cost";
};

export default function RetirementCalculator({ calculatorName = "Cost of Retirement Calculator" }: RetirementCalculatorProps = {}) {
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
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const yearsInRetirement = data.lifeExpectancy - data.retirementAge;
    const realReturn = (data.expectedReturn - data.inflationRate) / 100;
    const monthlyReturn = realReturn / 12;
    
    // Calculate desired annual retirement income
    const desiredAnnualIncome = data.annualIncome * (data.desiredReplacement / 100);
    
    // Calculate retirement goal (present value of annuity)
    const retirementGoal = desiredAnnualIncome * 
      (1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn;
    
    // Calculate projected savings at retirement
    const futureValueCurrentSavings = data.currentSavings * 
      Math.pow(1 + realReturn, yearsToRetirement);
    
    const futureValueContributions = data.monthlyContribution * 12 * 
      (Math.pow(1 + realReturn, yearsToRetirement) - 1) / realReturn;
    
    const projectedSavings = futureValueCurrentSavings + futureValueContributions;
    
    const shortfall = Math.max(0, retirementGoal - projectedSavings);
    const monthlyNeeded = shortfall > 0 ? 
      (shortfall * realReturn) / (12 * (Math.pow(1 + realReturn, yearsToRetirement) - 1)) : 0;

    // Calculate RMD if user is 73+
    let rmdAmount;
    if (data.currentAge >= 73) {
      const distributionPeriod = 27.4; // Simplified uniform lifetime table
      rmdAmount = data.currentSavings / distributionPeriod;
    }

    // Calculate portfolio lifespan
    const withdrawalRate = 0.04; // 4% rule
    const annualWithdrawal = data.currentSavings * withdrawalRate;
    const portfolioLifespan = data.currentSavings / annualWithdrawal;

    setResults({
      retirementGoal,
      monthlyNeeded,
      projectedSavings,
      shortfall,
      rmdAmount,
      portfolioLifespan,
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
              Retirement Planning Calculator
            </CardTitle>
            <p className="text-blue-100">Plan for a secure and comfortable retirement</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cost">Retirement Cost</TabsTrigger>
            <TabsTrigger value="rmd">RMD Calculator</TabsTrigger>
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
                      name="retirementAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retirement Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
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
                    name="desiredReplacement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Income Replacement</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
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
                            <Input
                              type="number"
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
                    name="monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Contribution</FormLabel>
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
                      name="expectedReturn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Annual Return</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.1"
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
                              <Input
                                type="number"
                                step="0.1"
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

            {/* Results Section */}
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

                {calculatorType === "rmd" && results.rmdAmount && (
                    <div className="text-center p-8 bg-primary/5 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Required Minimum Distribution
                      </h3>
                      <div className="text-3xl font-bold font-mono text-primary mb-2">
                        {formatCurrency(results.rmdAmount)}
                      </div>
                      <p className="text-muted-foreground">Annual RMD amount for current age</p>
                    </div>
                )}

                {calculatorType === "lifespan" && results.portfolioLifespan && (
                    <div className="text-center p-8 bg-secondary/5 rounded-lg mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Portfolio Lifespan
                      </h3>
                      <div className="text-3xl font-bold font-mono text-secondary mb-2">
                        {results.portfolioLifespan.toFixed(1)} years
                      </div>
                      <p className="text-muted-foreground">
                        How long your current savings will last using 4% withdrawal rule
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
                        <FormControl><Input type="number" placeholder="72" className="font-mono" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentSavings" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Balance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">$</span>
                            <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
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
                            <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
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
                            <Input type="number" step="0.1" placeholder="3" className="pr-8 font-mono" {...field} />
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
                            <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
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
                            <Input type="number" placeholder="0" className="pl-8 font-mono" {...field} />
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
        <CalculatorDisclaimer />
      </CardContent>
    </Card>
  );
}
