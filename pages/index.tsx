import React from 'react'
import Link from 'next/link'
import { TrendingUp, Bell, Shield, Zap, Users, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/Navbar'

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Tracking',
    description: 'Monitor cryptocurrency prices in real-time with live updates every 30 seconds.'
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Set price and percentage-based alerts and receive instant notifications via Telegram.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. We never store your private information.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with modern technology for ultra-fast performance and smooth user experience.'
  },
  {
    icon: Users,
    title: 'User-Friendly',
    description: 'Intuitive interface designed for both beginners and experienced traders.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive market data, charts, and analytics to make informed decisions.'
  }
]

const stats = [
  { label: 'Cryptocurrencies Tracked', value: '1000+' },
  { label: 'Active Users', value: '10K+' },
  { label: 'Alerts Sent', value: '1M+' },
  { label: 'Uptime', value: '99.9%' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-gradient">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"}}}
            >
              Track Crypto.
              <span className="text-gradient block">Stay Ahead.</span>
            </h1>
            
            <p 
              className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto"}}}
            >
              Monitor cryptocurrency prices in real-time, set intelligent alerts, 
              and never miss important market movements. Get instant notifications 
              directly to your Telegram.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center"}}}
            >
              <Link href="/auth/register">
                <Button size="lg" className="min-w-[200px]">
                  Get Started Free
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"}}}
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"}}}
            >
              Why Choose CryptoWatch?
            </h2>
            
            <p 
              className="text-xl text-gray-400 max-w-3xl mx-auto"}}}
            >
              Discover the features that make CryptoWatch the best choice 
              for cryptocurrency tracking and alerts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              
              return (
                <div
                  key={feature.title}}}}
                >
                  <Card className="h-full hover:border-primary-500/50 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-primary-900/20 rounded-lg">
                        <Icon className="h-6 w-6 text-primary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"}}}
          >
            Ready to Get Started?
          </h2>
          
          <p 
            className="text-xl text-gray-400 mb-10"}}}
          >
            Join thousands of users who trust CryptoWatch for their 
            cryptocurrency tracking needs. Start for free today!
          </p>
          
          <div}}}
          >
            <Link href="/auth/register">
              <Button size="lg" className="min-w-[200px]">
                Start Tracking Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TrendingUp className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-gradient">
                CryptoWatch
              </span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2025 CryptoWatch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}