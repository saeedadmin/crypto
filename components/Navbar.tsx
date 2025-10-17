import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Bell, 
  User, 
  LogOut, 
  TrendingUp,
  Settings
} from 'lucide-react'
import { Button } from './ui/Button'

interface NavbarProps {
  user?: {
    email: string
    telegram_verified: boolean
  } | null
  onLogout?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    localStorage.removeItem('auth-token')
    router.push('/auth/login')
  }

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <TrendingUp className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold text-gradient">
                  CryptoWatch
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'text-primary-400 bg-primary-900/20' 
                        : 'text-gray-300 hover:text-primary-400 hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {/* User Status */}
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="text-gray-300">{user.email}</div>
                  <div className={`text-xs ${
                    user.telegram_verified ? 'text-secondary-400' : 'text-yellow-400'
                  }`}>
                    {user.telegram_verified ? '✓ Telegram Connected' : '⚠ Telegram Not Connected'}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-gray-300 focus:outline-none focus:text-gray-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          {/* Auth buttons for non-logged-in users */}
          {!user && (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = router.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all duration-200
                      ${isActive 
                        ? 'text-primary-400 bg-primary-900/20' 
                        : 'text-gray-300 hover:text-primary-400 hover:bg-gray-800'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-gray-800 pt-4">
                <div className="px-3 mb-2">
                  <div className="text-sm text-gray-300">{user.email}</div>
                  <div className={`text-xs ${
                    user.telegram_verified ? 'text-secondary-400' : 'text-yellow-400'
                  }`}>
                    {user.telegram_verified ? '✓ Telegram Connected' : '⚠ Telegram Not Connected'}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 w-full text-left text-red-400 hover:bg-red-900/20 rounded-md transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}