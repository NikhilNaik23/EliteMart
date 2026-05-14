import Order from "../models/order.model.js";

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.log("Error in myOrders Controller ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ message: "Order is not found" });
    }
    res.json(order);
  } catch (error) {
    console.log("Error in getOrderDetails Controller ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
