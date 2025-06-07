'use client';
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from './ui/Button';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import styles from './navbar.module.css';

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
    <nav className={`${styles.navbar} ${isScrolled ? styles.transparent : ''}`}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          {/* Logo */}
          <Button onClick={handleHomeClick} className={styles.logo}>
            <span className={styles.logoText}>
              Loc'd Essence
            </span>
          </Button>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/products" className={styles.navLink}>
              Products
            </Link>

            {/* Cart Button */}
            <button onClick={handleCartClick} className={styles.cartButton}>
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className={styles.cartBadge}>
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Section */}
            {!isLoading && user ? (
              <div className={styles.userSection}>
                <div className={styles.userInfo}>
                  <Image
                    src={user.picture || '/default-avatar.png'}
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className={styles.userAvatar}
                  />
                  <span className={styles.userName}>
                    {user.name}
                  </span>
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className={styles.loginButton}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.mobileMenuToggle}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed}`}>
          <div className={styles.mobileMenuContent}>
            <Link href="/" onClick={closeMenus} className={styles.mobileNavLink}>
              Home
            </Link>
            <Link href="/products" onClick={closeMenus} className={styles.mobileNavLink}>
              Products
            </Link>
            <button onClick={handleCartClick} className={styles.mobileCartButton}>
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <span className={styles.cartBadge}>
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile User Section */}
            {!isLoading && user ? (
              <div className={styles.mobileUserSection}>
                <div className={styles.mobileUserInfo}>
                  <Image
                    src={user.picture || '/default-avatar.png'}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className={styles.mobileUserAvatar}
                  />
                  <span className={styles.mobileUserName}>{user.name}</span>
                </div>
                <button onClick={logout} className={styles.mobileLogoutButton}>
                  Logout
                </button>
              </div>
            ) : (
              <div className={styles.mobileUserSection}>
                <Link href="/api/auth/login" onClick={closeMenus} className={styles.mobileLoginButton}>
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