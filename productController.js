import Product from "../models/Product.js";

export const createdProductsController = async (req, res) => {
    try {
        const productsData = req.body.products || req.body;
        
        if (!productsData || (Array.isArray(productsData) && productsData.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "No products data provided",
            });
        }
        
        const products = await Product.insertMany(productsData);
        
        res.status(201).json({
            success: true,
            message: `${products.length} products created successfully`,
            products,
        });
        
    } catch (error) {
        console.error("Product creation error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in product creation.",
            error: error.message,
        });
    }
};

export const allProductsController = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("All products error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in all products retrieval.",
            error: error.message,
        });
    }
};
export const getProductByIdController = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId); 
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found",
            });
        }
        
        res.status(200).json({
            success: true,
            product,
        });
        
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in get product ById retrieval.",
            error: error.message,
        });
    }
};