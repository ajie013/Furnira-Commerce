import axiosInstance from "@/lib/axios";
import type { CartItem } from "@/types/cart";


const addCartItemApi = async (userId: string, item: {productId: string, price: number, quantity: number}) =>{
    const res = await axiosInstance.post(`/cart/${userId}`, item);

    return res.data;
}

const getCartApi = async (userId: string) =>{
    const res  = await axiosInstance.get(`/cart/${userId}`);

  
    return res.data
}

const deleteCartItemApi = async (cartItemId: string) =>{
    const res = await axiosInstance.delete(`/cart/${cartItemId}`);

    return res.data
}

export {addCartItemApi, getCartApi, deleteCartItemApi}