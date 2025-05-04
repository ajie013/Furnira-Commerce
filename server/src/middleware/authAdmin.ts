
import { Response, Request, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/db';

declare global {
    namespace Express {
        interface Request {
            user: any;
        }
  
    }
}

interface JwtPayload {
    userId: string;
}

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.Admin; 
    const secret = process.env.JWT_SECRET || 'mysecretkey';

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No Admin Token" });
        return;
    } 

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
       
        const user = await prisma.user.findUnique({
            where:{
                userId: decoded.userId
            },
            select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                isArchive: true,
            }
        });

        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Forbidden: Not an Admin" });
            return;
        }

        req.user = user;
        next();
    } catch (err: any) {
        res.status(401).json({ message: "Invalid Token" });
    }
};


export default authAdmin