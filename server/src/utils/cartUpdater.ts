import prisma from "../lib/db"


const updateCart = async (cartId: string) =>{
    const shoppingCart = await prisma.cartItem.findMany({
        where: {cartId: cartId},
        select:{
            price: true,
            quantity: true
        }
    })
    

    const totalAmount = shoppingCart.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
    const totalQuantity = shoppingCart.reduce((total: number, item: any) => total + item.quantity, 0)

    await prisma.shoppingCart.update({
        where: {shoppingCartId: cartId},
        data:{
            quantity: totalQuantity,
            totalAmount: totalAmount
        }
    })

}

export default updateCart