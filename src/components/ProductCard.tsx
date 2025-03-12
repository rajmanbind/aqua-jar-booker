
import React from 'react';
import { cn } from '@/lib/utils';
import { Product } from '@/types';
import WaterJar from './WaterJar';

interface ProductCardProps {
  product: Product;
  className?: string;
  onSelect?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, onSelect }) => {
  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm card-hover',
        className
      )}
      onClick={() => onSelect && onSelect(product)}
    >
      <div className="absolute top-0 right-0 p-3">
        <div className="text-sm font-medium text-aqua-600">
          ${product.price.toFixed(2)}
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center h-full">
        <div className="relative w-full flex justify-center py-3 mb-4">
          <WaterJar size="md" filled={85} className="mx-auto" />
        </div>
        
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">{product.description}</p>
        
        <button 
          className="water-btn mt-4 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(product);
          }}
        >
          <span className="relative">Order Now</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
