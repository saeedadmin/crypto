import TelegramBot from 'node-telegram-bot-api'

const token = process.env.TELEGRAM_BOT_TOKEN!
const bot = new TelegramBot(token)

export interface TelegramMessage {
  chatId: string
  text: string
  parseMode?: 'HTML' | 'Markdown'
}

export const telegramService = {
  async sendMessage({ chatId, text, parseMode = 'HTML' }: TelegramMessage) {
    try {
      const result = await bot.sendMessage(chatId, text, {
        parse_mode: parseMode,
        disable_web_page_preview: true
      })
      return result
    } catch (error) {
      console.error('Telegram send message error:', error)
      throw error
    }
  },

  async sendAlertMessage(telegramId: string, alert: any, currentPrice: number) {
    const emoji = alert.alert_type === 'price' ? '💰' : '📊'
    const symbol = alert.coin_symbol.toUpperCase()
    
    let message = `${emoji} <b>Price Alert Triggered!</b>\n\n`
    message += `🪙 <b>Coin:</b> ${alert.coin_name} (${symbol})\n`
    message += `💵 <b>Current Price:</b> $${currentPrice.toLocaleString()}\n`
    
    if (alert.alert_type === 'price') {
      message += `🎯 <b>Target Price:</b> $${alert.target_price?.toLocaleString()}\n`
      message += `📈 <b>Condition:</b> Price ${alert.comparison} $${alert.target_price?.toLocaleString()}\n`
    } else {
      message += `📊 <b>Change:</b> ${alert.percentage_change}%\n`
      message += `📈 <b>Condition:</b> ${alert.comparison} ${Math.abs(alert.percentage_change!)}%\n`
    }
    
    message += `\n⏰ <b>Time:</b> ${new Date().toLocaleString()}\n`
    message += `\n💡 <i>Manage your alerts at CryptoWatch Dashboard</i>`

    return this.sendMessage({
      chatId: telegramId,
      text: message,
      parseMode: 'HTML'
    })
  },

  async sendWelcomeMessage(telegramId: string) {
    const message = `🎉 <b>Welcome to CryptoWatch Bot!</b>\n\n` +
      `✅ Your Telegram account has been successfully connected.\n\n` +
      `📱 You will receive real-time price alerts here when your conditions are met.\n\n` +
      `🔔 Manage your alerts on the CryptoWatch Dashboard.\n\n` +
      `Happy Trading! 🚀`

    return this.sendMessage({
      chatId: telegramId,
      text: message,
      parseMode: 'HTML'
    })
  },

  async verifyBotStarted(telegramId: string): Promise<boolean> {
    try {
      await this.sendMessage({
        chatId: telegramId,
        text: '✅ Bot verification successful!'
      })
      return true
    } catch (error) {
      return false
    }
  }
}

export default bot