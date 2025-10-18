import { NextRequest, NextResponse } from 'next/server'
import { getTelegramBotInfo } from '@/lib/telegram'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export async function GET(request: NextRequest) {
  try {
    // Get bot info
    const botInfo = await getTelegramBotInfo()
    
    // Get webhook info
    const webhookResponse = await fetch(`${TELEGRAM_API_URL}/getWebhookInfo`)
    const webhookInfo = await webhookResponse.json()

    return NextResponse.json({
      success: true,
      botInfo: botInfo.result,
      webhookInfo: webhookInfo.result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting bot status:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}