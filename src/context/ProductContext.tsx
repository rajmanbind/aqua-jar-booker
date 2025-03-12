
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

// Mock products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Standard Water Jar (20L)',
    description: 'Pure drinking water in 20-liter jar. Perfect for home use.',
    price: 15.99,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwLDQwIEMxMDAsNDAgODAsMzcgODAsNjAgQzgwLDYwIDgwLDE1MCA4MCwxNTAgQzgwLDE2NSAxMjAsMTY1IDEyMCwxNTAgQzEyMCwxNTAgMTIwLDYwIDEyMCw2MCBDMTIwLDM3IDEwMCw0MCAxMDAsNDAiIGZpbGw9IiNjZGVlZmYiIHN0cm9rZT0iIzM4YmRmOCIgc3Ryb2tlLXdpZHRoPSIzIiAvPjxwYXRoIGQ9Ik05MCw2MCBDOTA7NjAgMTEwLDYwIDExMCw2MCBDMTEwLDYwIDExNSw2NSAxMTUsNzUgQzExNSw4NSA4NSw4NSA4NSw3NSBDODU7NjUgOTAsNjAgOTAsNjAiIGZpbGw9IiMzOGJkZjgiIG9wYWNpdHk9IjAuMyIgLz48L3N2Zz4='
  },
  {
    id: '2',
    name: 'Premium Water Jar (20L)',
    description: 'Enhanced mineral water with balanced pH. Premium quality for health-conscious customers.',
    price: 18.99,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwLDQwIEMxMDAsNDAgODAsMzcgODAsNjAgQzgwLDYwIDgwLDE1MCA4MCwxNTAgQzgwLDE2NSAxMjAsMTY1IDEyMCwxNTAgQzEyMCwxNTAgMTIwLDYwIDEyMCw2MCBDMTIwLDM3IDEwMCw0MCAxMDAsNDAiIGZpbGw9IiNiZGVmZmIiIHN0cm9rZT0iIzBjNGE2ZSIgc3Ryb2tlLXdpZHRoPSIzIiAvPjxwYXRoIGQ9Ik05MCw2MCBDOTA7NjAgMTEwLDYwIDExMCw2MCBDMTEwLDYwIDExNSw2NSAxMTUsNzUgQzExNSw4NSA4NSw4NSA4NSw3NSBDODU7NjUgOTAsNjAgOTAsNjAiIGZpbGw9IiMwZWE1ZTkiIG9wYWNpdHk9IjAuNCIgLz48cGF0aCBkPSJNODUsMTAwIEM4NSwxMDAgMTE1LDEwMCAxMTUsMTAwIEMxMTUsMTAwIDExMCwxMTAgMTA1LDExMiBDMTAwLDExNCA5NSwxMTQgOTAsMTEyIEM4NSwxMTAgODUsMTAwIDg1LDEwMCIgZmlsbD0iIzBlYTVlOSIgb3BhY2l0eT0iMC4yIiAvPjwvc3ZnPg=='
  },
  {
    id: '3',
    name: 'Small Water Jar (10L)',
    description: 'Compact 10-liter jar, perfect for small households or office use.',
    price: 9.99,
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwLDYwIEMxMDAsNjAgODUsNTggODUsNzUgQzg1LDc1IDg1LDE1MCA4NSwxNTAgQzg1LDE2MCAxMTUsMTYwIDExNSwxNTAgQzExNSwxNTAgMTE1LDc1IDExNSw3NSBDMTE1LDU4IDEwMCw2MCAxMDAsNjAiIGZpbGw9IiNkZWY3ZmYiIHN0cm9rZT0iIzM4YmRmOCIgc3Ryb2tlLXdpZHRoPSIzIiAvPjxwYXRoIGQ9Ik05MCw4MCBDOTA7ODAgMTEwLDgwIDExMCw4MCBDMTEwLDgwIDExMiw4NSAxMTIsOTAgQzExMiw5NSA4OCw5NSA4OCw5MCBDODU7ODUgOTAsODAgOTAsODAiIGZpbGw9IiMzOGJkZjgiIG9wYWNpdHk9IjAuMyIgLz48L3N2Zz4='
  }
];

interface ProductContextType {
  products: Product[];
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductContext.Provider value={{ products, loading, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
