import { NextRequest, NextResponse } from 'next/server'
import { setTelegramWebhook } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 })
    }

    // Set the webhook
    const result = await setTelegramWebhook(webhookUrl)
    
    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: 'Webhook set successfully',
        webhookUrl,
        result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to set webhook',
        error: result
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error setting webhook:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}