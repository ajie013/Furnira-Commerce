import axiosInstance from "@/lib/axios";
import type { CartItem } from "@/types/cart";
import axios from "axios";

const addOrderApi = async (userId: string, totalAmount: number, items: CartItem[]) =>{
    const res = await axiosInstance.post(`/cart/${userId}`, {totalAmount: totalAmount, orderItems: items} );
    
    return res.data
}

const getOrderHistory = async (userId: string) =>{
    const res = await axiosInstance.get(`/order/${userId}`);

    return res.data
}

const getAllOrdersApi = async () => {
    const res = await axiosInstance.get('/order');
    console.log(res.data);
    return res.data;
}

const updateOrderStatusApi = async (orderId: string, newStatus: string) => {
    const res = await axiosInstance.put(`/order/${orderId}`, { status: newStatus });
    return res.data;
}

export { addOrderApi, getOrderHistory, getAllOrdersApi, updateOrderStatusApi}