import express from "express";
import * as authController from '../controllers/AuthController'
import authAdmin from "../middleware/authAdmin";
import authCustomer from "../middleware/authCustomer";

const authRouter = express.Router();

authRouter.post('/sign-up', authController.signUp); //sign up user
authRouter.post('/sign-in', authController.signIn);  //sign in user
authRouter.post('/sign-out', authController.signOut); //sign out user
authRouter.get('/check-admin',authAdmin, authController.checkAuthAdmin); //get the signed in admin
authRouter.get('/check-customer',authCustomer, authController.checkAuthCustomer); //get the signed in customer


export default authRouter