import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick
}) => {
  const baseClasses = 'bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg transition-all duration-300'
  const hoverClasses = hover ? 'hover:shadow-xl hover:border-gray-600 cursor-pointer' : ''
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
    >
      {children}
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary-500 ${sizes[size]} ${className}`} />
  )
}