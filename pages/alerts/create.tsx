import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ArrowLeft, Bell, DollarSign, Percent, TrendingUp, TrendingDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthUser } from '@/lib/auth'

interface AlertForm {
  coin_id: string
  coin_name: string
  coin_symbol: string
  alert_type: 'price' | 'percentage'
  target_price?: number
  percentage_change?: number
  comparison: 'above' | 'below' | 'increase' | 'decrease'
}

export default function CreateAlertPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const router = useRouter()
  const { coin, name, symbol } = router.query

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors } = useForm<AlertForm>({
    defaultValues: {
      coin_id: coin as string || '',
      coin_name: name as string || '',
      coin_symbol: symbol as string || '',
      alert_type: 'price',
      comparison: 'above'
    }
  })

  const alertType = watch('alert_type')
  const comparison = watch('comparison')

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userData = {
        id: payload.id,
        email: payload.email,
        telegram_id: payload.telegram_id,
        telegram_verified: payload.telegram_verified
      }
      setUser(userData)
      
      // Check if Telegram is connected
      if (!userData.telegram_verified) {
        alert('Please connect your Telegram account first to receive alerts.')
        router.push('/profile')
      }
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('auth-token')
      router.push('/auth/login')
    }
  }, [])

  useEffect(() => {
    if (coin && name && symbol) {
      setValue('coin_id', coin as string)
      setValue('coin_name', name as string)
      setValue('coin_symbol', symbol as string)
      
      // Fetch current price
      fetchCurrentPrice(coin as string)
    }
  }, [coin, name, symbol, setValue])

  useEffect(() => {
    // Update comparison options based on alert type
    if (alertType === 'price') {
      setValue('comparison', 'above')
    } else {
      setValue('comparison', 'increase')
    }
  }, [alertType, setValue])

  const fetchCurrentPrice = async (coinId: string) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
      const data = await response.json()
      
      if (data[coinId]) {
        setCurrentPrice(data[coinId].usd)
      }
    } catch (error) {
      console.error('Error fetching current price:', error)
    }
  }

  const onSubmit = async (data: AlertForm) => {
    if (!user?.telegram_verified) {
      setError('Please connect your Telegram account first.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create alert')
      }
      
      router.push('/alerts')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div 
          className="mb-8"}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Create Price Alert
          </h1>
          <p className="text-gray-400">
            Set up alerts to get notified when price conditions are met
          </p>
        </div>

        {/* Current Price Info */}
        {coin && currentPrice && (
          <div 
            className="mb-6"}
          >
            <Card className="bg-primary-900/20 border-primary-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {name} ({symbol?.toString().toUpperCase()})
                  </h3>
                  <p className="text-gray-400">Current Price</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-400">
                    ${currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: currentPrice >= 1 ? 2 : 6,
                      maximumFractionDigits: currentPrice >= 1 ? 2 : 6
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Alert Form */}
        <div
        >
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div
                  className="bg-red-900/20 border border-red-500/50 rounded-lg p-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Coin Selection */}
              <div className="space-y-4">
                <Input
                  label="Cryptocurrency"
                  placeholder="Search and select a cryptocurrency"
                  value={`${watch('coin_name')} (${watch('coin_symbol')?.toUpperCase()})`}
                  readOnly
                  className="bg-gray-700 cursor-not-allowed"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Select Different Cryptocurrency
                </Button>
              </div>

              {/* Alert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Alert Type
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`
                    relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${alertType === 'price' 
                      ? 'border-primary-500 bg-primary-900/20' 
                      : 'border-gray-700 hover:border-gray-600'
                    }
                  `}>
                    <input
                      type="radio"
                      value="price"
                      {...register('alert_type')}
                      className="sr-only"
                    />
                    <DollarSign className={`h-6 w-6 ${
                      alertType === 'price' ? 'text-primary-400' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-white">Price Alert</div>
                      <div className="text-sm text-gray-400">Absolute price threshold</div>
                    </div>
                  </label>
                  
                  <label className={`
                    relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${alertType === 'percentage' 
                      ? 'border-primary-500 bg-primary-900/20' 
                      : 'border-gray-700 hover:border-gray-600'
                    }
                  `}>
                    <input
                      type="radio"
                      value="percentage"
                      {...register('alert_type')}
                      className="sr-only"
                    />
                    <Percent className={`h-6 w-6 ${
                      alertType === 'percentage' ? 'text-primary-400' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-white">Change Alert</div>
                      <div className="text-sm text-gray-400">Percentage change</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Condition
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  {alertType === 'price' ? (
                    <>
                      <label className={`
                        relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${comparison === 'above' 
                          ? 'border-secondary-500 bg-secondary-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                        }
                      `}>
                        <input
                          type="radio"
                          value="above"
                          {...register('comparison')}
                          className="sr-only"
                        />
                        <TrendingUp className={`h-6 w-6 ${
                          comparison === 'above' ? 'text-secondary-400' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-white">Above</div>
                          <div className="text-sm text-gray-400">Price goes above target</div>
                        </div>
                      </label>
                      
                      <label className={`
                        relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${comparison === 'below' 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                        }
                      `}>
                        <input
                          type="radio"
                          value="below"
                          {...register('comparison')}
                          className="sr-only"
                        />
                        <TrendingDown className={`h-6 w-6 ${
                          comparison === 'below' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-white">Below</div>
                          <div className="text-sm text-gray-400">Price drops below target</div>
                        </div>
                      </label>
                    </>
                  ) : (
                    <>
                      <label className={`
                        relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${comparison === 'increase' 
                          ? 'border-secondary-500 bg-secondary-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                        }
                      `}>
                        <input
                          type="radio"
                          value="increase"
                          {...register('comparison')}
                          className="sr-only"
                        />
                        <TrendingUp className={`h-6 w-6 ${
                          comparison === 'increase' ? 'text-secondary-400' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-white">Increase</div>
                          <div className="text-sm text-gray-400">Price increases by %</div>
                        </div>
                      </label>
                      
                      <label className={`
                        relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${comparison === 'decrease' 
                          ? 'border-red-500 bg-red-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                        }
                      `}>
                        <input
                          type="radio"
                          value="decrease"
                          {...register('comparison')}
                          className="sr-only"
                        />
                        <TrendingDown className={`h-6 w-6 ${
                          comparison === 'decrease' ? 'text-red-400' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className="font-medium text-white">Decrease</div>
                          <div className="text-sm text-gray-400">Price decreases by %</div>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Target Value */}
              {alertType === 'price' ? (
                <Input
                  label="Target Price (USD)"
                  type="number"
                  step="0.000001"
                  min="0"
                  placeholder="Enter target price"
                  icon={DollarSign}
                  {...register('target_price', {
                    required: 'Target price is required',
                    min: { value: 0.000001, message: 'Price must be greater than 0' }
                  })}
                  error={errors.target_price?.message}
                  helperText={currentPrice ? `Current: $${currentPrice.toLocaleString()}` : ''}
                />
              ) : (
                <Input
                  label="Percentage Change (%)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000"
                  placeholder="Enter percentage"
                  icon={Percent}
                  {...register('percentage_change', {
                    required: 'Percentage change is required',
                    min: { value: 0.01, message: 'Percentage must be at least 0.01%' },
                    max: { value: 1000, message: 'Percentage must be less than 1000%' }
                  })}
                  error={errors.percentage_change?.message}
                  helperText="Enter positive value (e.g., 10 for 10%)"
                />
              )}

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                  icon={Bell}
                >
                  {loading ? 'Creating Alert...' : 'Create Alert'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}