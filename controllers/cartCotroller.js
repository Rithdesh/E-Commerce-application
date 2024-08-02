const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add or update cart
const addOrUpdateCart = async (req, res) => {
    const { product_id, quantity, action } = req.body; 
    const user_id = req.user; 

    try {
        let cart = await Cart.findOne({ user_id });

        if (!cart) {
            // Cart does not exist, create a new cart
            cart = new Cart({
                user_id,
                products: [{ product_id, quantity }]
            });
        } else {
            const productIndex = cart.products.findIndex(p => p.product_id === product_id);

            if (productIndex > -1) {
                switch (action) {
                    case 'increment':
                        cart.products[productIndex].quantity += 1; 
                        break;
                    case 'decrement':
                        if (cart.products[productIndex].quantity === 1) { // Remove the product if its quantity is 1 
                            cart.products.splice(productIndex, 1);
                        } else {
                            cart.products[productIndex].quantity -= 1; 
                        }
                        break;
                    case 'add':
                        cart.products[productIndex].quantity = quantity; 
                        break;
                    default:
                        return res.status(400).json({ message: 'Invalid action' });
                }
            } else {
                if (action === 'add' || action === 'increment') {
                    cart.products.push({ product_id, quantity });
                } else {
                    return res.status(400).json({ message: 'Product not found in cart for the given action' });
                }
            }

            // Delete cart if all products are removed
            if (cart.products.length === 0) {
                await cart.deleteOne(); 
                return res.json({ message: 'Cart deleted as all products have been removed' });
            }
        }

        // Save the updated cart
        await cart.save();
        res.json({ message: 'Cart updated', cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all products in the cart by user ID
const getCartDetails = async (req, res) => {
    const user_id = req.user;
    console.log('User ID:', user_id); // Verify user ID

    try {
        const cart = await Cart.findOne({ user_id });
        console.log('Finding cart:', { user_id }); // Log the query

        if (cart) {
            const productDetails = [];
            let subtotal = 0;

            for (const item of cart.products) {
                const product = await Product.findOne({ _id: item.product_id });
                if (product) {
                    const totalPrice = product.price * item.quantity;
                    subtotal += totalPrice;

                    productDetails.push({
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        category: product.category,
                        price: product.price,
                        images: product.images,
                        quantity: item.quantity,
                        totalPrice: totalPrice
                    });
                } else {
                    console.log(`Product not found for product_id: ${item.product_id}`);
                }
            }

            res.json({
                products: productDetails,
                subtotal: subtotal
            });
        } else {
            res.status(404).json({ message: "User doesn't have a cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// Delete a certain product from the cart by product_id
const deleteItems = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user;

    try {
        const cart = await Cart.findOne({ user_id });

        if (cart) {
            const productIndex = cart.products.findIndex(p => p.product_id === product_id);

            if (productIndex > -1) {
                cart.products.splice(productIndex, 1); // Remove the product

                if (cart.products.length === 0) {
                    await cart.deleteOne(); // Delete the entire cart if it's empty
                    return res.json({ message: 'Cart deleted as it is now empty' });
                } else {
                    await cart.save(); // Save the cart after removing the product
                    return res.json({ message: 'Product removed from cart', cart });
                }
            } else {
                return res.status(404).json({ message: 'Product not found in cart' });
            }
        } else {
            return res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addOrUpdateCart, getCartDetails, deleteItems };
