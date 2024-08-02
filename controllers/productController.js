const Product = require("../models/productModel")
const { v4: uuidv4 } = require('uuid');
//get all the products
const getAllProducts = async(req,res)=>{
   try
    {
        const products = await Product.find();
        console.log("fetching...");
        res.json(products);
    } 
    catch(err){
        console.error(err);
    }
};

//CREATING A NEW PRODUCT
const createProducts = async(req,res)=>{
    try {
        const { id, title, description, category, price, images, rating } = req.body;
        const newProduct = new Product({
            id:uuidv4(),
            title,
            description,
            category,
            price,
            images,
            rating
        });
        await newProduct.save();
        console.log("saving...")
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error",err);
    }
}

//DELETING A PRODUCT BY ID
const deletebyid = async (req, res) => {
    const { id } = req.params; // 
    try {
        const result = await Product.findOneAndDelete({ _id: id });
        if (result) {
            console.log("Deleting...");
            res.send("Product deleted successfully");
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


//UPDATING A PRODUCT BY ID
const updateProductByid = async (req, res) => {
    const { id } = req.params; 
    const updateData = req.body; 
    try {
        const result = await Product.findOneAndUpdate({ _id: id }, updateData, { new: true, runValidators: true });
        if (result) {
            console.log("Updating...");
            res.json({ message: 'Product updated successfully', result });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports= {getAllProducts,
    createProducts,
    deletebyid,
    updateProductByid};