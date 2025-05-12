import { checkAdminAuthApi } from '@/api/authApi';
import {create} from 'zustand'

interface AdminStoreType{
    userAdmin: any | null
    isLoading: boolean;
 
    setUserAdmin: (user: any) => void
    checkAdminAuth: () => Promise<void>;
}

const useAdminAuthStore = create<AdminStoreType>((set, get) =>({

    userAdmin: null,
   
    isLoading: true,
    setUserAdmin: (user: any) => set({ userAdmin: user }),
  
    checkAdminAuth: async () => {
        set({ isLoading: true });
        try {
          const admin = await checkAdminAuthApi();
          set({ userAdmin: admin, isLoading: false });
        } catch (error) {
          set({ userAdmin: null, isLoading: false });
          
        }
      }
}));

export default useAdminAuthStore