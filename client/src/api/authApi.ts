import axiosInstance from "@/lib/axios";
import type { SignInFormData } from "@/types/auth";
import toast from "react-hot-toast";

const checkAdminAuthApi = async () =>{
    const res = await axiosInstance.get('/auth/check-admin');

    return res.data;
}

const checkCustomerAuthApi = async () =>{
    const res = await axiosInstance.get('/auth/check-customer');

    return res.data;
}

const signInApi = async (form: SignInFormData) =>{

     const res = await axiosInstance.post('/auth/sign-in', form);
     return res.data
}

const signOutApi = async (role: string) =>{
    const res = await axiosInstance.post('/auth/sign-out', {role});
    return res.data
}



export { checkAdminAuthApi, signInApi, checkCustomerAuthApi, signOutApi}