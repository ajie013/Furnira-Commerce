import express from 'express'
import * as orderController from '../controllers/OrderController'
import authCustomer from '../middleware/authCustomer';

const orderRouter = express();

orderRouter.post('/checkout', orderController.createCheckoutSession);
orderRouter.post('/save-order', authCustomer ,orderController.saveOrder)

export default orderRouter