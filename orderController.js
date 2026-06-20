import Order from "../models/Order.js";
import User from "../models/User.js";

export const createOrderController = async (req, res, next) => {
    const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({  
                success: false,
                message: "User not found",
            });
        }        
        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: "Order items are required",
            });
        }
        
        if (!totalPrice) {
            return res.status(400).json({
                success: false,
                message: "Total price is required",
            });
        }
        
        const order = new Order({
            userId: user._id,
            items,
            totalPrice,
            shippingAddress,
            paymentMethod,
            status: "pending", 
            createdAt: new Date(),
        });
        
        await order.save();
        
        res.status(201).json({
            success: true,
            message: "Order Created Successfully",
            order,
        });
        
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in create Order",
            error: error.message,  
        });
    }
};

export const getAllOrderLoggedInUserController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });  // ✅ Sort by newest first
        
        res.status(200).json({
            success: true,
            count: orders.length,
            message: "your all orders details",
            orders,
        });
        
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in fetching orders",
            error: error.message,
        });
    }
};

export const getOrderByIdLoggedInUserController = async (req, res) => {
    const { orderId } = req.params;
    
    try {
        const userId = req.user.userId;
        const order = await Order.findOne({ _id: orderId, userId: userId });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Your single order Details",
            order,
        });
        
    } catch (error) {
        console.error("Get order by ID error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in fetching order",
            error: error.message,
        });
    }
};

export const getAllOrdersController = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }
        
        const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        
        res.status(200).json({
            success: true,
            count: orders.length,
            message: "All orders details",
            orders,
        });
        
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in fetching all orders",
            error: error.message,
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }
        
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Valid statuses: pending, processing, shipped, delivered, cancelled",
            });
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
        
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error in updating order status",
            error: error.message,
        });
    }
};