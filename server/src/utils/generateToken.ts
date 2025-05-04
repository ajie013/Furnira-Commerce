import jwt from 'jsonwebtoken'
import express, {Response} from 'express'

const generateToken = (userId: string) =>{
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const token = jwt.sign({userId}, secret,{
        expiresIn: '1d'
    });

    return token;
}

export default generateToken