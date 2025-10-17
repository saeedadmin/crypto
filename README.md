# CryptoWatch - Real-time Cryptocurrency Price Alert System

A modern, responsive web application for tracking cryptocurrency prices and receiving real-time alerts via Telegram.

## 🚀 Features

### 📊 Real-time Dashboard
- Track 100+ cryptocurrencies with live price updates
- Real-time market data refresh every 30 seconds
- Responsive design for desktop, tablet, and mobile
- Advanced filtering and sorting options
- Market statistics and analytics

### 🔔 Smart Alert System
- **Price Alerts**: Get notified when prices go above/below target values
- **Percentage Alerts**: Get notified on percentage price changes
- **Telegram Integration**: Instant notifications via Telegram bot
- **Alert Management**: Enable/disable, edit, and delete alerts

### 🔐 Secure Authentication
- User registration and login system
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### 📱 Telegram Bot Integration
- Connect your Telegram account for notifications
- Real-time alert delivery
- Simple setup process
- Bot: @arzworld_bot

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database with real-time features
- **Node Telegram Bot API** - Telegram integration
- **NextAuth.js** - Authentication framework
- **bcrypt** - Password hashing
- **JWT** - Token-based authentication

### External APIs
- **CoinGecko API** - Cryptocurrency market data
- **Telegram Bot API** - Message sending

## 🏗️ Architecture

```
crypto-dashboard/
├── components/           # Reusable React components
│   ├── ui/              # Base UI components
│   ├── Navbar.tsx       # Navigation component
│   └── CoinCard.tsx     # Cryptocurrency card
├── pages/               # Next.js pages and API routes
│   ├── api/             # Backend API endpoints
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Main dashboard
│   ├── alerts/          # Alert management
│   └── profile/         # User profile
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Database functions
│   ├── crypto-api.ts    # CoinGecko API wrapper
│   ├── telegram.ts      # Telegram bot functions
│   ├── auth.ts          # Authentication logic
│   └── alert-monitor.ts # Alert monitoring system
├── styles/              # Global styles
└── database/            # Database schema
```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Telegram Bot Token
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/saeedadmin/crypto.git
   cd crypto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   TELEGRAM_BOT_TOKEN=703178665:AAFTiTkJJqZbXmDI0Jv6Y2wH_uv9Z4l2lKs
   ```

4. **Set up database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Update your Supabase connection details

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically

2. **Environment Variables**
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   TELEGRAM_BOT_TOKEN=703178665:AAFTiTkJJqZbXmDI0Jv6Y2wH_uv9Z4l2lKs
   ```

3. **Set up Telegram Webhook**
   ```bash
   curl -X POST "https://api.telegram.org/bot703178665:AAFTiTkJJqZbXmDI0Jv6Y2wH_uv9Z4l2lKs/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://your-domain.vercel.app/api/telegram/webhook"}'
   ```

### Database Setup

1. **Create Supabase Tables**
   Run the SQL schema from `database/schema.sql` in your Supabase SQL editor.

2. **Configure Row Level Security**
   The schema includes RLS policies for secure data access.

## 🔧 Configuration

### Telegram Bot Setup
1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token
4. Update the token in environment variables

### CoinGecko API
- Free tier: 30-50 requests/minute
- No API key required for basic usage
- Upgrade for higher limits if needed

## 📱 Usage

### Getting Started
1. **Register** for a new account
2. **Connect Telegram** in your profile
3. **Browse** the dashboard to see live prices
4. **Create alerts** by clicking on any cryptocurrency
5. **Receive notifications** via Telegram when alerts trigger

### Alert Types
- **Price Alert**: Notify when price goes above/below a target
- **Percentage Alert**: Notify on price change percentage

### Telegram Integration
1. Start @arzworld_bot
2. Get your Telegram ID from the bot
3. Enter it in your profile settings
4. Start receiving alerts!

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Cryptocurrency Data
- `GET /api/crypto/coins` - Get cryptocurrency list

### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts` - Update alert
- `DELETE /api/alerts` - Delete alert

### User Management
- `POST /api/user/telegram` - Connect Telegram account

### Telegram
- `POST /api/telegram/webhook` - Telegram webhook endpoint

## 🔍 Monitoring

### Alert System
- Automatic price monitoring every 60 seconds
- Real-time alert triggering
- Telegram notification delivery
- Alert status tracking

### Performance
- Server-side rendering for SEO
- Optimized images and assets
- CDN delivery via Vercel
- Real-time updates without page refresh

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for cryptocurrency data
- [Telegram](https://telegram.org) for bot platform
- [Supabase](https://supabase.com) for database and real-time features
- [Vercel](https://vercel.com) for hosting and deployment
- [Next.js](https://nextjs.org) for the amazing framework

## 📞 Support

For support, email support@cryptowatch.com or join our Telegram channel.

---

**Built with ❤️ by MiniMax Agent**