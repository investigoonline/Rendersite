import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalculatorCard from "@/components/calculators/CalculatorCard";
import NetWorthCalculator from "@/components/calculators/NetWorthCalculator";
import LoanPayoffCalculator from "@/components/calculators/LoanPayoffCalculator";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import RetirementCalculator from "@/components/calculators/RetirementCalculator";
import TaxCalculator from "@/components/calculators/TaxCalculator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";
import {
  PieChart,
  CreditCard,
  Home,
  Car,
  Scale,
  PiggyBank,
  FileText,
  TrendingUp,
  Search,
  Calculator,
  type LucideIcon,
} from "lucide-react";
import calculatorsImage from "@assets/Calculators_1765301634531.png";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import type { PageContent } from "@shared/schema";

interface CalculatorCMSContent {
  pageTitle: string;
  pageDescription: string;
  cardTitle: string;
  cardDescription: string;
  disclaimer: string;
}

// Map calculator IDs to CMS section names
const calculatorIdToSection: Record<string, string> = {
  net_worth: 'calc_net_worth',
  debt_ratio: 'calc_debt_ratio',
  loan_payoff: 'calc_loan_payoff',
  credit_card_debt: 'calc_credit_card_debt',
  home_affordability: 'calc_home_affordability',
  mortgage_refinance: 'calc_mortgage_refinance',
  mortgage_acceleration: 'calc_mortgage_acceleration',
  lease_payment: 'calc_lease_payment',
  car_affordability: 'calc_car_affordability',
  retirement_cost: 'calc_retirement_cost',
  rmd: 'calc_rmd',
  inflation_impact: 'calc_inflation_impact',
  retirement_early: 'calc_retirement_early',
  portfolio_lifespan: 'calc_portfolio_lifespan',
  estate_tax: 'calc_estate_tax',
  federal_tax: 'calc_federal_tax',
  tax_deferred: 'calc_tax_deferred',
  ira_eligibility: 'calc_ira_eligibility',
  roth_conversion: 'calc_roth_conversion',
  credit_impact: 'calc_credit_impact',
  debt_consolidation: 'calc_debt_consolidation',
};

interface PageHeaderCMS {
  title: string;
  subtitle: string;
  description: string;
  searchPlaceholder: string;
}

interface CategoryCMS {
  title: string;
  description: string;
  icon: string;
}

interface CalculatorItemCMS {
  categoryId: string;
  calculatorId: string;
  name: string;
  description: string;
  sortOrder: number;
}

// Helper to get icon from string name
const getIconByName = (iconName: string): LucideIcon => {
  const icon = (LucideIcons as Record<string, unknown>)[iconName];
  return (icon as LucideIcon) || Calculator;
};

