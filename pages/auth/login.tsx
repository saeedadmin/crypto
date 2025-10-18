import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Mail, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }
      
      // Store token
      localStorage.setItem('auth-token', result.token)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div 
          className="text-center"}
        >
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <TrendingUp className="h-10 w-10 text-primary-500" />
            <span className="text-2xl font-bold text-gradient">CryptoWatch</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">
            Sign in to your account to continue tracking
          </p>
        </div>

        {/* Login Form */}
        <div
        >
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div
                  className="bg-red-900/20 border border-red-500/50 rounded-lg p-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format'
                  }
                })}
                error={errors.email?.message}
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  error={errors.password?.message}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Footer */}
        <div 
          className="text-center"}
        >
          <p className="text-gray-400">
            Don’t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
          
          <div className="mt-4">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}