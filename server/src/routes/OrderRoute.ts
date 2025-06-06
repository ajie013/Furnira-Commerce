import express from 'express'
import * as orderController from '../controllers/OrderController'
import authCustomer from '../middleware/authCustomer';

const orderRouter = express();

orderRouter.post('/checkout', orderController.createCheckoutSession);
orderRouter.get('/:id', orderController.getOrderHistory)
orderRouter.post('/save-order', authCustomer ,orderController.saveOrder)
orderRouter.get('/', orderController.getAllOrders)
orderRouter.put('/:id', orderController.updateOrderStatus)

export default orderRouter