const calculatorCategories = [
  {
    id: "wealth_management",
    title: "Wealth Management",
    description: "Net worth tracking, debt ratio analysis, and wealth building strategies.",
    icon: PieChart,
    calculators: [
      { id: "net_worth", name: "Total Net Worth Calculator", component: NetWorthCalculator },
      { id: "debt_ratio", name: "Income to Debt Ratio Calculator", component: NetWorthCalculator },
    ],
  },
  {
    id: "loans_credit",
    title: "Loans & Credit Cards",
    description: "Payoff strategies, payment schedules, and debt optimization tools.",
    icon: CreditCard,
    calculators: [
      { id: "loan_payoff", name: "Loan Payoff Calculator", component: LoanPayoffCalculator },
      { id: "credit_card_debt", name: "Credit Card Debt Calculator", component: LoanPayoffCalculator },
    ],
  },
  {
    id: "real_estate",
    title: "Real Estate & Housing",
    description: "Home affordability, mortgage refinancing, and acceleration strategies.",
    icon: Home,
    calculators: [
      { id: "home_affordability", name: "Home Affordability Calculator", component: MortgageCalculator },
      { id: "mortgage_refinance", name: "Mortgage Refinancing Calculator", component: MortgageCalculator },
      { id: "mortgage_acceleration", name: "Mortgage Acceleration Calculator", component: MortgageCalculator },
    ],
  },
  {
    id: "vehicle_financing",
    title: "Vehicle Financing",
    description: "Lease vs buy analysis, payment calculations, and affordability assessment.",
    icon: Car,
    calculators: [
      { id: "lease_payment", name: "Lease Payment Calculator", component: LoanPayoffCalculator },
      { id: "car_affordability", name: "Car Affordability Calculator", component: LoanPayoffCalculator },
    ],
  },
  {
    id: "retirement_inflation",
    title: "Retirement & Inflation",
    description: "Retirement cost planning, RMD calculations, and inflation impact analysis.",
    icon: PiggyBank,
    calculators: [
      { id: "retirement_cost", name: "Cost of Retirement Calculator", component: RetirementCalculator },
      { id: "rmd", name: "Required Minimum Distributions (RMD)", component: RetirementCalculator },
      { id: "inflation_impact", name: "Impact of Inflation Calculator", component: RetirementCalculator },
      { id: "retirement_early", name: "Retirement Plan Early Distribution", component: RetirementCalculator },
      { id: "portfolio_lifespan", name: "Retirement Portfolio Lifespan", component: RetirementCalculator },
    ],
  },
  {
    id: "estate_planning",
    title: "Estate Planning",
    description: "Estate tax calculations and planning recommendations for asset transfer.",
    icon: Scale,
    calculators: [
      { id: "estate_tax", name: "Estate Tax Calculator", component: TaxCalculator },
    ],
  },
  {
    id: "taxes_iras",
    title: "Taxes & IRAs",
    description: "Income tax calculations, IRA eligibility, and Roth conversion analysis.",
    icon: FileText,
    calculators: [
      { id: "federal_tax", name: "Federal Income Tax Calculator", component: TaxCalculator },
      { id: "tax_deferred", name: "Tax-Deferred Savings Calculator", component: TaxCalculator },
      { id: "ira_eligibility", name: "IRA Eligibility Calculator", component: TaxCalculator },
      { id: "roth_conversion", name: "Roth IRA Conversion Calculator", component: TaxCalculator },
    ],
  },
  {
    id: "credit_debt",
    title: "Credit & Debt Management",
    description: "Credit optimization strategies and debt management planning tools.",
    icon: TrendingUp,
    calculators: [
      { id: "credit_impact", name: "Credit Score Impact Analysis", component: LoanPayoffCalculator },
      { id: "debt_consolidation", name: "Debt Consolidation Calculator", component: LoanPayoffCalculator },
    ],
  },
];

