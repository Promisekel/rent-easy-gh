import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-ghana-gold mb-4">Rent Easy GH</h3>
            <p className="text-gray-300 mb-4">
              Ghana's premier rental platform connecting landlords and renters across all regions. 
              Find your perfect home or list your property with ease.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-5 bg-ghana-red"></div>
              <div className="w-8 h-5 bg-ghana-gold"></div>
              <div className="w-8 h-5 bg-ghana-green"></div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/listings" className="text-gray-300 hover:text-white">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-gray-300 hover:text-white">
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/report-abuse" className="text-gray-300 hover:text-white">
                  Report Abuse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Email</h5>
              <p className="text-gray-300">support@renteasygh.com</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Phone</h5>
              <p className="text-gray-300">+233 123 456 789</p>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Address</h5>
              <p className="text-gray-300">Accra, Ghana</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Rent Easy GH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
