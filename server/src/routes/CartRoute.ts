import express from 'express'
import * as cartController from '../controllers/CartController'

const cartRouter = express.Router();

cartRouter.get('/:id', cartController.getCartByUserId) //get cart by userId
cartRouter.delete('/:id', cartController.deleteItemInCart) //delete item from cart

export default cartRouter