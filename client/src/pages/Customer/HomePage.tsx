import { getAllProductsApi } from '@/api/productApi'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import formatCurrency from '@/utils/currencyConverter'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HomePage = () => {
    const { data: productList, isLoading } = useQuery({
        queryKey: ['product-list'],
        queryFn: () => getAllProductsApi(),    
    })

    const navigate = useNavigate()
    const navigateToShop = () => {
        navigate('/shop')
    }
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader></Loader>
            </div>
        )
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
            <main className="container mx-auto px-4 py-10">
              
                <section className="mb-12 relative">
                    <div
                        className="bg-cover bg-center h-64 sm:h-80 md:h-66 rounded-xl shadow-lg flex items-center justify-center text-white relative overflow-hidden"
                      
                    >
              
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl" />

                        <div className="relative z-10 text-center px-4">
                            <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg mb-2">Welcome to Furnira</h1>
                            <p className="text-lg sm:text-xl text-gray-200 mb-6">
                                Discover modern, stylish furniture for every space.
                            </p>
                            <Button onClick={navigateToShop} className="bg-[#FF9900] hover:bg-[#ff9900bc] text-white font-medium py-2 px-6 rounded transition">
                                Show Now
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section>
                    <h2 className="text-2xl font-sm text-gray-800 mb-6">Featured Products</h2>
                    {productList?.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {productList.slice(0,4).map((product: Product) => (
                                <div
                                    key={product.productId}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                >
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                                        <p className="text-gray-700 mt-1">{formatCurrency(product.price)}</p>
                                        <Button className="mt-4 w-full bg-[#FF9900] text-white py-2 px-4 rounded hover:bg-[#ff9900bc] transition">
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No products available right now.</p>
                    )}
                </section>
            </main>
        </div>
    )
}

export default HomePage
