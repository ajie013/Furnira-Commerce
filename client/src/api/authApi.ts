import axiosInstance from "@/lib/axios";
import type { SignInFormData } from "@/types/auth";
import toast from "react-hot-toast";

const checkAdminAuthApi = async () =>{
    const res = await axiosInstance.get('/auth/check-admin');

    return res.data;
}

const signInApi = async (form: SignInFormData) =>{
    try {
        const res = await axiosInstance.post('/auth/sign-in', form);
        toast.success("Logged in successfully");
        
        return res.data;
    } catch (error: any) {
        toast.error(error.response.data.message);
        console.log(error)
    }
   
}

export { checkAdminAuthApi, signInApi}