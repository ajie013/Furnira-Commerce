import React from 'react';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <XCircle className="text-red-500" size={80} />
      <h1 className="text-3xl font-bold text-gray-800 mt-4">Payment Cancelled</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        It looks like your payment was not completed. You can return to your cart and try again.
      </p>

      <button
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
        onClick={() => navigate('/cart')}
      >
        Back to Cart
      </button>
    </div>
  );
};

export default PaymentCancel;
