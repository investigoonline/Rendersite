import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import faqImage from "@assets/image_1765300607561.png";
import { useDynamicImage } from "@/hooks/useDynamicImage";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create a guest account?",
        answer:
          "Click on 'Guest Access' in the top navigation, enter your email, and choose your access level. You'll receive a verification email to activate your 30-day trial.",
      },
      {
        question: "What's the difference between guest and client accounts?",
        answer:
          "Guest accounts provide 30-day trial access to basic calculators and resources. Client accounts offer unlimited access, personalized advice, portfolio management, and priority support.",
      },
      {
        question: "How do I upgrade to a full client account?",
        answer:
          "Contact our team through the 'Become a Client' page or call +1 (555) 123-4567 to schedule a consultation and learn about our comprehensive financial planning services.",
      },
    ],
  },
  {
    category: "Calculators",
    questions: [
      {
        question: "Can I save my calculator results?",
        answer:
          "Yes, both guest and client accounts can save calculator results. Guest accounts can save results for the duration of their 30-day trial period.",
      },
      {
        question: "How accurate are the financial calculations?",
        answer:
          "Our calculators use industry-standard formulas and are regularly updated. However, results are for informational purposes and should not replace professional financial advice.",
      },
      {
        question: "Can I export my calculations to PDF?",
        answer:
          "Yes, all calculator results can be exported to PDF format. Client accounts also have access to detailed reports and email delivery options.",
      },
    ],
  },
  {
    category: "Account & Billing",
    questions: [
      {
        question: "How much do client services cost?",
        answer:
          "Our fee structure is transparent and based on assets under management. Contact us for a personalized quote based on your specific needs and portfolio size.",
      },
      {
        question: "Is there a minimum investment requirement?",
        answer:
          "We work with clients at various investment levels. Contact our team to discuss your specific situation and find the right service level for you.",
      },
      {
        question: "How do I cancel my account?",
        answer:
          "Guest accounts automatically expire after 30 days. Client accounts can be closed by contacting your advisor or our support team with 30 days notice.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        question: "How is my financial data protected?",
        answer:
          "We use bank-level security with 256-bit SSL encryption, SOC 2 Type II compliance, and never store sensitive account credentials. All data is encrypted at rest and in transit.",
      },
      {
        question: "Do you sell my personal information?",
        answer:
          "Never. We are committed to protecting your privacy and will never sell, rent, or share your personal information with third parties for marketing purposes.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "All data is stored in secure, GDPR-compliant data centers with redundant backups and 99.9% uptime guarantees.",
      },
    ],
  },
];

export default function FAQ() {
  const heroImage = useDynamicImage('faq', 'hero', faqImage);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image - Full Width at Top */}
      <div className="w-full">
        <img 
          src={heroImage} 
          alt="Frequently Asked Questions" 
          className="w-full object-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our wealth management services and financial planning.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search frequently asked questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredFAQ.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  {category.category}
                  <Badge variant="secondary" className="ml-2">
                    {category.questions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.questions.map((item, itemIndex) => {
                    const key = `${categoryIndex}-${itemIndex}`;
                    const isExpanded = expandedItems.has(key);

                    return (
                      <div
                        key={itemIndex}
                        className="border border-gray-200 rounded-lg"
                      >
                        <button
                          onClick={() => toggleExpanded(key)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">
                            {item.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-3 text-muted-foreground">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {searchTerm && filteredFAQ.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or browse all categories
              above.
            </p>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-12 border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you with any additional
              questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
