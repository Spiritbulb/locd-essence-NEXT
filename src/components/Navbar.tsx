'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, Crown, Search, Heart, Mail, Lock, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Navbar = ({ cartItemsCount = 0 }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authMode, setAuthMode] = useState('signin');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { customer, loginWithPassword, createCustomer, recoverCustomerAccount, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update isScrolled based on scroll position
      setIsScrolled(currentScrollY > 10);

      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsAuthOpen(false);
  };

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setAuthMessage('');
  };

  interface AuthFormEvent extends React.FormEvent<HTMLFormElement> { }

  interface RecoverResult {
    success: boolean;
    error?: string;
    message?: string;
  }

  interface CreateCustomerParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  interface CreateCustomerResult {
    success: boolean;
    error?: string;
  }

  interface LoginResult {
    success: boolean;
    error?: string;
  }

  type AuthMode = 'signin' | 'signup' | 'recover';

  const handleAuthSubmit = async (e: AuthFormEvent) => {
    e.preventDefault();

    if (authMode === 'recover') {
      const { success, error, message }: RecoverResult = await recoverCustomerAccount(email);
      setAuthMessage(success ? message! : error || 'Error sending recovery email');
    } else if (authMode === 'signup') {
      // Validate passwords match
      if (password !== confirmPassword) {
        setAuthMessage('Passwords do not match');
        return;
      }

      // Validate password strength (optional)
      if (password.length < 6) {
        setAuthMessage('Password must be at least 6 characters long');
        return;
      }

      const { success, error }: CreateCustomerResult = await createCustomer({
        firstName,
        lastName,
        email,
        password
      } as CreateCustomerParams);

      setAuthMessage(success ? 'Account created successfully!' : error || 'Sign up failed');

      if (success) {
        setTimeout(() => {
          setIsAuthOpen(false);
          resetAuthForm();
        }, 1500);
      }
    } else {
      const { success, error }: LoginResult = await loginWithPassword(email, password);
      setAuthMessage(success ? 'Login successful!' : error || 'Login failed');

      if (success) {
        setTimeout(() => {
          setIsAuthOpen(false);
          resetAuthForm();
        }, 1500);
      }
    }
  };

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'Our Story' },
  ];

  interface NavigationLink {
    href: string;
    label: string;
  }

  interface NavbarProps {
    cartItemsCount?: number;
  }

  const isLinkActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getAuthTitle = () => {
    switch (authMode) {
      case 'signup': return 'Create Account';
      case 'recover': return 'Reset Password';
      default: return 'Welcome back';
    }
  };

  const getAuthDescription = () => {
    switch (authMode) {
      case 'signup': return 'Join our community and discover amazing products';
      case 'recover': return 'Enter your email to receive a password reset link';
      default: return 'Sign in to your account';
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
            : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50'
          }`}

      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center">
              <button className="flex items-center group transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div>
                    <img
                      src="/logoloc.png"
                      alt="Loc'd Essence Logo"
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#8a6e5d] via-[#a38776] to-[#7e4507] bg-clip-text text-transparent">
                      Loc'd Essence
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Hair • Jewelry • Beauty</div>
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
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${isLinkActive(link.href)
                    ? 'text-[#8a6e5d] bg-[#8a6e5d]/10'
                    : 'text-gray-700 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10'
                    }`}
                >
                  {link.label}
                  {isLinkActive(link.href)}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsAuthOpen(false);
                }}
                className="p-2.5 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300 group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => router.push('/favourites')}
                className="p-2.5 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300 relative group">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />

              </button>

              {/* Cart Button */}
              <button
                onClick={() => router.push('/cart')}
                className="p-2.5 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300 relative group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Auth Section */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#8a6e5d]/10 to-[#a38776]/10 rounded-2xl border border-[#8a6e5d]/20 hover:border-[#8a6e5d]/30 transition-all duration-300 cursor-pointer group">
                      <div className="w-8 h-8 rounded-full border-2 border-[#8a6e5d]/30 group-hover:border-[#8a6e5d]/50 transition-all duration-300 bg-[#8a6e5d]/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#8a6e5d]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate group-hover:text-[#8a6e5d] transition-colors duration-300">
                        {customer?.firstName || 'My Account'}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(!isAuthOpen)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium text-sm hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Sign In
                  </button>
                )}

                {/* Auth Dropdown */}
                <div className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 origin-top ${isAuthOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'}`}>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {getAuthTitle()}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {getAuthDescription()}
                    </p>

                    <form onSubmit={handleAuthSubmit} className="space-y-3">
                      {authMode === 'signup' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="First Name"
                              required
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last Name"
                              required
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
                            />
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
                        />
                      </div>

                      {authMode !== 'recover' && (
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
                          />
                        </div>
                      )}

                      {authMode === 'signup' && (
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-lg font-medium text-sm hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300"
                      >
                        {authMode === 'recover' ? 'Send Reset Link' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
                      </button>
                    </form>

                    {/* Auth Mode Switcher */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      {authMode === 'signin' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('signup');
                              resetAuthForm();
                            }}
                            className="text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300 flex items-center gap-1"
                          >
                            <UserPlus className="w-4 h-4" />
                            Create Account
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('recover');
                              resetAuthForm();
                            }}
                            className="text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300"
                          >
                            Forgot Password?
                          </button>
                        </>
                      )}

                      {authMode === 'signup' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signin');
                            resetAuthForm();
                          }}
                          className="text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300 mx-auto"
                        >
                          Already have an account? Sign In
                        </button>
                      )}

                      {authMode === 'recover' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('signin');
                            resetAuthForm();
                          }}
                          className="text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300 mx-auto"
                        >
                          Back to Sign In
                        </button>
                      )}
                    </div>

                    {authMessage && (
                      <p className={`mt-3 text-sm text-center ${authMessage.includes('successful') || authMessage.includes('sent') || authMessage.includes('created') ? 'text-green-600' : 'text-red-600'}`}>
                        {authMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
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
          <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 pb-4' : 'max-h-0'}`}>
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
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
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
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isLinkActive(link.href)
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
              <button
                onClick={() => { router.push('/favourites'); closeMenus(); }}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => { router.push('/cart'); closeMenus(); }}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/10 rounded-xl transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">({cartItemsCount})</span>
              </button>
            </div>

            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-4 mb-4 px-2">
                  <div className="w-12 h-12 rounded-full border-2 border-[#8a6e5d]/30 bg-[#8a6e5d]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#8a6e5d]" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{customer?.firstName || 'My Account'}</div>
                    <div className="text-sm text-gray-500">{customer?.email}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 bg-[#8a6e5d]/10 text-[#8a6e5d] rounded-xl font-medium text-sm hover:bg-[#8a6e5d]/20 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {getAuthTitle()}
                </h3>
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  {authMode === 'signup' && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                    />
                  </div>

                  {authMode !== 'recover' && (
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                      />
                    </div>
                  )}

                  {authMode === 'signup' && (
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg"
                  >
                    {authMode === 'recover' ? 'Send Reset Link' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>
                </form>

                {/* Mobile Auth Mode Switcher */}
                <div className="mt-4 space-y-2 text-sm text-center">
                  {authMode === 'signin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          resetAuthForm();
                        }}
                        className="block w-full text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300"
                      >
                        Don't have an account? Create one
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('recover');
                          resetAuthForm();
                        }}
                        className="block w-full text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300"
                      >
                        Forgot Password?
                      </button>
                    </>
                  )}

                  {authMode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        resetAuthForm();
                      }}
                      className="block w-full text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300"
                    >
                      Already have an account? Sign In
                    </button>
                  )}

                  {authMode === 'recover' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signin');
                        resetAuthForm();
                      }}
                      className="block w-full text-[#8a6e5d] hover:text-[#7e4507] transition-colors duration-300"
                    >
                      Back to Sign In
                    </button>
                  )}
                </div>

                {authMessage && (
                  <p className={`mt-3 text-sm text-center ${authMessage.includes('successful') || authMessage.includes('sent') || authMessage.includes('created') ? 'text-green-600' : 'text-red-600'}`}>
                    {authMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>


      </nav>

      {/* Backdrop for auth dropdown */}
      {isAuthOpen && (
        <div
          className="fixed inset-0 z-40 hidden lg:block"
          onClick={closeMenus}
        />
      )}
    </>
  );
};

export default Navbar;