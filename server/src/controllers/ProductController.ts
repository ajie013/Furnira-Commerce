import { Response, Request } from 'express';
import prisma from '../lib/db';

interface NewProduct {
    name: string;
    price: number;
    stock: number;
    categoryId: string;
}

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const productList = await prisma.product.findMany({
            where: {
                isArchive: false
            },
            include: {
                Category: true
            }
        });

        const updatedProductList = productList.map((item) => ({
            ...item,
            category: item.Category.name,
            image: item.image ? `http://localhost:8080/public/${item.image}` : null,
            price: Number(item.price)
        }));

        res.status(200).json(updatedProductList);
    } catch (error: any) {
        console.error('Error in getting all products ', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getProduct = async (req: Request, res: Response): Promise<void> => {
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

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        const formattedProduct = {
            ...product,
            category: product.Category.name,
            image: product.image ? `http://localhost:8080/public/${product.image}` : null
        };

        res.status(200).json(formattedProduct);
    } catch (error: any) {
        console.error('Error in getting a product ', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createProduct = async (req: Request, res: Response): Promise<void> => {
    const product: NewProduct = req.body;
    const fileName = req.file ? req.file.filename : null;

    try {
        const isProductNameExist = await prisma.product.findFirst({
            where: {
                AND: [
                    { name: product.name },
                    { categoryId: product.categoryId },
                ]
            }
        });

        if (isProductNameExist) {
            res.status(400).json({ message: "Product already exists" });
            return;
        }

        await prisma.product.create({
            data: {
                name: product.name,
                image: fileName || null,
                stock: Number(product.stock),
                price: Number(product.price),
                categoryId: product.categoryId,
                isArchive: false,
            }
        });

        res.status(200).json({ message: "New product has been created" });
    } catch (error: any) {
        console.error('Error in creating new product: ', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;

    try {
        const isProductExist = await prisma.product.findUnique({
            where: {
                productId: productId
            }
        });

        if (!isProductExist) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        await prisma.product.update({
            where: {
                productId: productId
            },
            data: {
                isArchive: true
            }
        });

        res.status(200).json({ message: "Product deleted" });
    } catch (error: any) {
        console.error('Error in deleting a product ', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updatedProduct = async (req: Request, res: Response): Promise<void> => {
    const { id: productId } = req.params;
    const product = req.body;
    const fileName = req.file ? req.file.filename : null;

    try {
        const isProductExist = await prisma.product.findUnique({
            where: {
                productId: productId
            }
        });

        if (!isProductExist) {
            res.status(400).json({ message: "Product not found" });
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
        console.error('Error in updating a product ', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updatedProduct
};
