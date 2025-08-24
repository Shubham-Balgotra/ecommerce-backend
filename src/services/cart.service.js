const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model.js");
const Product = require("../models/product.model.js");

async function createCart(user) {
  try {
    const cart = new Cart({ user });
    return await cart.save();
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserCart(userId) {
  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItems = 0;

    for (let cartItem of cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItems += cartItem.quantity;
    }

    cart.totalPrice = totalPrice;
    cart.totalItem = totalItems;
    cart.discount = totalPrice - totalDiscountedPrice;

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addCartItem(userId, req) {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const product = await Product.findById(req.productId);
    if (!product) {
      throw new Error("Product not found");
    }

        //  Check for stock availability
    if (product.quantity < 1) {
      throw new Error("Product out of stock");
    }

    
    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId: userId,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        userId: userId,
        quantity: 1,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });

      await cartItem.save();
      return "Item added to cart";
    } else {
      isPresent.quantity += 1;
      await isPresent.save();
      return "Item quantity updated in cart";
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { createCart, findUserCart, addCartItem };
