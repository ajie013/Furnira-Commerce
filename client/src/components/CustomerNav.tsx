import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import { useMutation } from '@tanstack/react-query';
import { signOutApi } from '@/api/authApi';
import toast from 'react-hot-toast';

const CustomerNav = () => {
    const { userCustomer, setUserCustomer } = userCustomerAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const navItem = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
    ];

    const signOutMutation = useMutation({
        mutationFn: async () => {
            await signOutApi('Customer');
            setUserCustomer(null);
        },
        onSuccess: () => toast.success('Sign-out successful'),
        onError: (error: any) =>
            toast.error(error.response?.data?.message || 'Sign-out failed'),
    });

    const handleSignOut = () => {
        signOutMutation.mutate();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-[#FF9900]">
                    Furnira
                </Link>

                {/* Mobile menu button */}
                <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-700">
                    <Menu size={28} />
                </button>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-6">
                    {navItem.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`hover:text-[#FF9900] transition ${
                                pathname === item.path
                                    ? 'text-[#FF9900] border-b-2 border-[#FF9900] font-bold'
                                    : 'text-gray-700'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Account + Cart */}
                <div className="hidden md:flex items-center gap-4 relative justify-center">
                    {userCustomer ? (
                        <>
                            <Link to="/cart" className="text-gray-700 p-2 hover:text-[#FF9900] rounded-full">
                                <ShoppingCart className="w-5 h-5" />
                            </Link>
                            <div className="relative" ref={dropdownRef}>
                                <User
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="cursor-pointer text-gray-700 p-2 hover:text-[#FF9900] size-9"
                                />
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-[1000]">
                                        <div className="px-4 py-2 text-sm tracking-wider text-[#FF9900] font-medium">
                                            {`${userCustomer.firstName} ${userCustomer.lastName}`}
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                                        <Link to="/order-history" className="block px-4 py-2 text-sm hover:bg-gray-100">Order History</Link>
                                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/sign-in" className="text-gray-700 hover:text-[#FF9900] transition hover:underline">Sign in</Link>
                    )}
                </div>
            </div>

            {/* Mobile Side Drawer */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow transform transition-transform duration-300 z-50 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    <span className="text-xl font-bold text-[#FF9900]">Menu</span>
                    <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <nav className="flex flex-col gap-4 p-4">
                    {navItem.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`hover:text-[#FF9900] transition ${
                                pathname === item.path ? 'text-[#FF9900] font-semibold' : 'text-gray-700'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {userCustomer ? (
                        <>
                            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className={`${
                                pathname === "/cart" ? 'text-[#FF9900] font-semibold' : 'text-gray-700'
                            }  hover:text-[#FF9900]`}>Cart</Link>
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={`${
                                pathname === "/profile" ? 'text-[#FF9900] font-semibold' : 'text-gray-700'
                            }  hover:text-[#FF9900]`}>Profile</Link>
                            <Link to="/order-history" onClick={() => setMobileMenuOpen(false)} className={`${
                                pathname === "/order-history" ? 'text-[#FF9900] font-semibold' : 'text-gray-700'
                            }  hover:text-[#FF9900]`}>Order History</Link>
                            <button onClick={handleSignOut} className="text-left text-red-600 hover:text-red-700">Logout</button>
                        </>
                    ) : (
                        <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-[#FF9900]">Sign in</Link>
                    )}
                </nav>
            </div>

            {/* Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </header>
    );
};

export default CustomerNav;
