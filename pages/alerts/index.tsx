import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Plus, Bell, BellOff, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'

export default function AlertsPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      router.push('/auth/login')
      return
    }

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

  useEffect(() => {
    if (user) {
      fetchAlerts()
    }
  }, [user])

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/alerts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAlerts(data.alerts)
      } else {
        console.error('Failed to fetch alerts:', data.error)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: alertId, is_active: !isActive })
      })
      
      if (response.ok) {
        fetchAlerts()
      }
    } catch (error) {
      console.error('Error toggling alert:', error)
    }
  }

  const deleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) {
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/alerts?id=${alertId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchAlerts()
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setUser(null)
    router.push('/auth/login')
  }

  const formatAlertCondition = (alert: Alert) => {
    if (alert.alert_type === 'price') {
      return `${alert.comparison === 'above' ? '↑' : '↓'} $${alert.target_price?.toLocaleString()}`
    } else {
      const sign = alert.comparison === 'increase' ? '+' : '-'
      return `${sign}${Math.abs(alert.percentage_change!)}%`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-gradient">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-1/4" />
                  <div className="h-6 bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-700 rounded w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div 
          className="flex justify-between items-center mb-8"}}}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Price Alerts
            </h1>
            <p className="text-gray-400">
              Manage your cryptocurrency price alerts
            </p>
          </div>
          
          <Button
            onClick={() => router.push('/alerts/create')}
            icon={Plus}
            size="lg"
          >
            Create Alert
          </Button>
        </div>

        {/* Telegram Warning */}
        {user && !user.telegram_verified && (
          <div 
            className="mb-6"}}}
          >
            <Card className="border-yellow-500/50 bg-yellow-900/20">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-yellow-400">
                    Telegram Not Connected
                  </h3>
                  <p className="text-yellow-300 text-sm">
                    Connect your Telegram account to receive price alerts.
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/profile')}
                  variant="outline"
                  size="sm"
                >
                  Connect Now
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Alerts List */}
        <div 
          className="space-y-4"}}}
        >
          {alerts.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No Alerts Created
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first price alert to get notified about market movements.
                </p>
                <Button
                  onClick={() => router.push('/alerts/create')}
                  icon={Plus}
                >
                  Create Your First Alert
                </Button>
              </div>
            </Card>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={alert.id}}}}
              >
                <Card className={`${
                  alert.is_active ? 'border-gray-700' : 'border-gray-800 opacity-75'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        alert.is_active ? 'bg-primary-900/20' : 'bg-gray-800'
                      }`}>
                        {alert.is_active ? (
                          <Bell className="h-5 w-5 text-primary-400" />
                        ) : (
                          <BellOff className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {alert.coin_name} ({alert.coin_symbol.toUpperCase()})
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>
                            {alert.alert_type === 'price' ? 'Price Alert' : 'Change Alert'}
                          </span>
                          <span>•</span>
                          <span className="font-medium">
                            {formatAlertCondition(alert)}
                          </span>
                          <span>•</span>
                          <span className={alert.triggered ? 'text-red-400' : 'text-secondary-400'}>
                            {alert.triggered ? 'Triggered' : 'Active'}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(alert.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAlert(alert.id, alert.is_active)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title={alert.is_active ? 'Disable Alert' : 'Enable Alert'}
                      >
                        {alert.is_active ? (
                          <ToggleRight className="h-6 w-6 text-primary-400" />
                        ) : (
                          <ToggleLeft className="h-6 w-6" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}