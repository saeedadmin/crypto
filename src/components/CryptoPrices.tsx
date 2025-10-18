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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">در حال بارگذاری قیمت‌ها...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchCryptoData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold text-center">قیمت ارزهای دیجیتال</h2>
          <p className="text-center text-blue-100 mt-2">
            آخرین آپدیت: {lastUpdate}
          </p>
        </div>
        
        <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{crypto.name}</h3>
                  <p className="text-gray-500 text-sm">{crypto.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${crypto.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: crypto.price > 1 ? 2 : 6
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">تغییر 24 ساعته:</span>
                <span
                  className={`font-semibold text-sm px-2 py-1 rounded ${
                    crypto.change24h >= 0
                      ? 'text-green-700 bg-green-100'
                      : 'text-red-700 bg-red-100'
                  }`}
                >
                  {crypto.change24h >= 0 ? '+' : ''}
                  {crypto.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 text-center">
          <button
            onClick={fetchCryptoData}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            🔄 بروزرسانی قیمت‌ها
          </button>
        </div>
      </div>
    </div>
  );
}