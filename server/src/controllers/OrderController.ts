import Stripe from "stripe";
import { Request, Response } from "express";
import prisma from "../lib/db"; // your existing prisma setup
import updateCart from "../utils/cartUpdater";

interface OrderItems{
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", 
});

 const createCheckoutSession = async (req: Request, res: Response) => {
  const { cart, userId } = req.body;

  try {
    const line_items = cart.cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
        
        },
        unit_amount: item.price * 100, 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/payment/cancel',  
      metadata: {
        userId,
      },
    });

    res.json({ url: session.url});
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Unable to create checkout session" });
  }
};

const saveOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const cart = await prisma.shoppingCart.findUnique({
      where: { userId: user.userId},
      include:{cartItems: true}
    })

    console.log(cart)

    if(!cart){
      res.status(404).json({message: "Cart not found"})
      return;
    }

    const order = await prisma.order.create({
      data:{
        userId: cart.userId,
        status: 'Pending',
        totalAmount: cart.totalAmount
      }
    });

    await Promise.all(cart.cartItems.map(async (item) =>{
      await prisma.orderItem.create({
        data:{
          orderId: order.orderId,
          productId: item.productId,
          price: item.price,
          quantity: item.quantity
        }
      })
    }))

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.shoppingCartId
      }
    })


    updateCart(cart.shoppingCartId)
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to save order" });
  }
};


export { createCheckoutSession, saveOrder }