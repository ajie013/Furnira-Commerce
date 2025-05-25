import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getProductByIdApi, getAllProductsApi } from '@/api/productApi';
import formatCurrency from '@/utils/currencyConverter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {  addCartItemApi } from '@/api/cartApi';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import toast from 'react-hot-toast';

const ProductItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {userCustomer} = userCustomerAuthStore()

    if (!id) {
        navigate("/shop");
        return null;
    }

    const { data: product, isLoading: isProductLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductByIdApi(id),
    });

    const { data: allProducts, isLoading: isAllProductsLoading } = useQuery({
        queryKey: ["product-list"],
        queryFn: getAllProductsApi,
        enabled: !!product,
    });

    const relatedProducts = allProducts?.filter(
        (p) => p.categoryId === product?.categoryId && p.productId !== product.productId
    );

    const addCartItemMutation = useMutation({
        mutationFn: async () =>{
             return await addCartItemApi(userCustomer.userId, {
            productId: product.productId,
            price: Number(product.price),
            quantity: 1
        })
        },
        onSuccess: (res: any) =>{
          
            toast.success(res.message)
        },
        onError: (error: any) =>{
            toast.error(error.response.data.message)
        }
    })

    const addToCart = async () =>{

        if(!userCustomer) return toast.error('Please sign in your account first')
        addCartItemMutation.mutate()
    }
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Detail */}
            {isProductLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[300px] w-full rounded-md" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            ) : (
                product && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <img
                            src={product.image || 'https://via.placeholder.com/400'}
                            alt={product.name}
                            className="w-full h-[400px] object-cover rounded-lg shadow"
                        />
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                            <p className="text-xl text-[#FF9900] font-semibold">
                                {formatCurrency(product.price)}
                            </p>
                            <p className="text-xl text-black font-semibold">
                                {product.Category.name}
                            </p>
                            <p className="text-gray-600">{product.description}</p>
                            <Button onClick={addToCart} className="bg-[#FF9900] hover:bg-[#ff9900d1] text-white">
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                )
            )}

            {/* Related Products */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isAllProductsLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton key={i} className="h-60 w-full rounded-lg" />
                          ))
                        : relatedProducts?.map((rel) => (
                              <div

                                  key={rel.productId}
                                  className="bg-white border rounded-lg shadow hover:shadow-md transition w-[200px]"
                              >
                                  <img
                                      src={rel.image || 'https://via.placeholder.com/300'}
                                      alt={rel.name}
                                      className="w-full h-40 object-cover rounded-t-md"
                                  />
                                  <div className="p-4">
                                      <h3 className="text-lg font-semibold">{rel.name}</h3>
                                      {/* <p className="text-[#FF9900] font-bold">
                                          {formatCurrency(rel.price)}
                                      </p> */}
                                      {/* <Link to={`/product/${rel.productId}`}>
                                          <Button
                                              variant="outline"
                                              className="mt-2 w-full text-[#FF9900] border-[#FF9900]"
                                          >
                                              View
                                          </Button>
                                      </Link> */}
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
