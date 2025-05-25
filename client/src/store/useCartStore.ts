import type { CartItem, ShoppingCart } from '@/types/cart'
import {create} from 'zustand'

interface CartStore{
    shoppingCart: ShoppingCart | null
    setCart: (data: ShoppingCart) => void
}

const useCartStore = create<CartStore>((set, get) =>({
    shoppingCart : null,

    setCart: async (data: ShoppingCart) =>{
        set({shoppingCart: data})
    }
}))

export default useCartStore