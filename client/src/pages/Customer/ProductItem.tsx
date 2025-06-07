import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProductByIdApi, getAllProductsApi } from '@/api/productApi';
import formatCurrency from '@/utils/currencyConverter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { addCartItemApi } from '@/api/cartApi';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import toast from 'react-hot-toast';
import React, { useEffect } from 'react';
import type { Product } from '@/types/product';
import unavailableImage from '@/assets/unavailable-image.jpg';

const ProductItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userCustomer } = userCustomerAuthStore();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!id) {
        navigate('/shop');
        return null;
    }

    const { data: product, isLoading: isProductLoading, error: errorProduct } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductByIdApi(id),
    });

    const { data: allProducts, isLoading: isAllProductsLoading } = useQuery({
        queryKey: ['product-list'],
        queryFn: getAllProductsApi,
        enabled: !!product,
    });

    const relatedProducts = allProducts?.filter(
        (p) => p.categoryId === product?.categoryId && p.productId !== product?.productId
    );

    const addCartItemMutation = useMutation({
        mutationFn: async () => {
            if (!product || !userCustomer) return;
            return await addCartItemApi(userCustomer.userId, {
                productId: product.productId,
                price: Number(product.price),
                quantity: 1,
            });
        },
        onSuccess: (res: any) => toast.success(res.message),
        onError: (error: any) =>
            toast.error(error.response?.data?.message || 'Something went wrong.'),
    });

    const addToCart = () => {
        if (!userCustomer) return toast.error('Please sign in your account first');
        addCartItemMutation.mutate();
    };

    if( errorProduct ) {
        return (
            <div className="container max-w-6xl mx-auto px-4 py-10">
                <p className="text-red-600">Failed to load product details. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 py-10">
            {/* Product Detail Section */}
            {isProductLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Skeleton className="h-[400px] w-full rounded-md" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            ) : (
                product && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <img
                            src={product.image || unavailableImage}
                            alt={product.name}
                            className="w-full h-[400px] object-contain rounded-lg shadow bg-white p-4"
                        />
                        <div className="space-y-5">
                            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-2xl text-[#FF9900] font-semibold">
                                {formatCurrency(product.price)}
                            </p>
                            {product.Category?.name && (
                                <p className="text-xl text-gray-700 font-medium">
                                    Category: {product.Category.name}
                                </p>
                            )}
                            <p className="text-gray-600">{product.description}</p>
                            <Button
                                onClick={addToCart}
                                className="bg-[#FF9900] hover:bg-[#e88d00] text-white px-6 py-2"
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                )
            )}

            {/* Related Products Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {isAllProductsLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton key={i} className="h-60 w-full rounded-lg" />
                          ))
                        : relatedProducts?.map((prod) => (
                              <ProductItemCard key={prod.productId} product={prod} />
                          ))}
                </div>
            </div>
        </div>
    );
};

interface ProductItemCardProps {
    product: Product;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({ product }) => {
    const navigate = useNavigate();

    const viewProduct = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="cursor-pointer bg-white border rounded-lg shadow hover:shadow-lg transition w-full" onClick={() => viewProduct(product.productId)}>
            <img
                src={product.image || unavailableImage }
                alt={product.name}
                className="w-full h-48 object-contain rounded-t-md bg-white p-4"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-[#FF9900] font-medium mt-1">
                    {formatCurrency(product.price)}
                </p>
            </div>
        </div>
    );
};

export default ProductItem;
