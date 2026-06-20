import Cart from "../models/Cart.js";

export const createCartController = async (req, res) => {
    const { userId, items } = req.body;
    try {
        let cart = await Cart.findOne({ userId }); 

        if (cart) {
            cart.items.push(...items); 
        } else {
            cart = new Cart({ userId, items });
        }

        await cart.save();
        res.status(201).json({
            success: true,
            message: "Product Added to Cart.",
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error in adding to Cart",
            error: error.message, // Always use .message
        });
    }
};

export const getCartDataLoggedInUserController = async (req, res) => {
     const userId = req.user?._id || req.body.userId; 

    try {
          const cart = await Cart.findOne({ userId}).populate("items.productId");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Data Not Found",
            });
        }

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error in fetching Cart",
            error: error.message,
        });
    }
};