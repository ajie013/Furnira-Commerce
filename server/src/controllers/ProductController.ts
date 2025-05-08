import {Response, Request} from 'express'
import prisma from '../lib/db';

interface NewProduct{
    name: string
    price: number,
    stock: number
    categoryId: string
}

const getAllProducts = async (req: Request, res: Response) =>{
   

    try {
   
        const productList = await prisma.product.findMany({
            where: {
                isArchive: false
            },
            include: {
                Category: true
            }
        });

        const updatedProductList = productList.map((item) => {
            if(item.image){
                return{
                    ...item,
                    image: `http://localhost:8080/public/${item.image}`,
                    price: Number(item.price)
                }
            }
            else{
                return{...item, price: Number(item.price)}
            }
        })

        res.status(200).json(updatedProductList)
                
    } catch (error: any) {
        console.log('Error in getting all products ', error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getProduct = async (req: Request, res: Response) =>{
    const { id: productId } = req.params;

    try {
   
        const product = await prisma.product.findUnique({
            where: {
                productId: productId
            },
            include: {
                Category: true
            }
        });

        if(!product){
            res.status(404).json({message: "Product not found"});
            return;
        }

        if( product.image){
            product.image =  `http://localhost:8080/public/${product.image}`
        }

        res.status(200).json(product)
                
    } catch (error: any) {
        console.log('Error in getting a product ', error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const createProduct = async (req: Request, res: Response) =>{
    const product: NewProduct = req.body;
    const fileName = req.file ? req.file.filename : null; 
   
    try {
        const isProductNameExist = await prisma.product.findFirst({
            where: {
                name: product.name
            }
        });

        if(isProductNameExist){
            res.status(400).json({message: "Product already exist"});
            return;
        }

        await prisma.product.create({
            data:{
                name: product.name,
                image: fileName || null,
                stock: Number(product.stock),
                price: Number(product.price),
                categoryId: product.categoryId,
                isArchive: false,
            }
        });

        res.status(200).json({message: "New product has been created"})
        
    } catch (error: any) {
        console.log('Error in creating new product: ', error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteProduct = async (req: Request, res: Response) =>{
    const { id: productId } = req.params;
    console.log(productId)
    try {
        const isProductExist = await prisma.product.findUnique({
            where: {
                productId: productId
            }
        });

        if(!isProductExist){
            res.status(404).json({message: "Product not found"});
            return;
        }
   
        await prisma.product.update({
            where: {
                productId: productId
            },
            data:{
                isArchive: true
            }
         
        });
                
        res.status(200).json({message: "Product deleted"})
                
    } catch (error: any) {
        console.log('Error in deleting a product ', error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const updatedProduct = async (req: Request, res: Response) =>{
    const { id: productId } = req.params;
    const product = req.body
    const fileName = req.file ? req.file.filename : null; 

    try {
        const isProductExist = await prisma.product.findUnique({
            where: {
                productId: productId
            }
        });

        if(!isProductExist){
            res.status(400).json({message: "Product not found"});
            return;
        }

        const updateData: any = {
            name: product.name,
            price: Number(product.price),
            stock: Number(product.stock),
            categoryId: product.categoryId
        };

        if (fileName) {
            updateData.image = fileName;
        }

        await prisma.product.update({
            where: { productId },
            data: updateData
        });

        res.status(200).json({ message: "Product updated successfully" });

    } catch (error: any) {
        console.log('Error in updating a product ', error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export { createProduct, getAllProducts, getProduct, deleteProduct, updatedProduct }