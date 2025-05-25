import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import useCartStore from '@/store/useCartStore';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState('');

  const {shoppingCart} = useCartStore();
  // console.log(shoppingCart)
  useEffect(() => {    
    const saveOrder = async () => {
      const sessionId = new URLSearchParams(window.location.search).get("session_id");

      if (!sessionId) {
        setError("Missing session ID.");
        setIsSaving(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/order/save-order", {
          sessionId,
        });

        if (response.status !== 200) {
          throw new Error(response.data.message || "Failed to save order.");
        }

      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsSaving(false);
      }
    };

     saveOrder();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <CheckCircle2 className="text-green-500" size={80} />
      <h1 className="text-3xl font-bold text-gray-800 mt-4">Payment Successful</h1>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        {isSaving
          ? "Saving your order..."
          : error
          ? `Error: ${error}`
          : "Thank you for your purchase! Your order has been placed successfully."}
      </p>

      <button
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
        onClick={() => navigate('/')}
        
      >
        Back to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
