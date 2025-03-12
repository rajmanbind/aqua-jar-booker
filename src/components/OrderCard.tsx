
import React from 'react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import WaterJar from './WaterJar';

interface OrderCardProps {
  order: Order;
  className?: string;
  onClick?: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, className, onClick }) => {
  return (
    <div 
      className={cn(
        'relative bg-card rounded-xl overflow-hidden border p-4 shadow-sm transition-all hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={() => onClick && onClick(order)}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <WaterJar size="sm" filled={75} />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium">Order #{order.id.substring(order.id.length - 5)}</h3>
            <StatusBadge status={order.status} />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div>Quantity: {order.quantity} jar{order.quantity > 1 ? 's' : ''}</div>
            <div>Created: {format(new Date(order.createdAt), 'PPP')}</div>
            {order.scheduledDelivery && (
              <div>Delivery: {format(new Date(order.scheduledDelivery), 'PPP')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
