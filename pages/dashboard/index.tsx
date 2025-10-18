import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Search, Filter, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { CoinCard } from '@/components/CoinCard'
import { Card, LoadingSpinner, LoadingSkeleton } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CryptoCoin } from '@/lib/crypto-api'
import { AuthUser } from '@/lib/auth'

interface DashboardProps {
  user: AuthUser | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [coins, setCoins] = useState<CryptoCoin[]>([])
  const [filteredCoins, setFilteredCoins] = useState<CryptoCoin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'market_cap' | 'price' | 'change'>('market_cap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // Verify token and get user info
    // For now, we'll decode the basic info from token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({
        id: payload.id,
        email: payload.email,
        telegram_id: payload.telegram_id,
        telegram_verified: payload.telegram_verified
      })
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('auth-token')
      router.push('/auth/login')
    }
  }, [])

  // Fetch coins data
  useEffect(() => {
    fetchCoins()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchCoins, 30000)
    return () => clearInterval(interval)
  }, [])

  // Filter and sort coins
  useEffect(() => {
    let filtered = coins.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort coins
    filtered.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case 'price':
          aValue = a.current_price
          bValue = b.current_price
          break
        case 'change':
          aValue = a.price_change_percentage_24h
          bValue = b.price_change_percentage_24h
          break
        default:
          aValue = a.market_cap || 0
          bValue = b.market_cap || 0
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })

    setFilteredCoins(filtered)
  }, [coins, searchTerm, sortBy, sortOrder])

  const fetchCoins = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/crypto/coins?limit=100')
      const data = await response.json()
      
      if (response.ok) {
        setCoins(data.coins)
      } else {
        console.error('Failed to fetch coins:', data.error)
      }
    } catch (error) {
      console.error('Error fetching coins:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setUser(null)
    router.push('/auth/login')
  }

  const handleCoinClick = (coin: CryptoCoin) => {
    router.push(`/alerts/create?coin=${coin.id}&name=${coin.name}&symbol=${coin.symbol}`)
  }

  const getMarketStats = () => {
    const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0)
    const gainersCount = coins.filter(coin => coin.price_change_percentage_24h > 0).length
    const losersCount = coins.filter(coin => coin.price_change_percentage_24h < 0).length
    const avgChange = coins.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / coins.length

    return { totalMarketCap, gainersCount, losersCount, avgChange }
  }

  if (loading && coins.length === 0) {
    return (
      <div className="min-h-screen bg-dark-gradient">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}>
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-700 rounded" />
                      <div className="w-16 h-3 bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-20 h-6 bg-gray-700 rounded" />
                    <div className="w-16 h-4 bg-gray-700 rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = getMarketStats()

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div 
          className="mb-8"}}}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Crypto Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Monitor real-time cryptocurrency prices and market movements
          </p>
        </div>

        {/* Market Stats */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"}}}
        >
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                ${(stats.totalMarketCap / 1e12).toFixed(2)}T
              </div>
              <div className="text-gray-400 text-sm">Total Market Cap</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-400">
                {stats.gainersCount}
              </div>
              <div className="text-gray-400 text-sm">Gainers (24h)</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {stats.losersCount}
              </div>
              <div className="text-gray-400 text-sm">Losers (24h)</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                stats.avgChange >= 0 ? 'text-secondary-400' : 'text-red-400'
              }`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
              </div>
              <div className="text-gray-400 text-sm">Avg Change (24h)</div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div 
          className="flex flex-col md:flex-row gap-4 mb-8"}}}
        >
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as any)
                setSortOrder(order as any)
              }}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="market_cap-desc">Market Cap (High to Low)</option>
              <option value="market_cap-asc">Market Cap (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="change-desc">Change (High to Low)</option>
              <option value="change-asc">Change (Low to High)</option>
            </select>
            
            <Button
              onClick={fetchCoins}
              disabled={refreshing}
              variant="outline"
              icon={RefreshCw}
              className={refreshing ? 'animate-spin' : ''}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Coins Grid */}
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}}}
        >
          {filteredCoins.map((coin, index) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              index={index}
              onClick={() => handleCoinClick(coin)}
            />
          ))}
        </div>

        {filteredCoins.length === 0 && !loading && (
          <div 
            className="text-center py-12"}}}
          >
            <p className="text-gray-400 text-lg">
              No cryptocurrencies found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}