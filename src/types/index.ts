
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'distributor' | 'worker';
}

export interface Order {
  id: string;
  customerId: string;
  distributorId: string;
  workerId?: string;
  quantity: number;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'cancelled';
  createdAt: string;
  scheduledDelivery?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}
