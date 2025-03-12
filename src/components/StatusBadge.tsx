
import React from 'react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';

interface StatusBadgeProps {
  status: Order['status'];
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusStyles = {
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'assigned': 'bg-blue-100 text-blue-800 border-blue-200',
    'in-transit': 'bg-purple-100 text-purple-800 border-purple-200',
    'delivered': 'bg-green-100 text-green-800 border-green-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
  };

  const statusText = {
    'pending': 'Pending',
    'assigned': 'Assigned',
    'in-transit': 'In Transit',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
  };

  return (
    <span 
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium rounded-full border',
        statusStyles[status],
        className
      )}
    >
      {statusText[status]}
    </span>
  );
};

export default StatusBadge;
