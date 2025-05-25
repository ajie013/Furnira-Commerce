import express,{Request, Response} from "express";
import Stripe from "stripe";
import prisma from "../lib/db"; // your existing prisma setup

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Webhook endpoint
router.post("/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig: any = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return 
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    if(!session && session.metadata){
        return;
    }

    // Retrieve the user ID from the session metadata
    const userId = session.metadata.userId;

    // Save the order details to your database
    const orderItems = session.line_items; // You may need to fetch this separately if not included in the session

    // Example of saving order details
    // await prisma.order.create({
    //   data: {
    //     userId,
    //     totalAmount: session.amount_total / 100, // Convert back to dollars
    //     // Add other order details as needed
    //   },
    // });

    console.log('testinggg')
    // Optionally, save each item in the order
    // for (const item of orderItems) {
    //   await prisma.orderItem.create({
    //     data: {
    //       orderId: orderId, // Use the created order ID
    //       productId: item.price_data.product, // Assuming you have the product ID
    //       quantity: item.quantity,
    //       price: item.price_data.unit_amount / 100, // Convert back to dollars
    //     },
    //   });
    // }
  }

  res.json({ received: true });
});

export default router;
