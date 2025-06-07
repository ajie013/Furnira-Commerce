import CustomerNav from '@/components/CustomerNav';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import { ArrowUp, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const [showArrowUp, setShowArrowUp] = useState(false);
    const { checkCustomerAuth, isLoading } = userCustomerAuthStore();
   
    useEffect(() => {
        checkCustomerAuth();
    }, []);


    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                setShowArrowUp(true);
            } else {
                setShowArrowUp(false);
            }
        });
    }, []);

    const backtoTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader className="animate-spin size-10" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#F5F5F5] text-[#333]">
            <CustomerNav />
            <div className="pt-[10px] w-full min-h-screen px-4">
                <Outlet />
            </div>
            <footer className="bg-gray-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Furnira. All rights reserved.</p>
                </div>
            </footer>

            {showArrowUp &&  <ArrowUp  onClick={backtoTop}  className='cursor-pointer hover:bg-[#ff9900bc] fixed bg-[#FF9900] size-10 text-black p-2 rounded-full right-2 bottom-2' />}
        </div>
    );
};

export default MainLayout;
