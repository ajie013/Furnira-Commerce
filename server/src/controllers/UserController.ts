import {Response, Request} from 'express'
import prisma from '../lib/db'

const getUserById = async (req: Request, res: Response) =>{
    try {

        const { id: userId } = req.params;

        const user = await prisma.user.findUnique({
            where:{
                userId: userId
            }
        });

        if(!user){
            res.status(404).json({message: "User not found"})
            return;
        }

        res.status(200).json(user)
        
    } catch (error: any) {
        console.log("Error in getting a user: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getAllUsers = async (req: Request, res: Response) =>{
    try {
        const userList = await prisma.user.findMany({
            where:{
                isArchive: false
            }
        });

        res.status(200).json(userList)
        
    }catch (error: any) {
        console.log("Error in getting all users: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateUser = async (req: Request, res: Response) =>{
    try {
        const { id: userId } = req.params;
        const { username, password, firstName, lastName, email, phoneNumber } = req.body;

        await prisma.user.update({
            where: {
                userId: userId
            },

            data:{
                username,
                password, 
                firstName, 
                email, 
                lastName, 
                phoneNumber
            }
        });

       res.status(200).json({message: "User updated successfully"})
        
    } catch (error: any) {
        console.log("Error in getting a user: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteUser = async (req: Request, res: Response) =>{
    try {
        const { id: userId } = req.params;

        await prisma.user.update({
            where: {
                userId: userId
            },

            data:{
                isArchive: true
            }
        });

       res.status(200).json({message: "User deleted successfully"})
        
    } catch (error: any) {
        console.log("Error in getting a user: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}


export { getUserById, getAllUsers, updateUser, deleteUser }