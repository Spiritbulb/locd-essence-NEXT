'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, Crown, Search, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import link from 'next/link';

const Navbar = ({ cartItemsCount = 0 }) => {
  const pathname = usePathname(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Mock user data - replace with your actual auth logic
  const [user, setUser] = useState({
    name: "Sarah Johnson",
    picture: "https://randomuser.me/api/portraits/women/44.jpg",
    isLoggedIn: true
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleLogin = () => {
    // Mock login - replace with actual auth
    setUser({
      name: "Sarah Johnson",
      picture: "https://randomuser.me/api/portraits/women/44.jpg",
      isLoggedIn: true
    });
    closeMenus();
  };

  const handleLogout = () => {
    setUser({ name: "", picture: "", isLoggedIn: false });
    closeMenus();
  };

   const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/accessories', label: 'Accessories' },
    { href: '/about', label: 'Our Story' },
  ];

    const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
/* Removed erroneous isLinkActive(link.href) call */

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <button className="flex items-center group transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">   
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#8a6e5d] via-[#a38776] to-[#7e4507] bg-clip-text text-transparent">
                      Loc'd Essence
                    </span>
                    <div className="text-xs text-gray-500 -mt-1">Hair • Jewelry • Beauty</div>
                  </div>
                </div>
              </button>
            </div>

                    {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                isLinkActive(link.href)
                  ? 'text-[#8a6e5d] bg-[#8a6e5d]/10' 
                  : 'text-gray-700 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10'
              }`}
            >

                               {link.label}
              {isLinkActive(link.href) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#8a6e5d] rounded-full"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8a6e5d]/0 via-[#8a6e5d]/5 to-[#8a6e5d]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          ))}
        </div>


            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300 group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>

              {/* Wishlist Button */}
              <button className="p-2.5 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300 relative group">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  2
                </span>
              </button>

              {/* Cart Button */}
              <button className="p-2.5 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300 relative group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Section */}
              {user.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#8a6e5d]/10 to-[#a38776]/10 rounded-2xl border border-[#8a6e5d]/20 hover:border-[#8a6e5d]/30 transition-all duration-300 cursor-pointer group">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-[#8a6e5d]/30 group-hover:border-[#8a6e5d]/50 transition-all duration-300"
                    />
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate group-hover:text-[#8a6e5d] transition-colors duration-300">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium text-sm hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${
            isSearchOpen ? 'max-h-20 pb-4' : 'max-h-0'
          }`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for hair care, jewelry, accessories..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6 bg-white/95 backdrop-blur-xl border-t border-gray-100">
            {/* Mobile Search */}
            <div className="mb-6 pt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-6">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={closeMenus}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                     isLinkActive(link.href)
                      ? 'text-[#8a6e5d] bg-[#8a6e5d]/10' 
                      : 'text-gray-700 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center justify-between mb-6 px-2">
              <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300">
                <Heart className="w-5 h-5" />
                <span className="text-sm">Wishlist (2)</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">Cart ({cartItemsCount})</span>
              </button>
            </div>

            {/* Mobile User Section */}
            {user.isLoggedIn ? (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-4 mb-4 px-2">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-[#8a6e5d]/30"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">Premium Member</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-[#8a6e5d]/10 text-[#8a6e5d] rounded-xl font-medium text-sm hover:bg-[#8a6e5d]/20 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={handleLogin}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg"
                >
                  Sign In to Your Account
                </button>
                <div className="text-center mt-3">
                  <a href="/signup" className="text-sm text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300">
                    Don't have an account? Sign up
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenus}
        />
      )}
    </>
  );
};

export default Navbar;