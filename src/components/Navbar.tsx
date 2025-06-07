'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavbarProps {
  cartItemsCount?: number;
}

export default function Navbar({ cartItemsCount = 0 }: NavbarProps) {
  const { user, isLoading } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    router.push('/api/auth/logout');
  };

  const closeMenus = () => {
    setShowMenu(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="w-8 h-8 bg-accent rounded-full mr-2"></span>
          <span className="text-2xl font-bold text-primary">Loc'd Essence</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <button
              className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              onMouseEnter={() => setShowMenu(true)}
              aria-label="Open main menu"
            >
              <i className="fas fa-bars"></i>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
            {showMenu && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <Link href="/" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenus}>Home</Link>
                <Link href="/products" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenus}>Products</Link>
                <Link href="/cart" className="block px-4 py-2 hover:bg-gray-100 relative" onClick={closeMenus}>
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenus}>My Orders</Link>
              </div>
            )}
          </div>

          {!isLoading && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image 
                  src={user.picture || '/default-avatar.png'} 
                  alt={user.name || 'User'} 
                  width={36} 
                  height={36} 
                  className="rounded-full"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button 
                onClick={logout} 
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/api/auth/login" 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          title={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`} />
        </button>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-4 border-t' : 'max-h-0'}`}>
          <Link href="/" className="block px-6 py-3 hover:bg-gray-100" onClick={closeMenus}>Home</Link>
          <Link href="/products" className="block px-6 py-3 hover:bg-gray-100" onClick={closeMenus}>Products</Link>
          <Link href="/cart" className="block px-6 py-3 hover:bg-gray-100 relative" onClick={closeMenus}>
            Cart
            {cartItemsCount > 0 && (
              <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link href="/orders" className="block px-6 py-3 hover:bg-gray-100" onClick={closeMenus}>My Orders</Link>

          {!isLoading && user ? (
            <div className="px-6 py-4 border-t mt-2">
              <div className="flex items-center gap-3 mb-3">
                <Image 
                  src={user.picture || '/default-avatar.png'} 
                  alt={user.name || 'User'} 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
                <span className="font-medium">{user.name}</span>
              </div>
              <button 
                onClick={logout} 
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/api/auth/login" 
              className="block mx-6 my-3 px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-primary-dark transition-colors"
              onClick={closeMenus}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}