import AdminNav from "@/components/AdminNav";
import { Outlet } from "react-router-dom";

const AdminLayout = () =>{
    return(
        <div className="w-full min-h-screen">
            <AdminNav/>
            <Outlet></Outlet>
        </div>
    )
}

export default AdminLayout