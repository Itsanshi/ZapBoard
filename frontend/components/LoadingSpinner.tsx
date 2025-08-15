import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-purple-600',
        sizeClasses[size],
        className
      )} 
    />
  );
}

export function LoadingCard() {
  return (
    <div className="modern-card animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center modern-card p-12 max-w-sm">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">
          Loading...
        </p>
        <p className="text-gray-600 text-sm">Please wait a moment</p>
      </div>
    </div>
  );
}
