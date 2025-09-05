import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/WiseUpLogo.png" alt="WiseUp Logo" className="h-8 w-auto" />
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Connecting experienced retirees with innovative startups. Your expertise, their growth
              - together we build the future.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 text-primary rounded-full border border-1 transition-shadow transition-colors cursor-pointer font-medium border border-[rgba(255,255,255,0.3)] bg-white/40 bg-clip-padding backdrop-filter backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:text-primary hover:border-primary hover:bg-transparent hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.05] ease-out group"
                onClick={() => (window.location.href = 'mailto:contact@wiseup.com')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/for-startups"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  For Startups
                </Link>
              </li>
              <li>
                <Link
                  to="/for-retirees"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  For Retirees
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/imprint"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Imprint
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
                >
                  <ArrowRight className="h-3 w-3 mr-2 group-hover:translate-x-1 transition-transform" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-gray-500 text-sm mb-4 md:mb-0">
            <span>© 2025 WiseUp. Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500" />
            <span>in Germany</span>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
