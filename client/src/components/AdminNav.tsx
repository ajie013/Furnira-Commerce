import { signOutApi } from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import useAdminAuthStore from "@/store/useAdminAuthStore";

const AdminNav = () => {
    const navigate = useNavigate();
    const {userAdmin, setUserAdmin} = useAdminAuthStore()

    const signOutMutation = useMutation({
        mutationFn: async () => await signOutApi("Admin"),
        onSuccess: () => {

            toast.success("Sign-out successful");
            navigate("/admin");
            setUserAdmin(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Sign-out failed");
        },
    });

    const handleSignOut = () => signOutMutation.mutate();

    return (
        <nav className="w-full shadow bg-[#FF9900] text-white fixed top-0 left-0 z-50 h-[60px] px-6 flex items-center justify-between">
            <div className="text-xl font-semibold tracking-wide flex items-center gap-1">
                🛍️ <span>ShopAdmin</span>
            </div>
            { userAdmin &&    <ul className="flex items-center gap-6 text-sm font-medium">
                {[
                   
                    { label: "Product", to: "/admin/product" },
                    { label: "Category", to: "/admin/category" },
                    { label: "Order", to: "/admin/order" },
                ].map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `transition px-2 py-1 rounded ${
                                    isActive
                                        ? "text-gray-900 font-semibold bg-white"
                                        : "text-white hover:text-gray-900 hover:bg-white/20"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
                <li>
                    <Button
                        onClick={handleSignOut}
                        className="bg-white text-[#FF9900] hover:bg-white/90 transition flex items-center gap-2 font-semibold"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </Button>
                </li>
            </ul>}

         
        </nav>
    );
};

export default AdminNav;
