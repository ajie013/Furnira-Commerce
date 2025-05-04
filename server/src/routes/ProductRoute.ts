import express from 'express'
import * as productController from '../controllers/ProductController'
import { upload } from '../lib/multer';

const productRouter = express.Router();

productRouter.post('/', upload.single('imageUrl') ,productController.createProduct); //create new product
productRouter.get('/product-list', productController.getAllProducts); //get all products
productRouter.get('/:id', productController.getProduct); //get a specific product
productRouter.delete('/:id', productController.deleteProduct); //delete or archive product
productRouter.put('/:id', upload.single('imageUrl'), productController.updatedProduct); //update a product

export default productRouter