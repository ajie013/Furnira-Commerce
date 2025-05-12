import CustomerNav from '@/components/CustomerNav';
import userCustomerAuthStore from '@/store/useCustomerAuthStore'
import { Loader } from 'lucide-react';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {

    const {checkCustomerAuth, isLoading} = userCustomerAuthStore();

      useEffect(() => {
      checkCustomerAuth();
      }, []);
    
    if (isLoading) {
      return <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin size-10"/>
      </div>; 
    }
  return (
     <div className="w-full min-h-screen bg-[#F5F5F5] text-[#333]">
            <CustomerNav />
            <div className="pt-[10px] w-full min-h-screen flex justify-center items-center px-4 ">
                <Outlet />
            </div>
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Furnira. All rights reserved.</p>
                </div>
            </footer>
    </div>
  )
}

export default MainLayout