'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  cartItemsCount?: number;
}

export default function Navbar({ cartItemsCount = 0 }: NavbarProps) {
  const { user, isLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    router.push('/api/auth/logout');
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    router.push('/cart');
    closeMenus();
  };

  const handleHomeClick = () => {
    router.push('/');
    closeMenus();
  };

  const handleProductsClick = () => {
    router.push('/products');
    closeMenus();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-[rgba(201,165,149,0.2)] backdrop-blur-xl transition-all duration-300 ease-in-out ${
      isScrolled ? 'bg-transparent shadow-none border-transparent backdrop-blur-none' : ''
    }`}>
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={handleHomeClick}
            className="flex items-center transition-all duration-300 ease-in-out hover:-translate-y-[1px]"
          >
            <span className="text-2xl font-bold bg-gradient-to-br from-[#a67c5a] to-[#d4779b] bg-clip-text text-transparent">
              Loc'd Essence
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[#8b6d5d] hover:text-[#6b4e3d] transition-all duration-300 ease-in-out font-medium px-4 py-2 rounded-lg hover:bg-[rgba(212,165,116,0.1)] hover:-translate-y-[1px] relative"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-[#8b6d5d] hover:text-[#6b4e3d] transition-all duration-300 ease-in-out font-medium px-4 py-2 rounded-lg hover:bg-[rgba(212,165,116,0.1)] hover:-translate-y-[1px] relative"
            >
              Products
            </Link>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="text-[#8b6d5d] hover:text-[#6b4e3d] transition-all duration-300 ease-in-out p-2 rounded-lg hover:bg-[rgba(212,165,116,0.1)] hover:-translate-y-[1px] relative"
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#d4a574] to-[#e8b4cb] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Section */}
            {!isLoading && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-3 py-2 bg-[rgba(245,240,235,0.8)] rounded-full border border-[rgba(201,165,149,0.3)] backdrop-blur-sm">
                  <Image
                    src={user.picture || '/default-avatar.png'}
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-[rgba(212,165,116,0.5)]"
                  />
                  <span className="text-sm font-medium text-[#8b6d5d] max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm px-4 py-2 border border-[rgba(139,109,93,0.3)] text-[#8b6d5d] bg-[rgba(255,255,255,0.5)] rounded-lg transition-all duration-300 ease-in-out hover:bg-[rgba(212,165,116,0.1)] hover:text-[#6b4e3d] hover:border-[rgba(139,109,93,0.5)] hover:-translate-y-[1px] backdrop-blur-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-gradient-to-br from-[#d4a574] to-[#e8b4cb] text-white rounded-full transition-all duration-300 ease-in-out font-medium shadow-lg hover:from-[#c19660] hover:to-[#d9a2bb] hover:shadow-xl hover:-translate-y-[2px]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#8b6d5d] transition-all duration-300 ease-in-out hover:bg-[rgba(212,165,116,0.1)]"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-[rgba(245,240,235,0.95)] rounded-xl border border-[rgba(201,165,149,0.3)] p-4 backdrop-blur-lg shadow-lg">
            <Link
              href="/"
              onClick={closeMenus}
              className="block px-4 py-3 text-[#8b6d5d] rounded-lg transition-all duration-300 ease-in-out hover:text-[#6b4e3d] hover:bg-[rgba(212,165,116,0.15)] mb-1"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={closeMenus}
              className="block px-4 py-3 text-[#8b6d5d] rounded-lg transition-all duration-300 ease-in-out hover:text-[#6b4e3d] hover:bg-[rgba(212,165,116,0.15)] mb-1"
            >
              Products
            </Link>
            <button
              onClick={handleCartClick}
              className="w-full flex items-center justify-between px-4 py-3 text-[#8b6d5d] rounded-lg transition-all duration-300 ease-in-out hover:text-[#6b4e3d] hover:bg-[rgba(212,165,116,0.15)] mb-1"
            >
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <span className="bg-gradient-to-br from-[#d4a574] to-[#e8b4cb] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile User Section */}
            {!isLoading && user ? (
              <div className="pt-4 border-t border-[rgba(201,165,149,0.3)] mt-3">
                <div className="flex items-center gap-3 px-4 py-2 mb-3">
                  <Image
                    src={user.picture || '/default-avatar.png'}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-[rgba(212,165,116,0.5)]"
                  />
                  <span className="font-medium text-[#8b6d5d]">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-3 py-3 bg-[rgba(212,165,116,0.2)] text-[#8b6d5d] rounded-lg transition-all duration-300 ease-in-out font-medium hover:bg-[rgba(212,165,116,0.3)] hover:text-[#6b4e3d]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-[rgba(201,165,149,0.3)] mt-3">
                <Link
                  href="/api/auth/login"
                  onClick={closeMenus}
                  className="block w-full px-3 py-3 bg-gradient-to-br from-[#d4a574] to-[#e8b4cb] text-white rounded-lg transition-all duration-300 ease-in-out font-medium text-center hover:from-[#c19660] hover:to-[#d9a2bb]"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}