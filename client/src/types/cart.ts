import type { Product } from "./product"

export interface CartItem{
    cartId: string
    cartItemId: string
    productId: string,
    quantity: number,
    product: Product
    price: number
}

export interface ShoppingCart{
    shoppingCartId: string
    quantity: number
    totalAmount: number
    userId: string
    cartitems: CartItem
}