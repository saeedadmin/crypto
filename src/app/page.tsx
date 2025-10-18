import CryptoPrices from '@/components/CryptoPrices';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">🤖 ربات ارز دیجیتال</h1>
          <p className="text-blue-100 text-lg">
            مشاهده قیمت‌های آنلاین ارزهای دیجیتال
          </p>
        </div>
      </div>

      {/* Crypto Prices Section */}
      <div className="py-8">
        <CryptoPrices />
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>© 2025 ربات ارز دیجیتال - تمامی حقوق محفوظ است</p>
          <p className="text-gray-400 text-sm mt-2">
            قیمت‌ها از CoinGecko API دریافت می‌شوند
          </p>
        </div>
      </footer>
    </main>
  );
}
