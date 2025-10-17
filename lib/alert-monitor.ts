// Alert monitoring system for checking and sending alerts
import { cryptoAPI } from './crypto-api'
import { dbFunctions } from './supabase'
import { telegramService } from './telegram'

interface AlertCheck {
  id: string
  user_id: string
  coin_id: string
  coin_name: string
  coin_symbol: string
  alert_type: 'price' | 'percentage'
  target_price?: number
  percentage_change?: number
  comparison: 'above' | 'below' | 'increase' | 'decrease'
  is_active: boolean
  triggered: boolean
  users: {
    telegram_id: string
    telegram_verified: boolean
  }
}

interface PriceHistory {
  [coinId: string]: {
    current: number
    previous: number
    change: number
    changePercent: number
  }
}

class AlertMonitor {
  private priceHistory: PriceHistory = {}
  private isRunning = false

  async start() {
    if (this.isRunning) {
      console.log('Alert monitor is already running')
      return
    }

    this.isRunning = true
    console.log('Starting alert monitoring system...')
    
    // Run initial check
    await this.checkAlerts()
    
    // Set up interval to check every minute
    setInterval(async () => {
      try {
        await this.checkAlerts()
      } catch (error) {
        console.error('Error in alert monitoring:', error)
      }
    }, 60000) // 60 seconds
  }

  stop() {
    this.isRunning = false
    console.log('Alert monitoring system stopped')
  }

  private async checkAlerts() {
    try {
      console.log('Checking alerts...', new Date().toISOString())
      
      // Get all active alerts
      const alerts = await dbFunctions.getActiveAlerts() as AlertCheck[]
      
      if (alerts.length === 0) {
        console.log('No active alerts to check')
        return
      }
      
      console.log(`Found ${alerts.length} active alerts to check`)
      
      // Get unique coin IDs
      const coinIds = [...new Set(alerts.map(alert => alert.coin_id))]
      
      // Fetch current prices for all coins
      const priceData = await cryptoAPI.getMultipleCoinPrices(coinIds)
      
      // Update price history and check alerts
      for (const alert of alerts) {
        const coinPrice = priceData[alert.coin_id]?.usd
        
        if (!coinPrice) {
          console.warn(`No price data found for ${alert.coin_id}`)
          continue
        }
        
        // Update price history
        const previousPrice = this.priceHistory[alert.coin_id]?.current || coinPrice
        this.priceHistory[alert.coin_id] = {
          current: coinPrice,
          previous: previousPrice,
          change: coinPrice - previousPrice,
          changePercent: previousPrice > 0 ? ((coinPrice - previousPrice) / previousPrice) * 100 : 0
        }
        
        // Check if alert should be triggered
        if (await this.shouldTriggerAlert(alert, coinPrice)) {
          await this.triggerAlert(alert, coinPrice)
        }
      }
      
    } catch (error) {
      console.error('Error checking alerts:', error)
    }
  }

  private async shouldTriggerAlert(alert: AlertCheck, currentPrice: number): Promise<boolean> {
    if (alert.alert_type === 'price') {
      const targetPrice = alert.target_price!
      
      if (alert.comparison === 'above') {
        return currentPrice >= targetPrice
      } else if (alert.comparison === 'below') {
        return currentPrice <= targetPrice
      }
    } else if (alert.alert_type === 'percentage') {
      const priceHistory = this.priceHistory[alert.coin_id]
      
      if (!priceHistory || priceHistory.previous === 0) {
        return false // Need historical data for percentage alerts
      }
      
      const changePercent = Math.abs(priceHistory.changePercent)
      const targetPercent = alert.percentage_change!
      
      if (alert.comparison === 'increase') {
        return priceHistory.changePercent >= targetPercent
      } else if (alert.comparison === 'decrease') {
        return priceHistory.changePercent <= -targetPercent
      }
    }
    
    return false
  }

  private async triggerAlert(alert: AlertCheck, currentPrice: number) {
    try {
      console.log(`Triggering alert for ${alert.coin_name} (${alert.coin_symbol})`, {
        alertId: alert.id,
        currentPrice,
        condition: alert.alert_type === 'price' 
          ? `${alert.comparison} $${alert.target_price}` 
          : `${alert.comparison} ${alert.percentage_change}%`
      })
      
      // Send Telegram notification
      if (alert.users.telegram_id && alert.users.telegram_verified) {
        await telegramService.sendAlertMessage(
          alert.users.telegram_id,
          alert,
          currentPrice
        )
        
        console.log(`Alert sent to Telegram ID: ${alert.users.telegram_id}`)
      } else {
        console.warn(`No verified Telegram ID for user ${alert.user_id}`)
      }
      
      // Mark alert as triggered
      await dbFunctions.updateAlert(alert.id, { 
        triggered: true,
        is_active: false // Disable after triggering
      })
      
      console.log(`Alert ${alert.id} marked as triggered and disabled`)
      
    } catch (error) {
      console.error(`Error triggering alert ${alert.id}:`, error)
    }
  }

  // Method to get current monitoring status
  getStatus() {
    return {
      isRunning: this.isRunning,
      trackedCoins: Object.keys(this.priceHistory).length,
      priceHistory: this.priceHistory
    }
  }

  // Method to manually trigger a check (for testing)
  async manualCheck() {
    console.log('Manual alert check triggered')
    await this.checkAlerts()
  }
}

// Export singleton instance
export const alertMonitor = new AlertMonitor()

// Auto-start in production
if (process.env.NODE_ENV === 'production') {
  alertMonitor.start()
}

export default alertMonitor