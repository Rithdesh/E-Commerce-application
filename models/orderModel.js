const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },  // Ensure this is correct
  custname: { type: String, required: true },
  custphone: { type: String, required: true },
  custaddress: { type: String, required: true },
  orderdate: { type: Date, default: Date.now },
  estdeldate: { type: Date, required:true },
  products: [{
    productid: { type: String, required: true },  // Ensure this is correct
    title: String,
    price: Number,
    description: String,
    image: String,
    category: String,
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true }  // Ensure this is correct
  }],
  totalamount: { type: Number, required: true },
  orderstatus: { type: String, default: 'Pending' },
  user_id: { type: String, required: true },
  useremail: { type: String, required: true }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
