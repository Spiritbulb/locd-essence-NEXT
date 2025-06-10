'use client';
import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Crown } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8a6e5d]/20 via-transparent to-[#7e4507]/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 group">
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#8a6e5d] via-[#a38776] to-[#7e4507] bg-clip-text text-transparent">
                  Loc'd Essence
                </span>
                <div className="text-xs text-gray-500 -mt-1">Hair • Jewelry • Beauty</div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Celebrating natural beauty and authentic style with premium hair care, stunning jewelry, and beauty essentials that enhance your unique essence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 hover:text-[#8a6e5d] transition-colors duration-300 group">
                <Mail className="w-4 h-4 text-[#8a6e5d] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">hello@locdessence.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-[#8a6e5d] transition-colors duration-300 group">
                <Phone className="w-4 h-4 text-[#8a6e5d] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-[#8a6e5d] transition-colors duration-300 group">
                <MapPin className="w-4 h-4 text-[#8a6e5d] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">New York, NY</span>
              </div>
            </div>
          </div>
          
          {/* Shop Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Shop
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/products", label: "All Products" },
                { href: "/hair-care", label: "Hair Care" },
                { href: "/jewelry", label: "Jewelry" },
                { href: "/accessories", label: "Accessories" },
                { href: "/new-arrivals", label: "New Arrivals" },
                { href: "/sale", label: "Sale Items" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[#8a6e5d] transition-all duration-300 text-sm group flex items-center gap-2"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    <div className="w-0 group-hover:w-2 h-0.5 bg-[#8a6e5d] transition-all duration-300 rounded-full"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Company
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/about", label: "Our Story" },
                { href: "/sustainability", label: "Sustainability" },
                { href: "/careers", label: "Careers" },
                { href: "/press", label: "Press Kit" },
                { href: "/contact", label: "Contact Us" },
                { href: "/blog", label: "Beauty Blog" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[#8a6e5d] transition-all duration-300 text-sm group flex items-center gap-2"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    <div className="w-0 group-hover:w-2 h-0.5 bg-[#8a6e5d] transition-all duration-300 rounded-full"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Care Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Customer Care
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-full"></div>
            </h4>
            <ul className="space-y-4 mb-8">
              {[
                { href: "/help", label: "Help Center" },
                { href: "/shipping", label: "Shipping Info" },
                { href: "/returns", label: "Returns & Exchanges" },
                { href: "/size-guide", label: "Size Guide" },
                { href: "/track-order", label: "Track Your Order" },
                { href: "/gift-cards", label: "Gift Cards" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-[#8a6e5d] transition-all duration-300 text-sm group flex items-center gap-2"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    <div className="w-0 group-hover:w-2 h-0.5 bg-[#8a6e5d] transition-all duration-300 rounded-full"></div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-[#8a6e5d]/5 to-[#7e4507]/5 p-6 rounded-2xl border border-[#8a6e5d]/10">
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8a6e5d]" />
                Stay Connected
              </h5>
              <p className="text-sm text-gray-600 mb-4">Get beauty tips, new arrivals, and exclusive offers.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl text-sm font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-200/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 mr-2">Follow us:</span>
              {[
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" }
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="p-2.5 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-[#8a6e5d] hover:to-[#7e4507] rounded-xl transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-[#8a6e5d] transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#8a6e5d] transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-[#8a6e5d] transition-colors duration-300">
                Accessibility
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Loc'd Essence. All rights reserved. Made with 
              <Heart className="w-4 h-4 text-[#8a6e5d] inline mx-1" />
              for natural beauty.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}