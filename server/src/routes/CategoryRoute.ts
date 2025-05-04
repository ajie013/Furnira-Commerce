import express from 'express'
import * as categoryController from '../controllers/CategoryController'

const categoryRouter = express.Router();

categoryRouter.post('/', categoryController.createCategory); //create category
categoryRouter.get('/category-list', categoryController.getAllCategory) //get all category
categoryRouter.get('/:id', categoryController.getCategory) //get specific category
categoryRouter.put('/:updateCategory', categoryController.updateCategory) //update existing category

export default categoryRouter