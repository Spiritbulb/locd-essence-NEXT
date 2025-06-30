import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // Should now work
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { NotificationProvider } from '@/context/NotificationContext'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Loc\'d Essence',
  description: 'A place for all your hair care needs',
  icons: {
    icon: '/creator.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col w-full min-h-screen`}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <NotificationProvider>
                <Navbar />
                <main className="w-full mx-auto py-8">
                  {children}
                </main>
                <Footer />
              </NotificationProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}