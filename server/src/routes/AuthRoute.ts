import express from "express";
import * as authController from '../controllers/AuthController'
import authAdmin from "../middleware/authAdmin";
import authCustomer from "../middleware/authCustomer";

const authRouter = express.Router();

authRouter.post('/sign-up', authController.signUp)
authRouter.post('/sign-in', authController.signIn)
authRouter.post('/sign-out', authController.signOut)

authRouter.get('/check-customer',authCustomer, authController.checkAuthCustomer);
authRouter.get('/check-admin',authAdmin, authController.checkAuthAdmin);

export default authRouter