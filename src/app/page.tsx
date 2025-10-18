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
              <li><a href="/" className="nav-link">Home</a></li>
              <li><a href="#prices" className="nav-link">Prices</a></li>
              <li><a href="#about" className="nav-link">About</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>🤖 CryptoBot</h1>
            <p>
              Track real-time cryptocurrency prices with the best rates and live analysis
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
            <h2 className="stats-title">Why Choose CryptoBot?</h2>
            <div className="crypto-grid">
              <div className="crypto-card">
                <div className="crypto-icon">⚡</div>
                <h3 className="mt-4 font-bold text-xl">Lightning Fast</h3>
                <p className="text-gray-400 mt-2">
                  Prices update every 30 seconds to ensure you always have the latest information
                </p>
              </div>
              <div className="crypto-card">
                <div className="crypto-icon">🔒</div>
                <h3 className="mt-4 font-bold text-xl">Secure & Reliable</h3>
                <p className="text-gray-400 mt-2">
                  We use trusted and secure sources to fetch all cryptocurrency price data
                </p>
              </div>
              <div className="crypto-card">
                <div className="crypto-icon">📊</div>
                <h3 className="mt-4 font-bold text-xl">Detailed Analysis</h3>
                <p className="text-gray-400 mt-2">
                  Complete 24-hour price changes and comprehensive cryptocurrency market statistics
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
                The best platform for tracking cryptocurrency prices. 
                Accurate data, real-time updates, and modern design.
              </p>
            </div>
            <div className="footer-section">
              <h3>Services</h3>
              <p><a href="#prices">Real-time Prices</a></p>
              <p><a href="#analysis">Market Analysis</a></p>
              <p><a href="#alerts">Price Alerts</a></p>
              <p><a href="#api">API Access</a></p>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <p><a href="#help">Help Center</a></p>
              <p><a href="#faq">FAQ</a></p>
              <p><a href="#contact">Contact Us</a></p>
              <p><a href="#support">Technical Support</a></p>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <p>📧 info@cryptobot.com</p>
              <p>📱 Telegram: @CryptoBotOfficial</p>
              <p>🌐 Website: cryptobot.com</p>
              <p>📍 Global Service</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 CryptoBot. All rights reserved.</p>
            <p>
              Designed by 
              <span className="text-blue-400 mx-1 font-semibold">Saeed Mohammadi</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
