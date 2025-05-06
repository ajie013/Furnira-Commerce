import express from 'express'
import * as cartController from '../controllers/CartController'

const cartRouter = express.Router();

cartRouter.get('/:id', cartController.getCartByUserId) //get cart by userId
cartRouter.delete('/:id', cartController.deleteItemInCart) //delete item from cart by cartItemId
cartRouter.post('/:id', cartController.addItemToCart); //add item to cart by userId
cartRouter.put("/:id", cartController.updateCart); //update cart using cartItemId

export default cartRouter