import { getAllProductsApi } from '@/api/productApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import  { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategoriesApi } from '@/api/categoryApi';
import type { Category } from '@/types/category';
import formatCurrency from '@/utils/currencyConverter';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { addCartItemApi } from '@/api/cartApi';
import toast from 'react-hot-toast';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import unavailableImage from '@/assets/unavailable-image.jpg';

const ShopPage = () => {
    const navigation = useNavigate();
    const { userCustomer } = userCustomerAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
  
    const { data: productList, isLoading: isLoadingProduct, error: errorProductList } = useQuery({
        queryKey: ['product-list'],
        queryFn: () => getAllProductsApi(),
    });

    const { data: categorylist, isLoading: isLoadingCategory, error: errorCategoryList } = useQuery({
        queryKey: ['category-list'],
        queryFn: () => getAllCategoriesApi(),
    });

    const filteredProducts = productList?.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All'
            ? true
            : String(product.categoryId) === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addItemMutation = useMutation({
        mutationFn: async (data: any) => addCartItemApi(userCustomer.userId, data ),
        onSuccess: (res: any) => {
            toast.success(res.message);
        },  
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });

    const addToCart = (e: React.MouseEvent<HTMLButtonElement>, productId: string, price: number) => {
        e.stopPropagation();
        if (!userCustomer) {
            return toast.error('Please sign in to your account first');
        }   
    
        addItemMutation.mutate({
            productId,
            price: Number(price),
            quantity: 1
        });
    }

    const viewProduct = (e: React.MouseEvent<HTMLDivElement> ,productId: string) => {
     
        navigation(`/product/${productId}`);
    }

    if(errorProductList)    {   
        return <p className="text-red-500">Failed to load products. Please try again later.</p>;
    }

    if(errorCategoryList) {
        return <p className="text-red-500">Failed to load categories. Please try again later.</p>;
    }
            
    return (
        <div className="bg-gray-100 min-h-screen py-2 px-4 w-full">
            <header className="z-10 sticky  mx-auto mb-8 flex flex-col gap-4  top-20 bg-white p-4 shadow-lg">
                <div className="flex gap-4 justify-between items-center w-full">
                    {/* Search Bar with Icon */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search for products..."
                            className="pl-10 pr-4 py-2 h-[50px] border-gray-300 focus:ring-[#FF9900] w-full rounded-md"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter or Skeleton */}
                    {isLoadingCategory ? (
                        <Skeleton className="w-[180px] h-10 rounded-md" />
                    ) : (
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setSelectedCategory(value)}
                        >
                            <SelectTrigger className="w-[185px]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className='z-200'>
                                <SelectItem className='z-200' value="All">All</SelectItem>
                                {categorylist?.map((category: Category) => (
                                    <SelectItem
                                        key={category.categoryId}
                                        value={String(category.categoryId)}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </header>

            {/* Product Grid */}
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
                {isLoadingProduct
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
                        >
                            <Skeleton className="w-full h-48 rounded-md mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>
                    ))
                    : filteredProducts && filteredProducts?.length >= 1 ? filteredProducts?.map((product) => (
                        <div
                            onClick={(event) => viewProduct(event,product.productId)}
                            key={product.productId}
                            className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <img
                                src={product.image || unavailableImage}
                                loading='lazy'
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-bold text-[#FF9900]">
                                        {formatCurrency(product.price)}
                                    </span>
                                  
                                    <Button onClick={(event) => addToCart(event,product.productId, product.price)} className="bg-[#FF9900] hover:bg-[#ff9900bc] text-white py-2 px-4 rounded">
                                        Add to Cart
                                    </Button>
                                    
                                </div>
                            </div>
                        </div>
                    )): <p className=''>No products available</p>}
            </div>
        </div>
    );
};

export default ShopPage;
