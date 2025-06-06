import {Response, Request} from 'express'
import prisma from '../lib/db'

const getUserById = async (req: Request, res: Response) =>{
    try {

        const { id: userId } = req.params;

        const user = await prisma.user.findUnique({
            where:{
                userId: userId
            },
            select:{
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
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
        });

        const users = userList.map((user) => {
            return {
                userId: user.userId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                isArchive: user.isArchive,
                role: user.role
            }
        });

        res.status(200).json(users)
        
    }catch (error: any) {
        console.log("Error in getting all users: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateUser = async (req: Request, res: Response) =>{
    try {
        const { id: userId } = req.params;
      
        const {firstName, lastName, email, phoneNumber } = req.body;

        await prisma.user.update({
            where: {
                userId: userId
            },

            data:{
             
               
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