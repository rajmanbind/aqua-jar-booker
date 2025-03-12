
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import NavBar from '@/components/NavBar';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { toast } from 'sonner';
import WaterJar from '@/components/WaterJar';

const Products = () => {
  const { products, loading } = useProducts();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setScheduledDate('');
    setNotes('');
  };
  
  const handleSubmitOrder = () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    
    if (!scheduledDate) {
      toast.error('Please select a delivery date');
      return;
    }
    
    createOrder({
      customerId: user.id,
      distributorId: '2', // Hard-coded for demo
      quantity,
      scheduledDelivery: new Date(scheduledDate).toISOString(),
      notes
    });
    
    setSelectedProduct(null);
    navigate('/orders');
  };
  
  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        
        <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-aqua-100 text-aqua-800 rounded-full mb-2">Our Products</span>
              <h1 className="text-3xl md:text-4xl font-bold">Premium Water Jars</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our selection of high-quality water jars for delivery to your doorstep.
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <svg className="animate-spin h-12 w-12 text-aqua-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleProductSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        
        {/* Order Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div 
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" 
                aria-hidden="true"
                onClick={closeModal}
              ></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slide-up">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-aqua-100 sm:mx-0 sm:h-20 sm:w-20">
                      <WaterJar size="sm" filled={85} />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Order {selectedProduct.name}
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-4">
                          {selectedProduct.description}
                        </p>
                        
                        <form className="space-y-4">
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <div className="flex rounded-md shadow-sm">
                              <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                className="flex-1 block w-full min-w-0 rounded-none border-gray-300 focus:ring-aqua-500 focus:border-aqua-500 text-center"
                              />
                              <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="delivery-date" className="block text-sm font-medium text-gray-700 mb-1">
                              Delivery Date
                            </label>
                            <input
                              type="date"
                              id="delivery-date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-aqua-500 focus:border-aqua-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                              Delivery Notes (Optional)
                            </label>
                            <textarea
                              id="notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={2}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-aqua-500 focus:border-aqua-500"
                              placeholder="Special instructions for delivery..."
                            ></textarea>
                          </div>
                          
                          <div className="text-lg font-medium">
                            Total: ${(selectedProduct.price * quantity).toFixed(2)}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="water-btn w-full sm:w-auto sm:ml-3"
                    onClick={handleSubmitOrder}
                  >
                    <span className="relative">Place Order</span>
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full sm:mt-0 sm:w-auto px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Products;
