import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'notion'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          {
            'h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-300 focus:ring-2 focus:ring-gray-200': variant === 'default',
            'px-0 py-3 text-gray-900 border-0 border-b border-gray-100 focus:border-gray-300 focus:ring-0 bg-transparent': variant === 'notion',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }