import { checkAdminAuthApi } from "@/api/authApi";
import AdminNav from "@/components/AdminNav";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import { Loader } from "lucide-react";

import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {

    const { checkAdminAuth, isLoading } = useAdminAuthStore();

    useEffect(() => {
      checkAdminAuth();
    }, []);
    
    if (isLoading) {
      return <div className="min-h-screen flex justify-center items-center">
        <Loader className="animate-spin size-10"/>
      </div>; 
    }
    

    return (
        <div className="w-full min-h-screen bg-[#F5F5F5] text-[#333]">
            <AdminNav />
            <div className="pt-[60px] w-full min-h-screen flex justify-center items-center px-4">
                <Outlet />
            </div>
        </div>
    );
};


export default AdminLayout;
