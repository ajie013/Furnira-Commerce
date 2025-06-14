import {Request, Response } from 'express'
import prisma from '../lib/db'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken'
import jwt from 'jsonwebtoken'

interface NewUser{
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    password: string
    username: string
}

const signUp =  async (req: Request, res: Response) =>{
    const user: NewUser = req.body;

    console.log(req.body)
    try {

        const isUsernameExist = await prisma.user.findUnique({
            where: {
                username: user.username
            }
        });

        const isEmailExist = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        const isPhoneNumberExist = await prisma.user.findUnique({
            where: {
                phoneNumber: user.phoneNumber
            }
        });

        if(isUsernameExist){
            res.status(400).json({message: "Username already exists"})
            return;
        };

        if(isEmailExist){
            res.status(400).json({message: "Email already exists"})
            return;
        };

        if(isPhoneNumberExist){
            res.status(400).json({message: "Phone number already exists"})
            return;
        };

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = await prisma.user.create({
            data:{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                phoneNumber: user.phoneNumber,
                password: hashedPassword,
                isArchive: false,
                role: "Customer"
            }
        });

        if(!newUser){
            res.status(404).json({message: "User not found"})
            return;
        };

        await prisma.shoppingCart.create({
            data:{
                userId: newUser.userId,
                quantity: 0,
                totalAmount: 0
            }
        });

        res.status(201).json({message: "New user has been created"})
    } catch (error: any) {
        console.log('Error in creating new user: ', error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const signIn = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    console.log(req.body)
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user || user.role !== role) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        const token = generateToken(user.userId);

        res.cookie(role === "Customer" ? "token" : "Admin", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });

        res.status(200).json({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        });

    } catch (error: any) {
        console.log('Error signing in:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const signOut = (req: Request, res: Response) =>{
    const { role } = req.body;

    try {
        res.cookie(role === 'Customer' ? 'token' : 'Admin', '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        
        res.status(200).json({ message: 'Signed out successfully' });
        
    } catch (error: any) {
        console.log('Error signing out: ', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const checkAuthCustomer = (req: Request, res: Response) =>{
    try {

        const user = req.user    
        res.status(200).json(user)
        
    } catch (error: any) {
        console.log('Error getting customer: ', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const checkAuthAdmin = (req: Request, res: Response) =>{
    try {

        const user = req.user    
        res.status(200).json(user)
        
    } catch (error: any) {
        console.log('Error getting admin: ', error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export { signUp, signIn, signOut, checkAuthAdmin, checkAuthCustomer }