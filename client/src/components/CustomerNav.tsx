import React, { useState, useRef, useEffect, use } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import { useMutation } from '@tanstack/react-query';
import { signOutApi } from '@/api/authApi';
import toast from 'react-hot-toast';

const CustomerNav = () => {

    const { userCustomer, setUserCustomer, checkCustomerAuth } = userCustomerAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { pathname } = location;
    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    const signOutMutation = useMutation({
        mutationFn: async () => {  
            await signOutApi('Customer');
            setUserCustomer(null);
        },
        onSuccess: () => {
            toast.success('Sign-out successful');
          
        },
        onError: (error: any) => {
           
            toast.error(error.response?.data?.message || 'Sign-out failed');
        }
    })

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = () => {
        signOutMutation.mutate();
        setDropdownOpen(false);
    }

    const navItem  =  [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        // { name: 'About', path: '/about' },
        // { name: 'Contact', path: '/contact' }
    ]

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-[#FF9900]">
                    Furnira
                </Link>

                <nav className="hidden md:flex gap-6">
                    {navItem.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={` hover:text-[#FF9900] transition ${pathname === item.path ? 'text-[#FF9900] border-b-2 border-[#FF9900] font-bold ' : 'text-gray-700'}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                {userCustomer ? <div className="flex items-center gap-4 relative justify-center ">
                    <Link to="/cart" className={`text-gray-700 p-2 hover:text-[#FF9900] rounded-full transition ${pathname === "/cart" && "bg-[#FF9900] hover:text-black"}`}>
                        <ShoppingCart className="w-5 h-5 " />
                    </Link>

                    <div className="relative" ref={dropdownRef}>
                        {/* <button
                         
                            className="text-gray-700 hover:text-[#FF9900] transition focus:outline-none"
                        > */}
                            <User className={`text-gray-700 p-2 hover:text-[#FF9900] rounded-full transition ${pathname === "/profile" || pathname === "/order-history" ? "bg-[#FF9900] hover:text-black" : ""} cursor-pointer size-9`}   onClick={toggleDropdown}/>
                        {/* </button> */}

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-[1000 ]">
                                <div className="px-4 py-2 text-sm tracking-wider text-[#FF9900] font-medium">
                                    {`${userCustomer.firstName} ${userCustomer.lastName}` || 'Customer'}
                                </div>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/order-history"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Order History
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div> : <div>
                        <Link to="/sign-in" className='text-gray-700 hover:text-[#FF9900] transition hover:underline'>Sign in</Link>
                    </div>}

                
            </div>
        </header>
    );
};

export default CustomerNav;
