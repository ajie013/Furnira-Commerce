import express from 'express'
import * as userController from '../controllers/UserController' 

const userRouter = express.Router();

userRouter.get('/user-list', userController.getAllUsers); // more specific
userRouter.get('/:id', userController.getUserById);   
userRouter.delete('/:id', userController.deleteUser); //delete user by userId
userRouter.put('/:id', userController.updateUser);  //update user by userId



export default userRouter