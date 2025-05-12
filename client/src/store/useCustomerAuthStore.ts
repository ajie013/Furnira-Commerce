
import { checkCustomerAuthApi } from '@/api/authApi'
import { create } from 'zustand'

interface CustomerStoreType {
    userCustomer: any | null
    isLoading: boolean
    isSigningIn: boolean
    setUserCustomer: (user: any) => void
    checkCustomerAuth: () => Promise<void>
}

const userCustomerAuthStore = create<CustomerStoreType>((set, get) => ({
    userCustomer: null,
    isLoading: true,
    isSigningIn: false,
    setUserCustomer: (user : any) => set({ userCustomer: user }),
    checkCustomerAuth: async () => {
        set({ isLoading: true });
        try {
            const customer = await checkCustomerAuthApi()
            set({ userCustomer: customer, isLoading: false })
        } catch (error) {
            set({ userCustomer: null, isLoading: false })
            console.log(error)
        }
    },
}))

export default userCustomerAuthStore