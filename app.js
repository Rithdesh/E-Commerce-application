const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");
const cartRoutes = require('./Routes/cartRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const cors = require("cors")
const bodyparser = require("body-parser")
require('dotenv').config();


app.use(bodyparser.json());
app.use(express.json());


const dbURI = process.env.MONGODB_URI;

mongoose
    .connect(dbURI)
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });


app.set("view engine","ejs");

app.use("/",productRoutes,userRoutes,cartRoutes,orderRoutes);
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})