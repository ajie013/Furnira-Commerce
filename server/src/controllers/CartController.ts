import {Request, Response} from 'express'
import prisma from '../lib/db';

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

    const cartItems: AddItems[] = req.body;
    
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

        await Promise.all(cartItems.map((item) =>{
            prisma.cartItem.create({
                data:{
                    cartId: shoppingCart.shoppingCartId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }
            })
        }));

        res.status(200).json({ message: "Items added to cart successfully" });
        
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
        await prisma.cartItem.delete({
            where: {
                cartItemId: cartItemId
            }
        });

        res.status(200).json({ message: "Item deleted successfully" });
        
    } catch (error: any) {
        console.error("Error adding items to cart:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }  
}

export { getCartByUserId, addItemToCart, deleteItemInCart }