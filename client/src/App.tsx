import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, useEffect } from 'react';

import AdminLayout from './layout/AdminLayout';
import AdminSignIn from './pages/Admin/SignIn';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/Customer/HomePage';
import SignIn from './pages/Customer/SignInPage';
import ProductItem from './pages/Customer/ProductItem';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/Customer/PaymetSuccess';
import PaymentCancel from './pages/Customer/PaymentCancel';

import useAdminAuthStore from './store/useAdminAuthStore';
import userCustomerAuthStore from './store/useCustomerAuthStore';

// Admin Pages

const AdminProductPage = lazy(() => import('./pages/Admin/Product/ProductPage'));
const AdminCategoryPage = lazy(() => import('./pages/Admin/Category/CategoryPage'));
const AdminOrderPage = lazy(() => import('./pages/Admin/OrderPage'));

// Customer Pages
const CartPage = lazy(() => import('./pages/Customer/CartPage'));
const ShopPage = lazy(() => import('./pages/Customer/ShopPage'));
const ProfilePage = lazy(() => import('./pages/Customer/ProfilePage'));
const OrderHistoryPage = lazy(() => import('./pages/Customer/OrderHistory'));

const App = () => {
    const { userAdmin } = useAdminAuthStore();
    const { userCustomer } = userCustomerAuthStore();

    return (
        <BrowserRouter>
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route
                        path="cart"
                        element={userCustomer ? <CartPage /> : <Navigate to="/" />}
                    />
                    <Route path="product/:id" element={<ProductItem />} />
                    <Route
                        path="profile"
                        element={userCustomer ? <ProfilePage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="order-history"
                        element={userCustomer ? <OrderHistoryPage /> : <Navigate to="/" />}
                    />
                </Route>

                <Route
                    path="/sign-in"
                    element={userCustomer ? <Navigate to="/" /> : <SignIn />}
                />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route
                        index
                        element={userAdmin ? <Navigate to="/admin/product" /> : <AdminSignIn />}
                    />
                  
                    <Route
                        path="product"
                        element={userAdmin ? <AdminProductPage /> : <Navigate to="/admin" />}
                    />
                    <Route
                        path="category"
                        element={userAdmin ? <AdminCategoryPage /> : <Navigate to="/admin" />}
                    />
                    <Route
                        path="order"
                        element={userAdmin ? <AdminOrderPage /> : <Navigate to="/admin" />}
                    />
                </Route>

                {/* Payment */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
