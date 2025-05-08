import { NavLink } from "react-router-dom";

const AdminNav = () => {
  return (
      <div className="w-full shadow bg-[#000] p-3 h-[60px] fixed top-0 left-0 flex items-center justify-between text-white z-50">
          <div className="text-lg font-bold tracking-wide">🛍️ ShopAdmin</div>
          
          <ul className="flex gap-2">
            <li>
                <NavLink to="/admin/dashboard">Dashboard</NavLink>
            </li>
            <li>
                <NavLink to="/admin/product">Product</NavLink>
            </li>
            <li>
                <NavLink to="/admin/category">Category</NavLink>
            </li>
            <li>
                <NavLink to="/admin/order">Order</NavLink>
            </li>
            <li>
                <NavLink to="/admin/user">User</NavLink>
            </li>
          </ul>
      </div>
  );
};


export default AdminNav