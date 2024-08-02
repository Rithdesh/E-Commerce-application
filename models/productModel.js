const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: [true, "ID is required" ], unique:true },
    title: { type: String, required: true,unique:true },
    description: { type: String ,required: true},
    category: {type:String},
    price: {type:Number},
    images: {type:String},
    rating:{
         rate:{type:String},
         rating_count:{type:Number}
        }
    }
)

const Product = mongoose.model("products",productSchema)
module.exports = Product;
