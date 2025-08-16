import { Link } from "wouter";
import { ChartLine, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-white h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Investigoonline</h3>
                <p className="text-xs text-gray-400">by IFS Group</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional financial planning platform powered by 40+ years of IFS Group expertise.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators" className="text-gray-400 hover:text-white transition-colors">Financial Calculators</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guest Access</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Client Login</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources?type=article" className="text-gray-400 hover:text-white transition-colors">Articles & Insights</Link></li>
              <li><Link href="/resources?type=video" className="text-gray-400 hover:text-white transition-colors">Video Library</Link></li>
              <li><Link href="/resources?type=newsletter" className="text-gray-400 hover:text-white transition-colors">Market Newsletters</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ Database</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About IFS Group</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Leadership Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press & Media</a></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
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
