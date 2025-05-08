import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import AdminSignIn from './pages/Admin/SignIn'
import { lazy } from 'react'
import useAdminAuthStore from './store/useAdminAuthStore'

const AdminDashboardPage = lazy(() => import('./pages/Admin/DashboardPage'))
const AdminProductPage = lazy(() => import('./pages/Admin/Product/ProductPage'))
const AdminCategoryPage = lazy(() => import('./pages/Admin/CategoryPage'))
const AdminUserPage = lazy(() => import('./pages/Admin/UserPage'))
const AdminOrderPage = lazy(() => import('./pages/Admin/OrderPage'))

const App = () =>{

    const {userAdmin} = useAdminAuthStore();

    return(
        <>
            <BrowserRouter>
                <Routes>
              
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
