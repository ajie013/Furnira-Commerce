import type { Category } from "./category"

export interface Product{
    productId: string
    name: string,
    price: number,
    image?: string
    stock: number
    Category: Category
}

export interface AddProductFormData{
    name: string
    stock: number | null
    categoryId: string | null
    price: number | null
}

export interface UpdateProductFormData{
    name: string
    stock: number | null
    categoryId: string | null
    price: number | null
}


