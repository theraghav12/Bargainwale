import Inventory from "../models/inventory.js";
import Order from "../models/orders.js";

const orderController = {
    createOrder: async (req, res) => {
        try {
            const { item, quantity, staticPrice, organization, ...rest } = req.body;
            const order = new Order({
                ...rest,
                item,
                quantity,
                staticPrice,
                organization,
            });
            await order.save();

            const inventoryCriteria = item.type === 'oil' ? 'Oil' : item.category;

            const inventoryUpdate = await Inventory.findOneAndUpdate(
                { itemName: inventoryCriteria },
                {
                    $inc: { quantity: quantity },
                    $setOnInsert: {
                        itemNumber: `INV${Date.now()}`,
                        itemDetails: {
                            weightPerItem: item.weightPerItem || 0,
                            categories: [item.category || '']
                        }
                    }
                },
                {
                    new: true,
                    upsert: true
                }
            );
            res.status(201).json({ message: 'Order created successfully', order, inventoryUpdate });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Error creating order', error });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving orders', error });
        }
    },
    getOrderById: async (req, res) => {
        try {
            const order = await Order.find({ organization: req.params.id });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving order', error });
        }
    },
    updateOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Order updated successfully', order });
        } catch (error) {
            res.status(400).json({ message: 'Error updating order', error });
        }
    },
    deleteOrder: async (req, res) => {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting order', error });
        }
    }
};

export default orderController;