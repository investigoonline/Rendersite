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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Save, Download, Mail, Lock } from "lucide-react";
import { useCalculatorPermission } from "@/hooks/useCalculatorPermission";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CalculatorDisclaimer from "./CalculatorDisclaimer";

const loanPayoffSchema = z.object({
  principal: z.coerce.number().min(1, "Principal amount is required"),
  interestRate: z.coerce.number().min(0).max(100, "Interest rate must be between 0 and 100"),
  currentPayment: z.coerce.number().min(0, "Current payment must be positive"),
  extraPayment: z.coerce.number().min(0).default(0),
});

type LoanPayoffForm = z.infer<typeof loanPayoffSchema>;

interface LoanPayoffCalculatorProps {
  calculatorName?: string;
  cardTitle?: string;
  cardDescription?: string;
  disclaimer?: string;
}

const defaultDisclaimer = "This example is for illustrative purposes only, and actual outcomes may differ. The information provided does not constitute tax, legal, investment, or retirement advice and should not be used to avoid federal tax penalties. Readers are advised to consult an independent tax, legal, or financial professional before making any decisions. While the content is based on sources believed to be reliable, no guarantee is made for accuracy or completeness. Nothing herein should be interpreted as an offer or solicitation to buy or sell any security.";

export default function LoanPayoffCalculator({ 
  calculatorName = "Loan Payoff Calculator",
  cardTitle,
  cardDescription,
  disclaimer = defaultDisclaimer
}: LoanPayoffCalculatorProps = {}) {
  const { toast } = useToast();
  const { hasPermission, isLoading: permissionLoading } = useCalculatorPermission(calculatorName);
  const [results, setResults] = useState<{
    monthsToPayoff: number;
    totalInterest: number;
    totalPayments: number;
    interestSaved: number;
    monthsSaved: number;
  } | null>(null);

  const form = useForm<LoanPayoffForm>({
    resolver: zodResolver(loanPayoffSchema),
    defaultValues: {
      principal: 0,
      interestRate: 0,
      currentPayment: 0,
      extraPayment: 0,
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
        description: "Your loan payoff calculation has been saved to your account.",
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

  const calculatePayoff = (data: LoanPayoffForm) => {
    const monthlyRate = data.interestRate / 100 / 12;
    const regularPayment = data.currentPayment;
    const totalPayment = regularPayment + data.extraPayment;

    if (regularPayment <= 0) {
      toast({
        title: "Invalid Input",
        description: "Monthly payment must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    const monthlyInterest = data.principal * monthlyRate;
    if (monthlyRate > 0 && regularPayment <= monthlyInterest) {
      toast({
        title: "Payment Too Low",
        description: `Your monthly payment ($${regularPayment.toFixed(2)}) must exceed the monthly interest ($${monthlyInterest.toFixed(2)}) to pay off the loan.`,
        variant: "destructive",
      });
      return;
    }

    if (totalPayment <= 0) {
      toast({
        title: "Invalid Input",
        description: "Total payment (current + extra) must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    if (monthlyRate > 0 && totalPayment <= monthlyInterest) {
      toast({
        title: "Payment Too Low",
        description: `Your total payment ($${totalPayment.toFixed(2)}) must exceed the monthly interest ($${monthlyInterest.toFixed(2)}) to pay off the loan.`,
        variant: "destructive",
      });
      return;
    }

    const regularMonths = monthlyRate > 0 
      ? -Math.log(1 - (data.principal * monthlyRate) / regularPayment) / Math.log(1 + monthlyRate)
      : data.principal / regularPayment;

    const acceleratedMonths = monthlyRate > 0
      ? -Math.log(1 - (data.principal * monthlyRate) / totalPayment) / Math.log(1 + monthlyRate)
      : data.principal / totalPayment;

    const regularTotalPayments = regularPayment * regularMonths;
    const acceleratedTotalPayments = totalPayment * acceleratedMonths;

    setResults({
      monthsToPayoff: Math.ceil(acceleratedMonths),
      totalInterest: Math.max(0, acceleratedTotalPayments - data.principal),
      totalPayments: acceleratedTotalPayments,
      interestSaved: Math.max(0, (regularTotalPayments - data.principal) - (acceleratedTotalPayments - data.principal)),
      monthsSaved: Math.max(0, Math.ceil(regularMonths - acceleratedMonths)),
    });
  };

  const handleSave = () => {
    if (results) {
      const formData = form.getValues();
      saveCalculationMutation.mutate({
        calculatorType: "loan_payoff",
        category: "loans_credit",
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
    <Card className="max-w-4xl mx-auto shadow-xl border border-gray-200 overflow-hidden">
      {/* Calculator Header */}
      <CardHeader className="gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold mb-2 flex items-center">
              <CreditCard className="mr-3 h-6 w-6" />
              {cardTitle || "Loan Payoff Calculator"}
            </CardTitle>
            <p className="text-blue-100">{cardDescription || "Calculate how extra payments can save you money"}</p>
          </div>
          {results && (
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">
                {results.monthsToPayoff} months
              </div>
              <div className="text-sm text-blue-100">Time to Payoff</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculatePayoff)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Loan Details */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Loan Details</h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="principal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outstanding Principal Balance</FormLabel>
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
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Interest Rate</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="currentPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Monthly Payment</FormLabel>
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
                    name="extraPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extra Monthly Payment</FormLabel>
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

              {/* Payoff Schedule Preview */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Payoff Benefits</h4>
                
                {results ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Time to Payoff</span>
                        <span className="font-mono font-semibold text-primary">
                          {results.monthsToPayoff} months
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Interest</span>
                        <span className="font-mono font-semibold text-secondary">
                          {formatCurrency(results.totalInterest)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Interest Saved</span>
                        <span className="font-mono font-semibold text-accent">
                          {formatCurrency(results.interestSaved)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Time Saved</span>
                        <span className="font-mono font-semibold text-gray-900">
                          {results.monthsSaved} months
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground border-2 border-dashed border-gray-300 rounded-lg">
                    Enter loan details above to see payoff benefits
                  </div>
                )}
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
                  Calculate Payoff Schedule
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
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-primary mb-2">
                      {results.monthsToPayoff}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Months to Payoff</div>
                  </div>
                  <div className="text-center p-6 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-secondary mb-2">
                      {formatCurrency(results.interestSaved)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Interest Saved</div>
                  </div>
                  <div className="text-center p-6 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-accent mb-2">
                      {results.monthsSaved}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Months Saved</div>
                  </div>
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
        <CalculatorDisclaimer text={disclaimer} />
      </CardContent>
    </Card>
  );
}
