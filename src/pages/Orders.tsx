
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Filter, Calendar, Search } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock orders data (in a real app, this would come from an API)
const mockOrders = [
  {
    id: '1',
    customerId: '1',
    distributorId: '2',
    workerId: '3',
    quantity: 5,
    status: 'delivered',
    createdAt: '2023-05-10T10:30:00Z',
    scheduledDelivery: '2023-05-11T14:00:00Z',
    deliveredAt: '2023-05-11T13:45:00Z',
    notes: 'Leave at the front door'
  },
  {
    id: '2',
    customerId: '1',
    distributorId: '2',
    workerId: '3',
    quantity: 3,
    status: 'in-transit',
    createdAt: '2023-05-15T09:00:00Z',
    scheduledDelivery: '2023-05-16T11:00:00Z',
    notes: 'Call before delivery'
  },
  {
    id: '3',
    customerId: '1',
    distributorId: '2',
    quantity: 2,
    status: 'pending',
    createdAt: '2023-05-18T16:45:00Z',
    scheduledDelivery: '2023-05-20T13:00:00Z',
    notes: ''
  },
  {
    id: '4',
    customerId: '1',
    distributorId: '2',
    workerId: '3',
    quantity: 4,
    status: 'assigned',
    createdAt: '2023-05-19T11:15:00Z',
    scheduledDelivery: '2023-05-21T10:00:00Z',
    notes: 'Leave with the receptionist'
  }
];

const Orders = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter orders based on search term and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your orders</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-aqua-600" />
              My Orders
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="bg-gradient-to-r from-aqua-50 to-aqua-100 pb-4">
              <CardTitle className="text-lg text-aqua-800">Order History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Order Date
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Delivery Date
                          </div>
                        </TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.quantity} jars</TableCell>
                          <TableCell>
                            <StatusBadge status={order.status as any} />
                          </TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{order.scheduledDelivery ? formatDate(order.scheduledDelivery) : 'Not scheduled'}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {order.notes || 'No notes'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Package className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try changing your search or filter criteria'
                      : "You haven't placed any orders yet"}
                  </p>
                  {(searchTerm || statusFilter !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </>
  );
};

export default Orders;
