import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import AdminSignIn from './pages/Admin/SignIn'
import { lazy } from 'react'
import useAdminAuthStore from './store/useAdminAuthStore'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/Customer/HomePage'
import SignIn from './pages/Customer/SignInPage'
import userCustomerAuthStore from './store/useCustomerAuthStore'

//Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/Admin/DashboardPage'));
const AdminProductPage = lazy(() => import('./pages/Admin/Product/ProductPage'));
const AdminCategoryPage = lazy(() => import('./pages/Admin/Category/CategoryPage'));
const AdminUserPage = lazy(() => import('./pages/Admin/User/UserPage'));
const AdminOrderPage = lazy(() => import('./pages/Admin/OrderPage'));

//Customer Pages
const CartPage = lazy(() => import('./pages/Customer/CartPage'));
const ShopPage = lazy(() => import('./pages/Customer/ShopPage'));

const App = () =>{

    const {userAdmin} = useAdminAuthStore();
    const {userCustomer} = userCustomerAuthStore();

    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<MainLayout/>}>
                        <Route index element={<HomePage/>}></Route>
                        <Route path="/shop" element={<ShopPage/>}></Route>
                        <Route path="/cart" element={userCustomer ? <CartPage/> : <Navigate to="/"/> }></Route>  
                       
                    </Route>
                    <Route path="/sign-in" element={ userCustomer ? <Navigate to="/"/> : <SignIn/>}></Route>
                 

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={userAdmin ? <Navigate to="/admin/dashboard" /> : <AdminSignIn />} />
                        <Route path="dashboard" element={userAdmin ? <AdminDashboardPage /> : <Navigate to="/admin" />} />
                        <Route path="product" element={userAdmin ? <AdminProductPage /> : <Navigate to="/admin" />} />
                        <Route path="category" element={userAdmin ? <AdminCategoryPage /> : <Navigate to="/admin" />} />
                        <Route path="user" element={userAdmin ? <AdminUserPage /> : <Navigate to="/admin" />} />
                        <Route path="order" element={userAdmin ? <AdminOrderPage /> : <Navigate to="/admin" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