export default function Calculators() {
  const heroImage = useDynamicImage('calculators', 'hero', calculatorsImage);
  const { isAuthenticated, isGuestUser, isRegisteredUser, hasCalculatorAccess, accessLevel } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("wealth_management");
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Synchronize selectedCategory with user access level to prevent empty tabs
  useEffect(() => {
    // Only update if current category is not accessible
    if (!hasCalculatorAccess(selectedCategory)) {
      const defaultCategory = isGuestUser ? "vehicle_financing" : "wealth_management";
      setSelectedCategory(defaultCategory);
    }
  }, [isGuestUser, hasCalculatorAccess, selectedCategory]);

  // Handle URL parameters for direct calculator access with access control
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const calculator = urlParams.get('calculator');
    const category = urlParams.get('category');
    
    if (calculator) {
      // Find the category for this calculator
      const foundCategory = calculatorCategories.find(cat => 
        cat.calculators.some(calc => calc.id === calculator)
      );
      
      // Check if user has access to this calculator's category
      if (foundCategory && hasCalculatorAccess(foundCategory.id)) {
        setSelectedCalculator(calculator);
        setSelectedCategory(foundCategory.id);
      } else {
        // Redirect to accessible default category if no access
        setSelectedCategory(isGuestUser ? "vehicle_financing" : "wealth_management");
        toast({
          title: "Access Restricted",
          description: isGuestUser 
            ? "Guest users have access to Vehicle Financing calculators only. Create a full account for access to all calculators."
            : "You need to log in to access this calculator.",
          variant: "destructive",
        });
      }
    } else if (category && hasCalculatorAccess(category)) {
      setSelectedCategory(category);
    } else if (category) {
      // Set default accessible category if user doesn't have access
      setSelectedCategory(isGuestUser ? "vehicle_financing" : "wealth_management");
      toast({
        title: "Access Restricted",
        description: isGuestUser 
          ? "Guest users have access to Vehicle Financing calculators only."
          : "You need to log in to access this category.",
        variant: "destructive",
      });
    }
  }, [location, isGuestUser, hasCalculatorAccess]);

  // Get user's saved calculations
  const { data: savedCalculations } = useQuery<any[]>({
    queryKey: ["/api/calculations"],
    enabled: isAuthenticated,
  });

  // Fetch calculator CMS content
  const { data: calculatorContent } = useQuery<PageContent[]>({
    queryKey: ["/api/content", "calculators"],
    queryFn: async () => {
      const res = await fetch("/api/content?page=calculators", {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Helper to get CMS content for a specific calculator by its ID
  const getIndividualCalculatorContent = (calculatorId: string): CalculatorCMSContent | null => {
    const sectionName = calculatorIdToSection[calculatorId];
    if (!sectionName) return null;
    const content = calculatorContent?.find(c => c.section === sectionName);
    return content?.content as CalculatorCMSContent | null;
  };

  // Helper to get page header from CMS
  const getPageHeader = (): PageHeaderCMS | null => {
    const content = calculatorContent?.find(c => c.section === 'calculator_page_header');
    return content?.content as PageHeaderCMS | null;
  };

  // Helper to get category content from CMS
  const getCategoryContent = (categoryId: string): CategoryCMS | null => {
    const sectionName = `calculator_category_${categoryId}`;
    const content = calculatorContent?.find(c => c.section === sectionName);
    return content?.content as CategoryCMS | null;
  };

  // Helper to get calculator items from CMS
  const getCalculatorItems = (): CalculatorItemCMS[] => {
    return calculatorContent
      ?.filter(c => c.section === 'calculator_item')
      .map(c => c.content as CalculatorItemCMS)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) || [];
  };

  // Helper to get calculator name from CMS
  const getCalculatorName = (categoryId: string, calculatorId: string, defaultName: string): string => {
    const items = getCalculatorItems();
    const item = items.find(i => i.categoryId === categoryId && i.calculatorId === calculatorId);
    return item?.name || defaultName;
  };

  // Helper to get calculator description from CMS  
  const getCalculatorDescription = (categoryId: string, calculatorId: string): string | null => {
    const items = getCalculatorItems();
    const item = items.find(i => i.categoryId === categoryId && i.calculatorId === calculatorId);
    return item?.description || null;
  };

  const pageHeader = getPageHeader();

  // Filter categories based on access control and search term
  const accessibleCategories = calculatorCategories.filter(category => 
    hasCalculatorAccess(category.id)
  );

  const filteredCategories = accessibleCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.calculators.some(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentCategory = calculatorCategories.find(cat => cat.id === selectedCategory);
  const currentCalculatorData = currentCategory?.calculators.find(calc => calc.id === selectedCalculator);

  const handleCalculatorSelect = (calculatorId: string) => {
    setSelectedCalculator(calculatorId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('calculator', calculatorId);
    window.history.pushState({}, '', url.toString());
  };

  const handleBackToList = () => {
    setSelectedCalculator(null);
    // Remove calculator parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('calculator');
    window.history.pushState({}, '', url.toString());
  };

  // Default disclaimer text
  const defaultDisclaimer = "This example is for illustrative purposes only, and actual outcomes may differ. The information provided does not constitute tax, legal, investment, or retirement advice and should not be used to avoid federal tax penalties. Readers are advised to consult an independent tax, legal, or financial professional before making any decisions. While the content is based on sources believed to be reliable, no guarantee is made for accuracy or completeness. Nothing herein should be interpreted as an offer or solicitation to buy or sell any security.";

  if (selectedCalculator && currentCalculatorData && currentCategory) {
    const CalculatorComponent = currentCalculatorData.component;
    
    // Get CMS content for this specific calculator
    const cmsContent = getIndividualCalculatorContent(currentCalculatorData.id);
    
    // Get calculator name - use CMS pageTitle, then calculator_item name, then default
    const calcItemName = getCalculatorName(currentCategory.id, currentCalculatorData.id, currentCalculatorData.name);
    const displayTitle = cmsContent?.pageTitle || calcItemName;
    
    // Get description - use CMS pageDescription, then calculator_item description, then category description
    const calcItemDesc = getCalculatorDescription(currentCategory.id, currentCalculatorData.id);
    const catCMS = getCategoryContent(currentCategory.id);
    const displayDescription = cmsContent?.pageDescription || calcItemDesc || catCMS?.description || currentCategory.description;
    
    // Get card title and description
    const cardTitle = cmsContent?.cardTitle || displayTitle;
    const cardDescription = cmsContent?.cardDescription || "Calculate your complete financial position";
    
    // Get disclaimer
    const disclaimer = cmsContent?.disclaimer || defaultDisclaimer;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={handleBackToList} className="mb-4">
              ← Back to Calculators
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {displayTitle}
            </h1>
            <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
              {displayDescription}
            </p>
          </div>
          <CalculatorComponent 
            calculatorName={currentCalculatorData.name}
            cardTitle={cardTitle}
            cardDescription={cardDescription}
            disclaimer={disclaimer}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width at Top */}
      <div className="w-full">
        <img 
          src={heroImage} 
          alt="Financial planning and calculators" 
          className="w-full object-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px]"
        />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 sm:mb-12 px-4">
          {pageHeader?.subtitle && (
            <p className="text-sm font-medium text-primary uppercase tracking-wide mb-2">
              {pageHeader.subtitle}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {pageHeader?.title || "Financial Calculator Suite"}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 whitespace-pre-wrap">
            {pageHeader?.description || "Access our complete collection of 32+ professional-grade financial calculators. Make informed decisions with real-time calculations and personalized insights."}
          </p>
        </div>

        {/* Search */}
        <div className="text-center mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={pageHeader?.searchPlaceholder || "Search calculators..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {accessibleCategories.reduce((total, cat) => total + cat.calculators.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                {accessLevel === "limited" ? "Available" : "Total"} Calculators
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <PieChart className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{accessibleCategories.length}</div>
              <div className="text-sm text-muted-foreground">
                {accessLevel === "limited" ? "Available" : "Total"} Categories
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {savedCalculations?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Saved Calculations</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-8">
          {/* Category Tabs */}
          <TabsList className={`grid w-full h-auto ${
            accessibleCategories.length === 1 ? 'grid-cols-1' :
            accessibleCategories.length <= 2 ? 'grid-cols-2' :
            accessibleCategories.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
            'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8'
          }`}>
            {accessibleCategories.map((category) => {
              const catCMS = getCategoryContent(category.id);
              const CategoryIcon = catCMS?.icon ? getIconByName(catCMS.icon) : category.icon;
              const catTitle = catCMS?.title || category.title;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs flex-col h-auto py-2 px-1 sm:px-3"
                  data-testid={`tab-${category.id}`}
                >
                  <CategoryIcon className="h-4 w-4 mr-1" />
                  <span className="hidden lg:inline">{catTitle.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Category Content */}
          {accessibleCategories.map((category) => {
            const catCMS = getCategoryContent(category.id);
            const CategoryIcon = catCMS?.icon ? getIconByName(catCMS.icon) : category.icon;
            const catTitle = catCMS?.title || category.title;
            const catDesc = catCMS?.description || category.description;
            
            return (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                <div className="text-center">
                  <Badge className="mb-4">
                    <CategoryIcon className="h-4 w-4 mr-1" />
                    {catTitle}
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{catTitle}</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{catDesc}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {category.calculators.map((calculator) => {
                    const calcName = getCalculatorName(category.id, calculator.id, calculator.name);
                    const calcDesc = getCalculatorDescription(category.id, calculator.id);
                    
                    return (
                      <Card
                        key={calculator.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer group border border-gray-200"
                        onClick={() => handleCalculatorSelect(calculator.id)}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center text-lg">
                            <CategoryIcon className="h-5 w-5 text-primary mr-2" />
                            {calcName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                            {calcDesc || `Professional calculator for ${calcName.toLowerCase()}`}
                          </p>
                          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                            Open Calculator
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Access Notice based on user type */}
        {isGuestUser && (
          <Card className="mt-12 border-secondary/20 bg-secondary/5">
            <CardContent className="p-8 text-center">
              <Car className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Guest Access - Vehicle Financing Only
              </h3>
              <p className="text-muted-foreground mb-6">
                You currently have access to 2 Vehicle Financing calculators. 
                Create a full account to unlock all 32+ calculators across 8 categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.href = "/register"} data-testid="button-upgrade-guest">
                  Upgrade to Full Access
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-login-guest"
                >
                  Login Existing Account
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {!isAuthenticated && !isGuestUser && (
          <Card className="mt-12 border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Full Calculator Access Available
              </h3>
              <p className="text-muted-foreground mb-6">
                Get unlimited access to all 32+ calculators, save your results, and export professional reports.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.href = "/register"} data-testid="button-register-full">
                  Create Full Account
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-login-full"
                >
                  Login Existing Account
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
