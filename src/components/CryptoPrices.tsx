'use client';

import { useState, useEffect } from 'react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

interface ApiResponse {
  success: boolean;
  data: CryptoData[];
  timestamp: string;
}

export default function CryptoPrices() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crypto');
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        setCryptoData(result.data);
        setLastUpdate(new Date(result.timestamp).toLocaleTimeString('fa-IR'));
        setError(null);
      } else {
        setError('خطا در دریافت اطلاعات');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    // هر 30 ثانیه قیمت‌ها رو آپدیت می‌کنیم
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCryptoIcon = (symbol: string): string => {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'BNB': '🔸',
      'ADA': '🔺',
      'SOL': '◉',
      'DOT': '●',
      'DOGE': '🐕',
      'SHIB': '🐶',
      'LINK': '🔗',
      'MATIC': '🔷',
      'AVAX': '🔺',
      'NEAR': '🌐',
      'ICP': '∞',
      'ATOM': '⚛️',
      'ALGO': '△',
      'XTZ': '🔷',
      'EGLD': '⚡',
      'FTM': '👻',
      'CAKE': '🥞',
      'UNI': '🦄',
    };
    return icons[symbol] || '💎';
  };

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">در حال بارگذاری قیمت‌های ارزهای دیجیتال...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>⚠️ خطا در بارگذاری داده‌ها</h3>
        <p>{error}</p>
        <button onClick={fetchCryptoData} className="error-button">
          🔄 تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="stats-section">
          <h2 className="stats-title">آمار بازار ارزهای دیجیتال</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{cryptoData.length}</span>
              <span className="stat-label">ارزهای نمایش داده شده</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {cryptoData.filter(crypto => crypto.change24h > 0).length}
              </span>
              <span className="stat-label">ارزهای صعودی</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {cryptoData.filter(crypto => crypto.change24h < 0).length}
              </span>
              <span className="stat-label">ارزهای نزولی</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{lastUpdate}</span>
              <span className="stat-label">آخرین بروزرسانی</span>
            </div>
          </div>
        </div>

        {/* Crypto Cards Grid */}
        <div className="crypto-grid">
          {cryptoData.map((crypto, index) => (
            <div
              key={crypto.id}
              className="crypto-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="crypto-card-header">
                <div className="crypto-icon">
                  {getCryptoIcon(crypto.symbol)}
                </div>
                <div className="crypto-info">
                  <h3>{crypto.name}</h3>
                  <p>{crypto.symbol}</p>
                </div>
              </div>
              
              <div className="crypto-price">
                {formatPrice(crypto.price)}
              </div>
              
              <div className={`crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                <span>{crypto.change24h >= 0 ? '📈' : '📉'}</span>
                <span>
                  {crypto.change24h >= 0 ? '+' : ''}
                  {crypto.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Update Button */}
        <div className="text-center">
          <button onClick={fetchCryptoData} className="update-button">
            <span>🔄</span>
            <span>بروزرسانی قیمت‌ها</span>
          </button>
        </div>
      </div>
    </div>
  );
}