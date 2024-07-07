import express from "express";
import dotenv from "dotenv";
import prodductRoutes from "./routes/products.js";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";


const app = express();

dotenv.config({path: "backend/config/config.env"});

// Connecting to Database
connectDatabase();

app.use(express.json());

console.log('Hello');

app.use("/api/v1", prodductRoutes);

// Using error middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
    console.log(
        `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    );
});