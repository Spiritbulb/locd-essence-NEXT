/**
 * E-Commerce Utility Library
 * Reusable functions for your Next.js e-commerce project
 */

// Format currency with localization
export const formatCurrency = (value: number, locale = 'en-US', currency = 'Ksh'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Calculate discounted price
export const calculateDiscount = (originalPrice: number, discountPercentage: number): number => {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Discount percentage must be between 0 and 100')
  }
  return originalPrice * (1 - discountPercentage / 100)
}

// Generate product slug
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s]+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .trim()
}

// Debounce function for search/input handlers
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Validate email address
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

// Sort array of products
export const sortProducts = (
  products: any[],
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating'
): any[] => {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })
}

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Format date
export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

// Calculate cart totals
export const calculateCartTotals = (items: Array<{ price: number; quantity: number }>) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // Example 10% tax
  const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const total = subtotal + tax + shipping

  return {
    subtotal: formatCurrency(subtotal),
    tax: formatCurrency(tax),
    shipping: formatCurrency(shipping),
    total: formatCurrency(total),
    raw: {
      subtotal,
      tax,
      shipping,
      total,
    },
  }
}

// Create URL search params object
export const createSearchParams = <T extends Record<string, string | number | boolean>>(
  params: T
): URLSearchParams => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  return searchParams
}

// Convert object to query string
export const toQueryString = (params: Record<string, string | number | boolean>): string => {
  return createSearchParams(params).toString()
}

// Parse query string to object
export const parseQueryString = <T extends Record<string, string>>(queryString: string): T => {
  return Object.fromEntries(new URLSearchParams(queryString).entries()) as T
}

// Merge class names (similar to clsx + tailwind-merge)
export const cn = (...classes: Array<string | boolean | undefined | null>): string => {
  return classes.filter(Boolean).join(' ')
}

