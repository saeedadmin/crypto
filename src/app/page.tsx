import CryptoPrices from '@/components/CryptoPrices';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <a href="/" className="nav-brand">
              🤖 CryptoBot
            </a>
            <ul className="nav-links">
              <li><a href="/" className="nav-link">خانه</a></li>
              <li><a href="#prices" className="nav-link">قیمت‌ها</a></li>
              <li><a href="#about" className="nav-link">درباره ما</a></li>
              <li><a href="#contact" className="nav-link">تماس</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>🤖 ربات ارز دیجیتال</h1>
            <p>
              دنبال کردن قیمت‌های آنلاین ارزهای دیجیتال با بهترین نرخ‌ها و تحلیل‌های زنده
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section id="prices">
        <CryptoPrices />
      </section>

      {/* About Section */}
      <section id="about" className="py-8">
        <div className="container max-w-7xl mx-auto text-center">
          <div className="stats-section">
            <h2 className="stats-title">چرا CryptoBot؟</h2>
            <div className="crypto-grid">
              <div className="crypto-card">
                <div className="crypto-icon">⚡</div>
                <h3 className="mt-4 font-bold text-xl">سرعت بالا</h3>
                <p className="text-gray-400 mt-2">
                  قیمت‌ها هر 30 ثانیه بروزرسانی می‌شوند تا همیشه آخرین اطلاعات را داشته باشید
                </p>
              </div>
              <div className="crypto-card">
                <div className="crypto-icon">🔒</div>
                <h3 className="mt-4 font-bold text-xl">امنیت کامل</h3>
                <p className="text-gray-400 mt-2">
                  از منابع معتبر و امن برای دریافت اطلاعات قیمت‌ها استفاده می‌کنیم
                </p>
              </div>
              <div className="crypto-card">
                <div className="crypto-icon">📊</div>
                <h3 className="mt-4 font-bold text-xl">تحلیل دقیق</h3>
                <p className="text-gray-400 mt-2">
                  تغییرات قیمت 24 ساعته و آمارهای کاملی از بازار ارزهای دیجیتال
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🤖 CryptoBot</h3>
              <p>
                بهترین پلتفرم برای دنبال کردن قیمت‌های ارزهای دیجیتال. 
                اطلاعات دقیق، بروزرسانی‌های لحظه‌ای و طراحی مدرن.
              </p>
            </div>
            <div className="footer-section">
              <h3>خدمات</h3>
              <p><a href="#prices">قیمت‌های لحظه‌ای</a></p>
              <p><a href="#analysis">تحلیل بازار</a></p>
              <p><a href="#alerts">هشدارهای قیمتی</a></p>
              <p><a href="#api">API دسترسی</a></p>
            </div>
            <div className="footer-section">
              <h3>پشتیبانی</h3>
              <p><a href="#help">راهنما</a></p>
              <p><a href="#faq">سوالات متداول</a></p>
              <p><a href="#contact">تماس با ما</a></p>
              <p><a href="#support">پشتیبانی فنی</a></p>
            </div>
            <div className="footer-section">
              <h3>ارتباط با ما</h3>
              <p>📧 info@cryptobot.ir</p>
              <p>📱 تلگرام: @CryptoBotIR</p>
              <p>🌐 وبسایت: cryptobot.ir</p>
              <p>📍 تهران، ایران</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 CryptoBot. تمامی حقوق محفوظ است.</p>
            <p>
              قیمت‌ها از 
              <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mx-1">
                CoinGecko API
              </a>
              دریافت می‌شوند
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
