
import React from 'react';
import { cn } from '@/lib/utils';

interface WaterJarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  filled?: number; // 0-100
  animated?: boolean;
}

const WaterJar: React.FC<WaterJarProps> = ({ 
  className, 
  size = 'md', 
  filled = 100,
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-12 h-20',
    md: 'w-16 h-28',
    lg: 'w-20 h-36'
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-b-2xl rounded-t-lg border-2 border-aqua-400/60 bg-white/10 backdrop-blur-sm">
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-aqua-300 to-aqua-100 rounded-b-2xl transition-all duration-1000",
            animated && "animate-float"
          )}
          style={{ height: `${Math.min(Math.max(filled, 0), 100)}%` }}
        >
          <div className="absolute inset-0 opacity-20 bg-water-gradient bg-[length:200%_200%] animate-water-flow" />
        </div>
        {/* Jar neck */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-3 bg-aqua-100/50 rounded-t-lg border-2 border-aqua-400/60 border-b-0" />
      </div>
    </div>
  );
};

export default WaterJar;
