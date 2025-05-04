import express, {Request, Response} from 'express'
import prisma from '../lib/db';

const createCategory = async (req: Request, res: Response) =>{
    const { name } = req.body;
   
    try {
        const isCategoryExist = await prisma.category.findFirst({
            where: {
                name: name
            }
        })

        if(isCategoryExist){
            res.status(400).json({message: "Category name already exists"});
            return;
        }

        await prisma.category.create({
            data:{
                name: name
            }
        });

        res.status(201).json({message: "New category has been created"})
    } catch (error: any) {
        console.log("Error in creating new category: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getAllCategory = async (req: Request, res: Response) =>{
   
    try {
        const categoryList = await prisma.category.findMany({})

        res.status(201).json(categoryList)
    } catch (error: any) {
        console.log("Error in getting all categories: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getCategory = async (req: Request, res: Response) =>{
    const { id: categoryId } = req.params

    try {
        const category = await prisma.category.findUnique({
            where: {
                categoryId: categoryId
            }
        })
        
        res.status(201).json(category)
    } catch (error: any) {
        console.log("Error in getting a category: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updateCategory = async (req: Request, res: Response) =>{
    const { id: categoryId } = req.params;
    const { name } = req.body;

    try {
        const isCategoryExist = await prisma.category.findUnique({
            where: {
                categoryId: categoryId
            }
        })
        
        if(!isCategoryExist){
            res.status(404).json({message: "Category not found"})
            return;
        };

        await prisma.category.update({
            where: {
                categoryId
            },
            data:{
                name
            }
        })
        
        res.status(201).json({message: "Category updated successfully"})
    } catch (error: any) {
        console.log("Error in getting a category: ", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export { createCategory, getAllCategory, getCategory, updateCategory }