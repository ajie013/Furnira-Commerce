import {Request, Response} from 'express'
import prisma from '../lib/db';
import cartUpdater from '../utils/cartUpdater';
const getCartByUserId = async (req: Request, res: Response) =>{
    const { id: userId } = req.params;

    try {
        const cart = await prisma.shoppingCart.findUnique({
            where:{
                userId: userId
            },
            include: {
                cartItems: {
                    include: {
                        product: {
                            include: {
                                Category: true
                            }
                        }
                    }
                }
            }
        });

        if(!cart){
            res.status(404).json({message: "Cart not found"});
            return;
        }

        const updatedCartItems = cart.cartItems.map((item) =>{
            return{
                ...item, 
                price: Number(item.price),
                product:{
                    ...item.product,
                    price: Number(item.product.price),
                    image: item.product.image ? `http://localhost:8080/public/${item.product.image}` : null
                }
            }
        });

        const updatedCart = {
            ...cart, 
            totalAmount: Number(cart.totalAmount), 
            cartItems: updatedCartItems 
        }

        res.status(200).json(updatedCart)
    } catch (error: any) {
        console.error(`Error: `, error.message)
        res.status(500).json({message: "Internal Server Error"});
    }
}

interface AddItems{
    productId: string
    quantity: number,
    price: number
}

const addItemToCart = async (req: Request, res: Response) =>{

    const { id: userId } = req.params;
    const cartItem: AddItems = req.body;
    
    try {
        const shoppingCart = await prisma.shoppingCart.findUnique({
            where:{
                userId: userId
            }
        });

        if(!shoppingCart){
            res.status(404).json({message: "Shopping Cart not found"})
            return;
        }

         const isProductExist = await prisma.cartItem.findFirst({
                where: {
                    AND: [
                        { productId: cartItem.productId },
                        { cartId: shoppingCart.shoppingCartId }
                    ]
                }
            });

            let message;

            if(isProductExist){
                await prisma.cartItem.update({
                    where:{
                        cartItemId: isProductExist.cartItemId
                    },
                    data:{
                        quantity: isProductExist.quantity + 1
                    }
                })
                message = "Item's quantity has been updated"

             
            }
            else{
                await prisma.cartItem.create({
                    data:{
                        cartId: shoppingCart.shoppingCartId,
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        price: cartItem.price
                    }
                })

                   message = "Item added to cart"

               
            }     

            cartUpdater(shoppingCart.shoppingCartId)

     

        res.status(200).json({message });
        
    } catch (error: any) {
        console.error("Error adding items to cart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteItemInCart = async (req: Request, res: Response) =>{
    const { id: cartItemId } = req.params;

    if(!cartItemId){
        res.status(404).json({ message: "Cart Item not found" });
        return;
    }

    try {
        const cart = await prisma.cartItem.delete({
            where: {
                cartItemId: cartItemId
            }
        });

         cartUpdater(cart.cartId)

        res.status(200).json({ message: "Item deleted successfully" });
        
    } catch (error: any) {
        console.error("Error deleting item from cart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }  
}

const updateCart = async (req: Request, res: Response) =>{
    const { id: cartItemId } = req.params;

    const { action } = req.body

    try {
        if (!action) {
            res.status(400).json({ message: "Action is required" });
            return;
        }
        
        const cartItem = await prisma.cartItem.findUnique({
            where:{
                cartItemId: cartItemId
            },
        });
    
        if(!cartItem){
            res.status(404).json({message: "Cart Item not found"})
            return;
        }
        
        const normalizedAction = action?.toLowerCase();

        if(normalizedAction === "increment"){
           
            await prisma.cartItem.update({
                where:{
                    cartItemId: cartItem.cartItemId
                },
                data:{
                    quantity: cartItem.quantity + 1
                }
            });

        }else if(normalizedAction === "decrement"){
    
            if(cartItem.quantity <= 1){
                res.status(400).json({message: "Quantity cannot be less than 1"})
                return;
            };
    
            await prisma.cartItem.update({
                where:{
                    cartItemId: cartItem.cartItemId
                },
                data:{
                    quantity: cartItem.quantity - 1
                }
            });

            cartUpdater
            (cartItem.cartId)
        }

        res.status(200).json({message: "Cart updated succesffuly"})
    } catch (error: any) {
        console.error("Error updating items in cart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { getCartByUserId, addItemToCart, deleteItemInCart, updateCart }