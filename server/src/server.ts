import express, { json } from 'express'
import dotenv from 'dotenv'
import logger from './middleware/logger';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import categoryRouter from './routes/CategoryRoute';
import productRouter from './routes/ProductRoute';
import path from 'path'
import { fileURLToPath } from 'url';
import cartRouter from './routes/CartRoute';
import authRouter from './routes/AuthRoute';
import userRouter from './routes/UserRoute';
import orderRouter from './routes/OrderRoute';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

const PORT = process.env.PORT || 8080;

app.use(logger);


app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter)


app.listen(PORT, () =>{
    console.log(`Server is running in port ${PORT}`)
})