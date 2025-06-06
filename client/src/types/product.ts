import type { Category } from "./category"

export interface Product{
    productId: string
    name: string,
    price: number,
    image: string | null
    stock: number
    categoryId: string
    isArchive: boolean
    category: string
    Category?: Category
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


