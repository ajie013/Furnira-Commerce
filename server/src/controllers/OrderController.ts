import { Request, Response } from "express";
import prisma from "../lib/db";

interface OrderItems{
    orderId: string,
    productId: string,
    quantity: number,
    price: number,
}

const addOrder = async (req: Request, res: Response) =>{

    const { id: userId } = req.params;
    const { totalAmount, orderItems } = req.body

    try {
        const newOrder = await prisma.order.create({
            data:{
                userId: userId,
                totalAmount: totalAmount,
                status: "Pending"
            }
        });

        await Promise.all(orderItems.map(async (item: OrderItems) =>{

            await prisma.orderItem.create({
                data:{
                    orderId: newOrder.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }
            });

        }));

        res.status(201).json({message: "Transaction was successful"})
    
    } catch (error: any) {
        console.error("Error adding a new order: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { addOrder }