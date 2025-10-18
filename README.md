# Crypto Bot - Next.js + Telegram Bot

یک ربات کریپتو ساده با قابلیت اتصال به تلگرام و Supabase

## 🚀 نصب و راه‌اندازی

### 1. کلون کردن پروژه
```bash
git clone https://github.com/saeedadmin/crypto.git
cd crypto
```

### 2. نصب Dependencies
```bash
npm install
# or
yarn install
```

### 3. تنظیم Environment Variables
فایل `.env.local` را ایجاد کنید و مقادیر زیر را وارد کنید:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### 4. تنظیم دیتابیس Supabase
جداول زیر را در Supabase ایجاد کنید:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  target_price DECIMAL(20,8) NOT NULL,
  condition TEXT CHECK (condition IN ('above', 'below')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_symbol ON alerts(symbol);
```

### 5. اجرای پروژه
```bash
npm run dev
# or
yarn dev
```

پروژه روی `http://localhost:3000` اجرا خواهد شد.

## 📱 راه‌اندازی Telegram Bot

### 1. دسترسی به صفحه Admin
به آدرس `http://localhost:3000/admin` بروید

### 2. تنظیم Webhook
- URL webhook خود را وارد کنید (برای تست محلی از ngrok استفاده کنید)
- روی "Set Webhook" کلیک کنید

### 3. تست ربات
- به ربات تلگرام خود پیام `/start` بفرستید
- ربات باید پاسخ دهد

## 🌐 Deploy به Vercel

### 1. اتصال به GitHub
- پروژه را به GitHub push کنید
- در Vercel یک پروژه جدید از روی repository ایجاد کنید

### 2. تنظیم Environment Variables در Vercel
در تنظیمات پروژه Vercel، متغیرهای محیطی زیر را اضافه کنید:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `TELEGRAM_BOT_TOKEN`

### 3. Deploy
- پس از deploy، URL پروژه در Vercel را کپی کنید
- به `https://your-project.vercel.app/admin` بروید
- URL webhook را به `https://your-project.vercel.app/api/telegram/webhook` تنظیم کنید

## 📚 ساختار پروژه

```
src/
├── app/                    # App Router pages
│   ├── admin/             # صفحه مدیریت ربات
│   ├── layout.tsx         # Layout اصلی
│   └── page.tsx           # صفحه اصلی
├── lib/                   # کتابخانه‌های مشترک
│   ├── supabase.ts        # کلاینت Supabase
│   └── telegram.ts        # توابع Telegram API
└── pages/
    └── api/               # API Routes
        ├── admin/         # API های مدیریت
        └── telegram/      # Webhook تلگرام
```

## 🛠 API Endpoints

- `POST /api/telegram/webhook` - دریافت پیام‌های تلگرام
- `GET /api/admin/status` - وضعیت ربات
- `POST /api/admin/set-webhook` - تنظیم webhook

## 📋 دستورات ربات

- `/start` - شروع ربات
- `/help` - راهنمای استفاده
- `/status` - وضعیت حساب کاربر

## 🔧 مرحله بعدی توسعه

این پروژه یک پایه ساده است که می‌تواند شامل قابلیت‌های زیر شود:

1. **مدیریت قیمت ارزها**
   - اتصال به API های قیمت (CoinGecko, Binance)
   - نمایش قیمت فعلی ارزها

2. **سیستم هشدار**
   - تنظیم هشدار قیمتی
   - ارسال نوتیفیکیشن خودکار

3. **مدیریت پورتفولیو**
   - ثبت معاملات
   - محاسبه سود و زیان

4. **پنل مدیریت پیشرفته**
   - آمار کاربران
   - مدیریت پیام‌های گروهی

## 🆘 عیب‌یابی

### مشکلات رایج:

1. **ربات پاسخ نمی‌دهد**
   - webhook را بررسی کنید
   - لاگ‌های Vercel را چک کنید

2. **خطای دیتابیس**
   - اتصال Supabase را بررسی کنید
   - جداول ایجاد شده باشند

3. **خطای Environment Variables**
   - متغیرها در Vercel تنظیم شده باشند
   - restart deployment کنید

## 📞 پشتیبانی

برای مشکلات و سوالات:
- GitHub Issues استفاده کنید
- مستندات Telegram Bot API را مطالعه کنید