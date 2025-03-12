
import React from 'react';
import { cn } from '@/lib/utils';
import WaterJar from './WaterJar';

interface LogoProps {
  className?: string;
  textOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, textOnly = false }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {!textOnly && (
        <WaterJar size="sm" filled={80} className="animate-float" />
      )}
      <span className="font-bold text-xl tracking-tight">
        <span className="text-aqua-600">Aqua</span>
        <span className="text-aqua-800">Jar</span>
      </span>
    </div>
  );
};

export default Logo;
