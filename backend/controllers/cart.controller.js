import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

export const addCart = async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    let cart = await getCart(userId, guestId);
    if (cart) {
      const productIdx = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );
      if (productIdx > -1) {
        cart.products[productIdx].quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }
      //Recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.log("Error in addCart Controller ", error);
    res.status(500).send("Server Error");
  }
};

export const updateProductQuantity = async (req, res) => {
  const { productId, color, size, quantity, userId, guestId } = req.body;
  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIdx = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIdx > -1) {
      if (quantity > 0) {
        cart.products[productIdx].quantity = quantity;
      } else {
        cart.products.splice(productIdx, 1);
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json({ cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateProductQuantity Controller ", error);
    res.status(500).send("Server Error");
  }
};

export const deleteProduct = async (req, res) => {
  const { productId, size, color, userId, guestId } = req.body;
   console.log("Delete req.body", req.body);
  try {
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const productIdx = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIdx > -1) {
      cart.products.splice(productIdx, 1);
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in deleteProduct Controller ", error);
    res.status(500).send("Server Error");
  }
};

export const getUserCart = async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) res.json(cart);
    else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.log("Error in getUserCart Controller ", error);
    res.status(500).send("Server Error");
  }
};

export const guestToUserCart = async (req, res) => {
  const { guestId } = req.body;
  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(400).json({ message: "Guest Cart is Empty" });
      }
      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIdx = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );
          if (productIdx > -1) {
            userCart.products[productIdx].quantity += guestItem.quantity;
          } else {
            userCart.products.push(guestItem);
          }
        });
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.log(`Error deleting guest cart:${error}`);
        }
        res.status(200).json(userCart);
      } else {
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        return res.status(200).json(userCart);
      }
      res.status(404).json({message:"Guest Cart not found"})
    }
  } catch (error) {
    
    console.log("Error in guestToUserCart Controller ", error);
    res.status(500).send("Server Error");
  }
};
