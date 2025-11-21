import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChartLine, Linkedin, Twitter, Facebook } from "lucide-react";
import type { PageContent } from "@shared/schema";
import ifsLogo from "@assets/image_1763735441524.jpeg";

export default function Footer() {
  // Fetch footer content
  const { data: footerContent } = useQuery<PageContent[]>({
    queryKey: ['/api/content', 'footer'],
    queryFn: async () => {
      const res = await fetch('/api/content?page=footer', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch footer: ${res.statusText}`);
      }
      return res.json();
    },
  });

  // Helper to get content by section
  const getSection = (sectionName: string) => {
    return footerContent?.find(c => c.section === sectionName);
  };

  const companyDetails = getSection('footer_company_details')?.content as any;
  const platformLinks = getSection('footer_platform')?.content as any;
  const resourcesLinks = getSection('footer_resources')?.content as any;
  const companyLinks = getSection('footer_company')?.content as any;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src={ifsLogo} 
                alt="IFS Wealth Management" 
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4" data-testid="text-footer-tagline">
              {companyDetails?.tagline || 'Professional financial planning platform powered by 40+ years of IFS Group expertise.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-footer-platform-title">
              {platformLinks?.title || 'Platform'}
            </h4>
            <ul className="space-y-2 text-sm">
              {platformLinks?.links?.map((link: any, index: number) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors" data-testid={`link-footer-platform-${index}`}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors" data-testid={`link-footer-platform-${index}`}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-footer-resources-title">
              {resourcesLinks?.title || 'Resources'}
            </h4>
            <ul className="space-y-2 text-sm">
              {resourcesLinks?.links?.map((link: any, index: number) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors" data-testid={`link-footer-resources-${index}`}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors" data-testid={`link-footer-resources-${index}`}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-footer-company-title">
              {companyLinks?.title || 'Company'}
            </h4>
            <ul className="space-y-2 text-sm">
              {companyLinks?.links?.map((link: any, index: number) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors" data-testid={`link-footer-company-${index}`}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors" data-testid={`link-footer-company-${index}`}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 IFS Group. All rights reserved. • 
              <a href="#" className="hover:text-white transition-colors ml-1">Privacy Policy</a> • 
              <a href="#" className="hover:text-white transition-colors ml-1">Terms of Service</a> • 
              <a href="#" className="hover:text-white transition-colors ml-1">Disclosures</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Powered by</span>
              <div className="flex items-center space-x-2">
                <ChartLine className="text-primary h-4 w-4" />
                <span className="text-sm font-medium">AI Financial Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
