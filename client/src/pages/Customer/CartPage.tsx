import { deleteCartItemApi, getCartApi, updateCartItemApi } from '@/api/cartApi';
import { Button } from '@/components/ui/button';
import userCustomerAuthStore from '@/store/useCustomerAuthStore';
import type { CartItem } from '@/types/cart';
import formatCurrency from '@/utils/currencyConverter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader, Loader2, Trash2, Trash } from 'lucide-react';
import  { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '@/lib/axios';
import useCartStore from '@/store/useCartStore';
import unavailableImage from '@/assets/unavailable-image.jpg';

const CartPage = () => {
    const { userCustomer } = userCustomerAuthStore();
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const { setCart } = useCartStore();

    const { data: cart, isLoading, error, refetch } = useQuery({
        queryKey: ['cart', userCustomer],
        queryFn: () => getCartApi(userCustomer.userId),
        enabled: !!userCustomer,
    });

    useEffect(() => {
        if (cart) {
            setCart(cart);
        }
    }, [cart]);

    const deleteCartItemMutation = useMutation({
        mutationFn: (cartItemId: string) => deleteCartItemApi(cartItemId),
        onSuccess: () => {
            toast.success('Item removed from cart.');
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete item.');
        },
    });

    const deleteCartItem = (cartItemId: string) => {
        deleteCartItemMutation.mutate(cartItemId);
    };

    const handleCheckout = async () => {
        try {
            setIsCheckoutLoading(true);

            const stripe = await loadStripe(
                'pk_live_51RQ3UjD7T158SlAV9w32rlmBNFqirP7KAVzMMvVE3gAimAyYkpvGtZu4qxxDzxU5PS1wadlnZsLPA7yfMxt4qNnH00w1lU4SFZ'
            );

            const response = await axiosInstance.post('/order/checkout', {
                cart,
                userId: userCustomer.userId,
            });

            if (stripe && response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error: any) {
            toast.error('Something went wrong during checkout.');
            console.error(error);
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const cartIsEmpty = cart && cart.cartItems.length === 0;

    if (error) {
        return (
            <div className="w-full bg-gray-100 py-10 px-4">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Shopping Cart</h1>
                <div className="text-red-500 text-xl">
                    An error occurred while loading your cart.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-100 py-10 px-4">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader className="animate-spin size-8 text-[#FF9900]" />
                        </div>
                    ) : cartIsEmpty ? (
                        <div className="text-gray-600 text-xl text-left w-full">
                            Your cart is empty.
                        </div>
                    ) : (
                        cart.cartItems.map((item: CartItem) => (
                            <CartItemCard item={item} refetch={refetch} deleteCartItem={deleteCartItem}/>
                        ))
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow p-6 h-fit">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Items ({cart?.quantity || 0})</span>
                        <span>{formatCurrency(cart?.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-4">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatCurrency(cart?.totalAmount || 0)}</span>
                    </div>
                    <Button
                        className="w-full mt-6 bg-[#FF9900] hover:bg-[#ff9900cc] text-white font-semibold p-5 rounded-md transition"
                        disabled={!cart || cartIsEmpty}
                        onClick={handleCheckout}
                    >
                        {isCheckoutLoading ? (
                            <Loader2 className="animate-spin size-5" />
                        ) : (
                            'Proceed to Checkout'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface CartItemProps {
    item: CartItem;
    deleteCartItem: (cartItemId: string) => void;
    refetch: () => void
}

const CartItemCard: React.FC<CartItemProps> = ({item, deleteCartItem, refetch}) =>{
    const [isEditing, setIsEditing] = useState(false);

    const [updatedQuantity, setUpdatedQuantity,] = useState(item.quantity);

    const updateCartItemMutation = useMutation({
        mutationFn: () => updateCartItemApi(item.cartItemId, updatedQuantity),
        onSuccess: () => {
            toast.success('Cart updated successfully.');
            setIsEditing(false);
            refetch()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update cart.');
        },
    });

    const updateCart = async () => {
        await updateCartItemMutation.mutateAsync();
    };

    return(
        <>
           <div
                key={item.cartItemId}
                className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                        src={item.product.image || unavailableImage}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded border"
                    />
                    <div>
                        <p className="text-lg font-medium text-gray-800">
                            {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Price: {formatCurrency(item.price)}
                        </p>
                       
                        
                            <p className="text-sm text-gray-500">
                                Quantity:
                                {isEditing ? (
                                    <>  
                                        <input
                                            type="number"
                                            value={updatedQuantity}
                                            min="1"
                                            max={item.product.stock}
                                            onChange={(e) => {
                                                setUpdatedQuantity(Number(e.target.value));
                                               
                                            }}
                                            className="ml-2 w-16 border rounded px-2 py-1"
                                        />
                                      
                                        <Button onClick={updateCart} className='bg-[#FF9900] ml-2'>Save</Button>
                                        <Button onClick={() => setIsEditing(!isEditing)} className='ml-1'>Cancel</Button>
                                        
                                        
                                    </>
                                    
                                ) : (
                                    <>
                                       <span className="ml-1">{item.quantity}</span>
                                       <i onClick={() => setIsEditing(!isEditing)} className=' cursor-pointer text-blue-600 hover:underline'>&nbsp;Edit</i>
                                    </>
                                  
                                    
                                )}
                                &nbsp;
                              
                            </p>
                           
                          
                            
                      
                        
                    </div>
                </div>
                <Trash2
                    className="text-red-500 hover:text-red-600 cursor-pointer transition"
                    onClick={() => deleteCartItem(item.cartItemId)}
                />
            </div>
        </>
    )
}

export default CartPage;
