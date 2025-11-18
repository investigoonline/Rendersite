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
import { PlusCircle, MinusCircle, Save, Download, Mail, Lock } from "lucide-react";
import { useCalculatorPermission } from "@/hooks/useCalculatorPermission";
import { Alert, AlertDescription } from "@/components/ui/alert";

const netWorthSchema = z.object({
  assets: z.object({
    cash: z.coerce.number().min(0).default(0),
    realEstate: z.coerce.number().min(0).default(0),
    investments: z.coerce.number().min(0).default(0),
    retirement: z.coerce.number().min(0).default(0),
  }),
  liabilities: z.object({
    mortgage: z.coerce.number().min(0).default(0),
    creditCards: z.coerce.number().min(0).default(0),
    autoLoans: z.coerce.number().min(0).default(0),
    otherDebts: z.coerce.number().min(0).default(0),
  }),
});

type NetWorthForm = z.infer<typeof netWorthSchema>;

export default function NetWorthCalculator() {
  const { toast } = useToast();
  const { hasPermission, isLoading: permissionLoading } = useCalculatorPermission("Total Net Worth");
  const [results, setResults] = useState<{
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    debtRatio: number;
    liquidityRatio: number;
  } | null>(null);

  const form = useForm<NetWorthForm>({
    resolver: zodResolver(netWorthSchema),
    defaultValues: {
      assets: {
        cash: 0,
        realEstate: 0,
        investments: 0,
        retirement: 0,
      },
      liabilities: {
        mortgage: 0,
        creditCards: 0,
        autoLoans: 0,
        otherDebts: 0,
      },
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
        description: "Your net worth calculation has been saved to your account.",
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

  const calculateNetWorth = (data: NetWorthForm) => {
    const totalAssets = Object.values(data.assets).reduce((sum, value) => sum + value, 0);
    const totalLiabilities = Object.values(data.liabilities).reduce((sum, value) => sum + value, 0);
    const netWorth = totalAssets - totalLiabilities;
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const liquidityRatio = totalAssets > 0 ? (data.assets.cash / totalAssets) * 100 : 0;

    setResults({
      totalAssets,
      totalLiabilities,
      netWorth,
      debtRatio,
      liquidityRatio,
    });
  };

  const handleSave = () => {
    if (results) {
      const formData = form.getValues();
      saveCalculationMutation.mutate({
        calculatorType: "net_worth",
        category: "wealth_management",
        inputs: formData,
        results,
        saved: true,
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality would be implemented here.",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email Feature",
      description: "Email results functionality would be implemented here.",
    });
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
            <CardTitle className="text-2xl font-bold mb-2">
              Total Net Worth Calculator
            </CardTitle>
            <p className="text-blue-100">Calculate your complete financial position</p>
          </div>
          {results && (
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">
                {formatCurrency(results.netWorth)}
              </div>
              <div className="text-sm text-blue-100">Your Net Worth</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateNetWorth)} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Assets Section */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <PlusCircle className="text-secondary mr-2 h-5 w-5" />
                  Assets
                </h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="assets.cash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cash & Savings</FormLabel>
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
                    name="assets.realEstate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Real Estate</FormLabel>
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
                    name="assets.investments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investments</FormLabel>
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
                    name="assets.retirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retirement Accounts</FormLabel>
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

                {/* Assets Total */}
                {results && (
                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Assets</span>
                      <span className="text-xl font-bold font-mono text-secondary">
                        {formatCurrency(results.totalAssets)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Liabilities Section */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MinusCircle className="text-accent mr-2 h-5 w-5" />
                  Liabilities
                </h4>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="liabilities.mortgage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mortgage</FormLabel>
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
                    name="liabilities.creditCards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Cards</FormLabel>
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
                    name="liabilities.autoLoans"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auto Loans</FormLabel>
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
                    name="liabilities.otherDebts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Debts</FormLabel>
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

                {/* Liabilities Total */}
                {results && (
                  <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total Liabilities</span>
                      <span className="text-xl font-bold font-mono text-accent">
                        {formatCurrency(results.totalLiabilities)}
                      </span>
                    </div>
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
                  Calculate Net Worth
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
                      {formatCurrency(results.netWorth)}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Net Worth</div>
                  </div>
                  <div className="text-center p-6 bg-secondary/5 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-secondary mb-2">
                      {results.debtRatio.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-gray-700">Debt Ratio</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold font-mono text-gray-900 mb-2">
                      {results.liquidityRatio.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-gray-700">Liquidity Ratio</div>
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
                    onClick={handleExport}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleEmail}
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
