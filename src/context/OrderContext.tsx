
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Mock initial orders
const initialOrders: Order[] = [
  {
    id: 'order1',
    customerId: '1',
    distributorId: '2',
    quantity: 2,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    scheduledDelivery: new Date(Date.now() + 3600000 * 24).toISOString()
  },
  {
    id: 'order2',
    customerId: '1',
    distributorId: '2',
    workerId: '3',
    quantity: 1,
    status: 'in-transit',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    scheduledDelivery: new Date(Date.now() + 3600000 * 2).toISOString()
  },
  {
    id: 'order3',
    customerId: '1',
    distributorId: '2',
    workerId: '3',
    quantity: 3,
    status: 'delivered',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    scheduledDelivery: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    deliveredAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  }
];

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  createOrder: (newOrder: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], workerId?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulate fetching orders from API
    setTimeout(() => {
      setOrders(initialOrders);
    }, 500);
  }, []);

  useEffect(() => {
    if (user && orders.length) {
      // Filter orders based on user role
      if (user.role === 'customer') {
        setUserOrders(orders.filter(o => o.customerId === user.id));
      } else if (user.role === 'distributor') {
        setUserOrders(orders.filter(o => o.distributorId === user.id));
      } else if (user.role === 'worker') {
        setUserOrders(orders.filter(o => o.workerId === user.id));
      }
    } else {
      setUserOrders([]);
    }
  }, [user, orders]);

  const createOrder = (newOrder: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const order: Order = {
      ...newOrder,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setOrders(prev => [order, ...prev]);
    toast.success('Order created successfully!');
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], workerId?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status,
          ...(workerId && { workerId }),
          ...(status === 'delivered' && { deliveredAt: new Date().toISOString() })
        };
        return updatedOrder;
      }
      return order;
    }));
    
    toast.success(`Order status updated to ${status}`);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, userOrders, createOrder, updateOrderStatus, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
