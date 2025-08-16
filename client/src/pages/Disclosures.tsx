import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink } from "lucide-react";

const disclosures = [
  {
    title: "ADV Part 2A - Firm Brochure",
    description: "Comprehensive information about IFS Group's advisory services, fees, and business practices.",
    lastUpdated: "December 2024",
    type: "PDF",
    size: "2.1 MB"
  },
  {
    title: "ADV Part 2B - Brochure Supplement",
    description: "Information about our investment adviser representatives and their qualifications.",
    lastUpdated: "December 2024", 
    type: "PDF",
    size: "1.8 MB"
  },
  {
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal and financial information.",
    lastUpdated: "November 2024",
    type: "PDF",
    size: "892 KB"
  },
  {
    title: "Business Continuity Plan",
    description: "Our procedures for maintaining operations during significant business disruptions.",
    lastUpdated: "October 2024",
    type: "PDF",
    size: "1.2 MB"
  },
  {
    title: "Proxy Voting Policy",
    description: "Guidelines for voting proxies on behalf of client accounts.",
    lastUpdated: "September 2024",
    type: "PDF",
    size: "756 KB"
  },
  {
    title: "Code of Ethics",
    description: "Standards of conduct for all IFS Group employees and representatives.",
    lastUpdated: "January 2024",
    type: "PDF",
    size: "943 KB"
  }
];

const importantNotices = [
  {
    title: "Investment Risk Disclosure",
    content: "All investments involve risk, including the potential loss of principal. Past performance does not guarantee future results. Market volatility can significantly impact portfolio values."
  },
  {
    title: "Fiduciary Responsibility",
    content: "IFS Group acts as a fiduciary, meaning we are legally obligated to act in your best interests at all times. This includes providing advice that is suitable for your specific financial situation."
  },
  {
    title: "Fee Structure Transparency",
    content: "Our fees are clearly disclosed in our ADV Part 2A. We believe in transparent pricing with no hidden costs or commissions that could create conflicts of interest."
  },
  {
    title: "Data Security",
    content: "We employ bank-level security measures to protect your personal and financial information. All data is encrypted in transit and at rest, and we regularly undergo third-party security audits."
  }
];

export default function Disclosures() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
            Legal & Compliance
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Disclosures & Legal Documents
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access important legal documents, regulatory disclosures, and compliance information.
          </p>
        </div>

        {/* Important Notices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Important Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {importantNotices.map((notice, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{notice.title}</h4>
                  <p className="text-muted-foreground text-sm">{notice.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regulatory Documents</CardTitle>
            <p className="text-muted-foreground">
              Required disclosures and regulatory filings as mandated by the SEC and other regulatory bodies.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disclosures.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground mb-1">{doc.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Updated: {doc.lastUpdated}</span>
                        <span>Type: {doc.type}</span>
                        <span>Size: {doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>SEC Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                IFS Group is registered as an investment adviser with the Securities and Exchange Commission (SEC).
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CRD Number:</span>
                  <span className="font-medium">123456789</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SEC File Number:</span>
                  <span className="font-medium">801-12345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration Date:</span>
                  <span className="font-medium">January 15, 2010</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Memberships</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our advisors maintain active memberships in leading professional organizations.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Certified Financial Planner Board (CFP®)</li>
                <li>• Financial Planning Association (FPA)</li>
                <li>• National Association of Personal Financial Advisors (NAPFA)</li>
                <li>• CFA Institute</li>
                <li>• Financial Industry Regulatory Authority (FINRA)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Need Additional Information?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">SEC Website</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Access our public filing information on the SEC's Investment Adviser Public Disclosure website.
                </p>
                <button className="text-primary hover:underline text-sm">
                  Visit SEC.gov
                </button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">FINRA BrokerCheck</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Verify the background and qualifications of our registered representatives.
                </p>
                <button className="text-primary hover:underline text-sm">
                  Visit BrokerCheck
                </button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Compliance</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Have questions about our disclosures or regulatory requirements?
                </p>
                <button className="text-primary hover:underline text-sm">
                  Email Compliance
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Legal Notice:</strong> The information provided on this page is for informational purposes only and should not be construed as legal or investment advice. 
            All documents are provided in good faith and are believed to be accurate as of their respective dates. IFS Group reserves the right to update these documents 
            as required by law or regulation. Please consult with your advisor or legal counsel regarding specific questions about these disclosures.
          </p>
        </div>
      </div>
    </div>
  );
}