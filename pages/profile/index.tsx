import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, MessageCircle, Check, X, Copy, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthUser } from '@/lib/auth'

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [telegramId, setTelegramId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

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
      
      if (userData.telegram_id) {
        setTelegramId(userData.telegram_id)
      } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('auth-token')
      router.push('/auth/login')
    }
  }, [])

  const handleTelegramSetup = async () => {
    if (!telegramId.trim()) {
      setError('Please enter your Telegram ID')
      return
    }

    if (!/^\d+$/.test(telegramId.trim())) {
      setError('Telegram ID should only contain numbers')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/user/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ telegram_id: telegramId.trim() })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to setup Telegram')
      }
      
      // Update user state
      setUser(prev => prev ? {
        ...prev,
        telegram_id: result.user.telegram_id,
        telegram_verified: result.user.telegram_verified
      } : null)
      
      // Update token in localStorage
      const payload = JSON.parse(atob(token!.split('.')[1]))
      payload.telegram_id = result.user.telegram_id
      payload.telegram_verified = result.user.telegram_verified
      
      setSuccess('Telegram account connected successfully! You can now receive price alerts.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyBotLink = () => {
    navigator.clipboard.writeText('https://t.me/arzworld_bot')
  }

  const openBot = () => {
    window.open('https://t.me/arzworld_bot', '_blank')
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account and notification preferences
          </p>
        </div>

        {/* Account Info */}
        <div 
          className="mb-6"}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Email Address</div>
                  <div className="text-white font-medium">{user?.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-400">Telegram Status</div>
                  <div className={`font-medium flex items-center space-x-2 ${
                    user?.telegram_verified ? 'text-secondary-400' : 'text-yellow-400'
                  }`}>
                    {user?.telegram_verified ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Connected (ID: {user.telegram_id})</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span>Not Connected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Telegram Setup */}
        <div 
          className="mb-6"}
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Telegram Integration</span>
            </h2>
            
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border ${
                user?.telegram_verified 
                  ? 'border-secondary-500/50 bg-secondary-900/20' 
                  : 'border-yellow-500/50 bg-yellow-900/20'
              }`}>
                <div className="flex items-start space-x-3">
                  {user?.telegram_verified ? (
                    <Check className="h-5 w-5 text-secondary-400 mt-0.5" />
                  ) : (
                    <MessageCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      user?.telegram_verified ? 'text-secondary-400' : 'text-yellow-400'
                    }`}>
                      {user?.telegram_verified ? 'Telegram Connected' : 'Connect Telegram Account'}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      user?.telegram_verified ? 'text-secondary-300' : 'text-yellow-300'
                    }`}>
                      {user?.telegram_verified 
                        ? 'You will receive price alerts via Telegram bot.' 
                        : 'Connect your Telegram account to receive real-time price alerts.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {!user?.telegram_verified && (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Step 1: Start the Bot</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      First, you need to start our Telegram bot and get your Telegram ID.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={openBot}
                        variant="primary"
                        size="sm"
                        icon={ExternalLink}
                        className="flex-1"
                      >
                        Open @arzworld_bot
                      </Button>
                      
                      <Button
                        onClick={copyBotLink}
                        variant="outline"
                        size="sm"
                        icon={Copy}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Step 2: Get Your Telegram ID</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      After starting the bot, send any message to get your Telegram ID, then enter it below.
                    </p>
                    
                    <div className="space-y-3">
                      {error && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      )}
                      
                      {success && (
                        <div className="bg-secondary-900/20 border border-secondary-500/50 rounded-lg p-3">
                          <p className="text-secondary-400 text-sm">{success}</p>
                        </div>
                      )}
                      
                      <Input
                        label="Your Telegram ID"
                        placeholder="Enter your numeric Telegram ID"
                        value={telegramId}
                        onChange={(e) => setTelegramId(e.target.value)}
                        helperText="This is a numeric ID you'll get from the bot (e.g., 123456789)"
                      />
                      
                      <Button
                        onClick={handleTelegramSetup}
                        loading={loading}
                        className="w-full"
                      >
                        {loading ? 'Connecting...' : 'Connect Telegram'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <div
        >
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">
              How to Find Your Telegram ID
            </h2>
            
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-3">
                <div className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  1
                </div>
                <p>Click the "Open @arzworld_bot" button above or search for @arzworld_bot in Telegram</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  2
                </div>
                <p>Send the /start command to the bot</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  3
                </div>
                <p>The bot will reply with your Telegram ID (a number like 123456789)</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                  4
                </div>
                <p>Copy that number and paste it in the field above, then click "Connect Telegram"</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}