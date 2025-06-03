import Stripe from "stripe";
import { Request, Response } from "express";
import prisma from "../lib/db"; // your existing prisma setup
import updateCart from "../utils/cartUpdater";

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

const getOrderHistory = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const orderHistory = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                Category: true,
              },
            },
          },
        },
      },
    });

    const updatedOrderHistory = orderHistory.map((order) => ({
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price), // optional: convert price
          image: item.product.image
            ? `http://localhost:8080/public/${item.product.image}`
            : null,
          category: item.product.Category.name,
        },
      })),
    }));

    res.status(200).json(updatedOrderHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};


export { createCheckoutSession, saveOrder, getOrderHistory }