import { getAllProductsApi } from '@/api/productApi';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const ShopPage = () => {
    const { data: productList, isLoading: isLoadingProduct } = useQuery({
        queryKey: ['product-list'],
        queryFn: () => getAllProductsApi(),
    });

    const { data: categorylist, isLoading: isLoadingCategory } = useQuery({
        queryKey: ['category-list'],
        queryFn: () => getAllCategoriesApi(),
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter products based on search query and category
    const filteredProducts = productList?.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All'
            ? true
            : String(product.categoryId) === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoadingCategory || isLoadingProduct) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="animate-spin size-10" />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-2 px-4 w-full">
            <header className="container mx-auto mb-8 flex flex-col gap-4 sticky top-0 bg-white z-10 p-4 shadow-lg">
                <div className="flex gap-4 justify-between items-center w-full">
                    {/* Search Bar with Icon */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search for products..."
                            className="pl-10 pr-4 py-2 border-gray-300 focus:ring-[#FF9900] w-full rounded-md"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
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
                </div>
            </header>

            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
                {filteredProducts?.map((product) => (
                    <div
                        key={product.productId}
                        className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition"
                    >
                        <img
                            src={product.image || 'https://via.placeholder.com/300'}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-lg font-bold text-[#FF9900]">
                                    {formatCurrency(product.price)}
                                </span>
                                <Link to={`/product/${product.productId}`}>
                                    <Button className="bg-[#FF9900] hover:bg-[#ff9900bc] text-white py-2 px-4 rounded">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
