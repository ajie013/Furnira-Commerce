import { getOrderHistory } from '@/api/orderApi';
import { Button } from '@/components/ui/button';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import type { Product } from '@/types/product';
import formatCurrency from '@/utils/currencyConverter';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';

const OrderHistory = () => {
  const { userCustomer } = userCustomerAuthStore();

  const { data: orderList, isLoading } = useQuery({
    queryKey: ['order-history', userCustomer.userId],
    queryFn: () => getOrderHistory(userCustomer.userId),
    enabled: !!userCustomer?.userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Order History</h1>

      {orderList?.length === 0 ? (
        <div className="text-center text-gray-500">You have no orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orderList.map((order: OrderDetails, index: number) => (
            <OrderCard key={index} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

interface OrderItem {
  quantity: number;
  product: Product;
  price: number;
}

interface OrderDetails {
  totalAmount: number;
  status: string;
  orderItems: OrderItem[];
}

interface OrderCardProps {
  order: OrderDetails;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-700 text-sm">Status: <span className="font-medium">{order.status}</span></p>
          <p className="text-gray-700 text-sm">
            Total: <span className="font-semibold">{formatCurrency(Number(order.totalAmount))}</span>
          </p>
        </div>
        <Button className='bg-[#FF9900] text-white' variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide Items' : 'View Items'}
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t pt-4 space-y-4">
          
          {order.orderItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-md shadow-sm">
              
              <img
                src={item.product.image || 'https://via.placeholder.com/100'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{item.product.name}</p>
                <p className="text-gray-600 text-sm">Price: {formatCurrency(Number(item.price))}</p>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
