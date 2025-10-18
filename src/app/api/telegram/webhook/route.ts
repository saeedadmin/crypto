import { NextRequest, NextResponse } from 'next/server'
import { TelegramUpdate, sendTelegramMessage } from '@/lib/telegram'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    console.log('Received update:', JSON.stringify(update, null, 2))

    // Handle incoming message
    if (update.message) {
      await handleMessage(update)
    }

    // Handle callback query (inline keyboard buttons)
    if (update.callback_query) {
      await handleCallbackQuery(update)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleMessage(update: TelegramUpdate) {
  const message = update.message!
  const user = message.from
  const chatId = message.chat.id
  const text = message.text || ''

  // Save or update user in database
  await saveUser(user)

  // Handle different commands
  if (text.startsWith('/start')) {
    await handleStartCommand(chatId, user.first_name)
  } else if (text.startsWith('/help')) {
    await handleHelpCommand(chatId)
  } else if (text.startsWith('/status')) {
    await handleStatusCommand(chatId, user.id)
  } else {
    // Default response for unknown messages
    await sendTelegramMessage(
      chatId,
      'سلام! من ربات کریپتو هستم. برای دیدن راهنما /help را بفرستید.'
    )
  }
}

async function handleCallbackQuery(update: TelegramUpdate) {
  const callbackQuery = update.callback_query!
  const chatId = callbackQuery.message?.chat.id

  if (!chatId) return

  // Handle different callback data
  const data = callbackQuery.data || ''
  
  if (data === 'get_help') {
    await handleHelpCommand(chatId)
  }
}

async function handleStartCommand(chatId: number, firstName: string) {
  const welcomeMessage = `سلام ${firstName}! 👋

به ربات کریپتو خوش آمدید! 🚀

این ربات به شما کمک می‌کند تا:
📈 قیمت ارزهای دیجیتال را رصد کنید
🔔 هشدار قیمتی دریافت کنید
📊 پورتفولیو خود را مدیریت کنید

برای شروع، /help را بفرستید.`

  await sendTelegramMessage(chatId, welcomeMessage)
}

async function handleHelpCommand(chatId: number) {
  const helpMessage = `🤖 راهنمای ربات کریپتو

📝 دستورات در دسترس:
/start - شروع مجدد ربات
/help - نمایش این راهنما
/status - وضعیت حساب شما

🔄 ربات در حال توسعه است و قابلیت‌های جدید به زودی اضافه خواهد شد!

💡 برای پشتیبانی با ادمین تماس بگیرید.`

  await sendTelegramMessage(chatId, helpMessage)
}

async function handleStatusCommand(chatId: number, userId: number) {
  try {
    // Get user info from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const statusMessage = user ? 
      `✅ وضعیت حساب شما:

👤 نام: ${user.first_name}
🆔 آیدی: ${user.telegram_id}
📅 عضویت: ${new Date(user.created_at).toLocaleDateString('fa-IR')}

🚀 ربات آماده دریافت دستورات شماست!` :
      `❌ حساب شما در دیتابیس یافت نشد.
      
لطفاً /start را بفرستید تا حساب شما ایجاد شود.`

    await sendTelegramMessage(chatId, statusMessage)
  } catch (error) {
    console.error('Error getting user status:', error)
    await sendTelegramMessage(
      chatId, 
      '❌ خطا در دریافت وضعیت حساب. لطفاً دوباره تلاش کنید.'
    )
  }
}

async function saveUser(user: any) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'telegram_id',
          ignoreDuplicates: false,
        }
      )

    if (error) {
      console.error('Error saving user:', error)
    } else {
      console.log('User saved successfully:', user.id)
    }
  } catch (error) {
    console.error('Error in saveUser:', error)
  }
}