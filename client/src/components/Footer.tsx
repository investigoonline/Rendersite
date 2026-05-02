import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChartLine, Linkedin, Twitter, Facebook } from "lucide-react";
import type { PageContent } from "@shared/schema";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export default function Footer() {
  const { hasPageAccess } = usePagePermissions();
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Disclaimer Text */}
        <div className="mb-4 pb-4 border-b border-gray-800">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            The information provided is for educational purposes only and should not be considered financial, legal, or tax advice. IFS makes no warranties regarding accuracy or completeness and disclaims liability for decisions based on this content. Please consult qualified financial, tax, and legal professionals before making any decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Information - Tagline and Social Links */}
          <div className="lg:col-span-1">
            <p className="text-gray-400 text-xs mb-2" data-testid="text-footer-tagline">
              {companyDetails?.tagline || 'Professional financial planning platform powered by 40+ years of IFS Group expertise.'}
            </p>
            <div className="flex space-x-3">
              {hasPageAccess('LinkedIn') && companyDetails?.linkedinUrl && (
                <a href={companyDetails.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-linkedin">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {hasPageAccess('Twitter/X') && companyDetails?.twitterUrl && (
                <a href={companyDetails.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {hasPageAccess('Facebook') && companyDetails?.facebookUrl && (
                <a href={companyDetails.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" data-testid="link-footer-facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold mb-2" data-testid="text-footer-platform-title">
              {platformLinks?.title || 'Platform'}
            </h4>
            <ul className="space-y-1 text-xs">
              {platformLinks?.links?.filter((link: any) => hasPageAccess(link.label)).map((link: any, index: number) => (
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
            <h4 className="text-sm font-semibold mb-2" data-testid="text-footer-resources-title">
              {resourcesLinks?.title || 'Resources'}
            </h4>
            <ul className="space-y-1 text-xs">
              {resourcesLinks?.links?.filter((link: any) => hasPageAccess(link.label)).map((link: any, index: number) => (
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
            <h4 className="text-sm font-semibold mb-2" data-testid="text-footer-company-title">
              {companyLinks?.title || 'Company'}
            </h4>
            <ul className="space-y-1 text-xs">
              {companyLinks?.links?.filter((link: any) => hasPageAccess(link.label)).map((link: any, index: number) => (
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
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-xs text-gray-400">
              © 2024 IFS Group. All rights reserved. • 
              <Link href="/privacy-policy" className="hover:text-white transition-colors ml-1">Privacy Policy</Link> • 
              <Link href="/terms-of-service" className="hover:text-white transition-colors ml-1">Terms of Service</Link> • 
              <Link href="/disclosures" className="hover:text-white transition-colors ml-1">Disclosures</Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Powered by</span>
              <div className="flex items-center space-x-1">
                <ChartLine className="text-primary h-3 w-3" />
                <span className="text-xs font-medium">AI Financial Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
