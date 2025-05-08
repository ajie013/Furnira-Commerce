import { checkAdminAuthApi } from '@/api/authApi';
import {create} from 'zustand'

interface AdminStoreType{
    userAdmin: any | null
    isLoading: boolean;
    isSigningIn: boolean
    setUserAdmin: (user: any) => void
    checkAdminAuth: () => Promise<void>;
}

const useAdminAuthStore = create<AdminStoreType>((set, get) =>({

    userAdmin: null,
    isSigningIn: false,
    isLoading: true,
    setUserAdmin: (user: any) => set({ userAdmin: user }),
  
    checkAdminAuth: async () => {
        try {
          const admin = await checkAdminAuthApi();
          set({ userAdmin: admin, isLoading: false });
        } catch (error) {
          set({ userAdmin: null, isLoading: false });
          console.log(error);
        }
      }
}));

export default useAdminAuthStore