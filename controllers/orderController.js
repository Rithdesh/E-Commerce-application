const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel'); 
const { v4: uuidv4 } = require('uuid');

const placeOrder = async (req, res) => {
  try {
    const user_id = req.user;
    const { custname, custphone, custaddress, useremail } = req.body;

    const cart = await Cart.findOne({ user_id });
    console.log('Finding cart:', { user_id });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ msg: "Cart is empty or not found" });
    }

    const products = [];
    let totalamount = 0;

    for (const item of cart.products) {
      const product = await Product.findOne({ _id: item.product_id });
      if (product) {
        const totalPrice = product.price * item.quantity;
        totalamount += totalPrice;

        products.push({
          productid: item.product_id,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.images,
          category: product.category,
          quantity: item.quantity,
          amount: totalPrice,
          rating: product.rating
        });
      } else {
        console.log(`Product not found for ID: ${item.product_id}`);
      }
    }

    const orderdate = new Date();
    const estdeldate = new Date();
    estdeldate.setDate(orderdate.getDate() + 5);

    const newOrder = new Order({
      order_id:uuidv4(),
      custname,
      custphone,
      custaddress,
      orderdate,
      estdeldate,
      products,
      totalamount,
      orderstatus: 'Pending',
      user_id,
      useremail
    });

    await newOrder.save();
    await Cart.deleteOne({ user_id }); 
    
    // Return the order details with subtotal, excluding duplicate product array
    res.status(200).json({ 
      msg: "Order placed successfully", 
      order: newOrder,
      subtotal: totalamount 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//get all the orders of a specific user

const getOrders = async (req, res) => {
  try {
    const user_id = req.user;
    const orders = await Order.find({ user_id });

    if (!orders) {
      return res.status(404).json({ msg: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};



module.exports = { placeOrder,getOrders };