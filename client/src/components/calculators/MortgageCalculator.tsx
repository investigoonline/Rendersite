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
import { Home, Save, Download, Mail } from "lucide-react";

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

export default function MortgageCalculator() {
  const { toast } = useToast();
  const [calculatorType, setCalculatorType] = useState("affordability");
  const [results, setResults] = useState<{
    monthlyPayment: number;
    principal: number;
    totalInterest: number;
    totalPayments: number;
    loanAmount: number;
    downPaymentPercent: number;
    monthlyTaxInsurance: number;
    totalMonthlyPayment: number;
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
    const loanAmount = data.homePrice - data.downPayment;
    const monthlyRate = data.interestRate / 100 / 12;
    const numberOfPayments = data.loanTerm * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }

    const totalPayments = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayments - loanAmount;
    const downPaymentPercent = (data.downPayment / data.homePrice) * 100;
    
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
              Mortgage & Housing Calculator
            </CardTitle>
            <p className="text-blue-100">Calculate home affordability and mortgage payments</p>
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
        </Tabs>

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
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="px-8">
                Calculate Mortgage Payment
              </Button>
            </div>

            {/* Results Section */}
            {results && (
              <div className="mt-8 pt-8 border-t border-gray-200">
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

                {/* Loan Summary */}
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
