import express from "express";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config"; 
import dbConnect from "./db/dbConnect.js";

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ["http://127.0.0.1:5500"],
    methods: "GET, POST, PUT, PATCH, DELETE",
};

  // middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// routes 
app.use("/api/v3", productRouter); // http://localhost:3000/api/v3/create-products
app.use("/api/v3", userRouter); // http://localhost:3000/api/v3/register
app.use("/api/v3", cartRouter); // http://localhost:3000/api/v3/create-cart
app.use("/api/v3", orderRouter); // http://localhost:3000/api/v3/create-order

app.get("/", (req, res) => {
    res.json({ message: "E-commerce API is running" });
});

dbConnect().then(() => {
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
  });