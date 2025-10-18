import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
  helperText?: string
}

const MotionInput = motion.input

export const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, icon: Icon, helperText, className = '', ...props },
  ref
) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <MotionInput
          ref={ref}
          className={`
            w-full px-4 py-3 bg-gray-800 border rounded-lg transition-all duration-200 text-gray-100 placeholder-gray-400
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-primary-500 focus:ring-primary-500'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            ${className}
          `}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'