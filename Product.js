import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
    slug: { type: String, required: true, unique: true},
    description: { type: String},
    price: { type: Number, required: true},
    discount: { type: Number},
    listPrice: { type: Number},
    images: [{ type: String}],
    gender: { type: String},
    category: { type: String},
    brand: { type: String},
    tags: [{ type: String}],
    isPublished: { type: Boolean, default: false},
    avgRating: { type: Number, default: 0},
    numSales: { type: Number, default: 0},
    numReviews: { type: Number, default: 0},
    countStock: { type: Number, default: 0},
    colors: [{ type: String}],
    sizes: [{ type: String}],
    reviews: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number},
        comment: { type: String},
    },
],
},
{
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema, 'products');

export default Product;