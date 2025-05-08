import axiosInstance from "@/lib/axios";
import type { AddProductFormData } from "@/types/product";
import toast from "react-hot-toast";

const getAllProducts = async () =>{
    try {
        const productList = await axiosInstance.get('/product/product-list')
       
        return productList.data
    } catch (error) {
        console.log(error)
    }
}

const getProductByIdApi = async (productId: string) =>{
    try {
        const product = await axiosInstance.get(`/product/${productId}`)
       
        return product.data
    } catch (error) {
        console.log(error)
    }
}

const createProductApi = async ( formDa: AddProductFormData, image: File | null) => {
    try {
      const formDataToSend = new FormData();
  
      formDataToSend.append("name", formDa.name);
      formDataToSend.append("price", String(formDa.price ?? ""));
      formDataToSend.append("stock", String(formDa.stock ?? ""));
      formDataToSend.append("categoryId", String(formDa.categoryId ?? ""));
  
      if (image) {
        formDataToSend.append("imageUrl", image);
      }
  
      const res = await axiosInstance.post('/product', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      return res.data;
    } catch (error: any) {
      toast.error("Upload failed:", error.message)
      console.error("Upload failed:", error);
      throw error;
    }
};

const updateProductApi = async (productId: string, formDa: AddProductFormData, image: File | null) => {
    try {
      const formDataToSend = new FormData();
  
      formDataToSend.append("name", formDa.name);
      formDataToSend.append("price", String(formDa.price ?? ""));
      formDataToSend.append("stock", String(formDa.stock ?? ""));
      formDataToSend.append("categoryId", String(formDa.categoryId ?? ""));
  
      if (image) {
        formDataToSend.append("imageUrl", image);
      }
  
      const res = await axiosInstance.put(`/product/${productId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      return res.data;
    } catch (error: any) {
      toast.error("Upload failed:", error.message)
      console.error("Upload failed:", error);
      throw error;
    }
};

const deleteProductApi = async (productId: string) =>{
    try {
        await axiosInstance.delete(`/product/${productId}`);
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
}

export { getAllProducts, createProductApi, updateProductApi, getProductByIdApi, deleteProductApi}