import axiosInstance from "@/lib/axios";
import type { AddProductFormData, Product } from "@/types/product";

const getAllProducts = async () : Promise<Product[]> => {
    const productList = await axiosInstance.get('/product/product-list');

    return productList.data;
};

const getProductByIdApi = async (productId: string) => {
    const product = await axiosInstance.get(`/product/${productId}`);
    return product.data;
};

const createProductApi = async (formData: AddProductFormData, image: File | null) => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", String(formData.price ?? ""));
    formDataToSend.append("stock", String(formData.stock ?? ""));
    formDataToSend.append("categoryId", String(formData.categoryId ?? ""));

    if (image) {
        formDataToSend.append("imageUrl", image);
    }

    const res = await axiosInstance.post('/product', formDataToSend, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return res.data;
};

const updateProductApi = async (productId: string, formData: AddProductFormData, image: File | null) => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", String(formData.price ?? ""));
    formDataToSend.append("stock", String(formData.stock ?? ""));
    formDataToSend.append("categoryId", String(formData.categoryId ?? ""));

    if (image) {
        formDataToSend.append("imageUrl", image);
    }

    const res = await axiosInstance.put(`/product/${productId}`, formDataToSend, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return res.data;
};

const deleteProductApi = async (productId: string) => {
    const res = await axiosInstance.delete(`/product/${productId}`);
    return res.data;
};

export {
    getAllProducts,
    createProductApi,
    updateProductApi,
    getProductByIdApi,
    deleteProductApi
};
